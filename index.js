// External modules
// const g_state = {app: undefined}
const express = require('express')
const path = require("path")
const StatusCodes = require('http-status-codes').StatusCodes
const package_info = require('./package.json')
const user_fs = require("./user_fs")
const secure_validate = require("./security_and_validation")
const schedule = require('node-schedule')

const app = express()
let  port = 2718

// For readability - we don't use 7 and 9 but they are mentioned here to understand
const all = "0"
const admin_id = "1"
const user_type = '3'
const post_type = '7'
const message_type = '9'

// General app settings
const reExt = /\.([a-z]+)/i

function content_type_from_extension( url)
{
    const m = url.match( reExt )
    if ( !m ) return 'application/json'
    const ext = m[1].toLowerCase()

    switch( ext )
    {
        case 'js': return 'text/javascript'
        case 'css': return 'text/css'
        case 'html': return 'text/html'
    }

    return 'text/plain'
}

const set_content_type = function (req, res, next)
{
    const content_type = req.baseUrl == '/api' ? "application/json; charset=utf-8" : content_type_from_extension( req.url)
    res.setHeader("Content-Type", content_type)
    next()
}


app.use(  set_content_type )
app.use(express.json())  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
    {
        extended: true
    }))


// Repeated function every 10 mins to remove expired tokens
async function remove_expired_tokens(){
    try {
        let tokens_from_db = await user_fs.get_tokens()
        if (tokens_from_db) {
            const tokens_to_delete = await tokens_from_db.reduce(async (tokens_to_delete ,token) => {
                try {
                    await secure_validate.verify_token(token)
                    return tokens_to_delete
                } catch (err) {
                    return (await tokens_to_delete).concat(token)
                }
            }, [])

            for (let old_token of tokens_to_delete) {
                await user_fs.remove_token(old_token)
            }
        }
    }catch (err) {
        console.error(err.stack)
    }
}

// Version
async function get_version( req, res) {
    try {
        const version_obj = {version: package_info.version, description: package_info.description}
        res.status(StatusCodes.OK)
        res.json(version_obj)
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

async function get_landing_page(req, res) {
    try{
        res.status(StatusCodes.OK)
        res.type('html')
        res.sendFile(__dirname + "/site/index.html")
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

async function is_logged_user(req, res) {
    try{
        const u_token_id = req.token_info.id
        const user = await user_fs.find_user_by_id(u_token_id)
        const {u_id, full_name} = user
        const res_user = {u_id, full_name}
        res.json(res_user)
    }catch (err){
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// Function lists all users - admin receives more information than regular user
// Input: No body needed 
async function list_users( req, res) {
    try {
        const admin = req.token_info.id === admin_id
        const users = await user_fs.get_users()
        res.status(StatusCodes.OK)

        if (admin) {
            res.json({users: users})
        } else {
            res.json({
                users: users.map(user => {
                    delete user.email
                    delete user.u_status
                    delete user.posts
                    return user
                })})
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// Function deletes user - called by user himself and asks for user password
// Input: Body requires user password
async function delete_user( req, res ) {
    try {
        // Validations
        if (!req.body.hasOwnProperty('password'))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else if (req.token_info.id === admin_id)
        {
            res.status(StatusCodes.FORBIDDEN)
            res.json({error: "Cannot delete root."})
        }
        else
        {
            const u_id = req.token_info.id
            const user = await user_fs.find_user_by_id(u_id)

            if (!secure_validate.verify_user_password(user, req.body.password))
            {
                res.status(StatusCodes.UNAUTHORIZED)
                res.json({error: "Invalid password."})
            }
            else if (!secure_validate.verify_status_update(user, "deleted"))
            {
                res.status(StatusCodes.CONFLICT)
                res.json({error: "This user cannot be updated with this status."})
            }
            else
            {
                await user_fs.update_user_status(u_id, "deleted")
                await user_fs.remove_token(req.token)
                const res_user = {u_id: u_id, u_status: "deleted"}
                res.status(StatusCodes.OK)
                res.json(res_user)
            }
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// Function is a sign up new user creation
// Input: full name, email and password
async function create_user( req, res ) {
    try {
        // Validations
        if (!req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('password') ||
            !req.body.hasOwnProperty('full_name'))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else if(!secure_validate.is_email_valid(req.body.email) ||
                !secure_validate.is_password_valid(req.body.password) ||
                await user_fs.is_email_exist(req.body.email))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Invalid email or password."})
        }
        else
        {
            let new_user = {
                full_name: req.body.full_name,
                email: req.body.email,
                u_status: "created",
                password: secure_validate.make_hash_password(req.body.password),
                time: new Date().toJSON(),
                posts: [],
                messages: []
            }
            const id = await user_fs.add_user(new_user) // Add new user to DB
            const { u_id, u_status, time }  = await user_fs.find_user_by_id(id) // Find it in the DB to check it was saved correctly
            const res_user = { u_id, u_status, time }
            res.status(StatusCodes.OK)
            res.json(res_user)
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// Function updates user status by admin
// Input: ID of user to update and new status (active/suspended/deleted)
async function update_user_status( req, res ) {
    try {
        // Validation
        if (!req.body.hasOwnProperty("u_id") ||
            !req.body.hasOwnProperty("u_status"))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else if (!secure_validate.is_id_valid(user_type, req.body.u_id) ||
            !secure_validate.is_user_status_valid(req.body.u_status))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Invalid u_id or u_status."})
        }
        else
        {
            const u_id = req.token_info.id
            const user_to_update = await user_fs.find_user_by_id(req.body.u_id)
            if (u_id !== admin_id)
            {
                res.status(StatusCodes.FORBIDDEN)
                res.json({error: "Only admin can do this action."})
            }
            else if (user_to_update === undefined)
            {
                res.status(StatusCodes.NOT_FOUND)
                res.json({error: "User not found."})
            }
            else if (!secure_validate.verify_status_update(user_to_update, req.body.u_status))
            {
                res.status(StatusCodes.CONFLICT)
                res.json({error: "This user cannot be updated with this status."})
            }
            else
            {
                const {u_id, u_status} = await user_fs.update_user_status(user_to_update.u_id, req.body.u_status)
                const res_user = {u_id, u_status}
                res.status(StatusCodes.OK)
                res.json(res_user)
            }
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This is a login function that gives user a token to use
// Input: Email and password
async function login_user(req, res) {
    try {
        // Validations
        if (!req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('password'))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else if (!await user_fs.is_email_exist(req.body.email))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Invalid email or password."})
        }
        else
        {
            const user = await user_fs.find_user_by_email(req.body.email)

            if (!secure_validate.verify_user_password(user, req.body.password))
            {
                res.status(StatusCodes.BAD_REQUEST)
                res.json({error: "Invalid email or password."})
            }
            else if (user.u_status === "deleted" || user.u_status === "suspended")
            {
                res.status(StatusCodes.UNAUTHORIZED)
                res.json({error: "Account was suspended or deleted."})
            }
            else if (user.u_status === "created")
            {
                res.status(StatusCodes.UNAUTHORIZED)
                res.json({error: "This account has not yet been activated."})
            }
            else
            {
                const res_data = secure_validate.create_token(user)
                res_data.u_id = user.u_id
                res_data.full_name = user.full_name
                res.cookie('token', res_data.token, {path: '/api'})
                await user_fs.add_token(res_data.token)
                res.status(StatusCodes.OK)
                res.json(res_data)
            }
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This function logs user out, rendering his token invalid
// Input: No body needed
async function logout_user(req, res) {
    try {
        await user_fs.remove_token(req.token)
        res.status(StatusCodes.OK)
        res.json({})
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This function creates a post for a user
// Input: Text
async function create_user_post(req, res) {
    try {
        // Validation
        if (!req.body.hasOwnProperty("text"))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else
        {
            const u_id = req.token_info.id
            const user = await user_fs.find_user_by_id(u_id)
            let new_post = {
                text: req.body.text,
                time: new Date().toJSON(),
                p_status: "active"
            }

            await user_fs.add_post(user, new_post)
            const {p_id, time} = new_post
            const res_post = {p_id, time}
            res.status(StatusCodes.OK)
            res.json(res_post)
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This function deletes a post for a user
// Input: Post ID 
async function delete_user_post(req, res) {
    try {
        // Validation
        if (!req.body.hasOwnProperty("p_id"))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else
        {
            const u_id = req.token_info.id
            const p_id = req.body.p_id
            const user = await user_fs.find_user_by_id(u_id)

            if (!user.posts.find(post => post.p_id === p_id))
            {
                res.status(StatusCodes.NOT_FOUND)
                res.json({error: "No post with provided id was found."})
            }
            else
            {
                await user_fs.update_delete_post(u_id, p_id)
                res.status(StatusCodes.OK)
                res.json({p_id})
            }
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This function gets posts for user
// Input: User id or 0 to view all posts from all, post amount or 0 for all posts available
async function get_user_post(req, res) {
    try {
        //  Validation
        if (!req.query.hasOwnProperty("u_id") ||
            !req.query.hasOwnProperty("post_amount"))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else
        {
            const u_id = req.query.u_id
            const post_amount = req.query.post_amount
            let posts = undefined
            if (u_id !== all)
            {
                const user = await user_fs.find_user_by_id(u_id)
                posts = user.posts.filter(post => post.p_status === "active")
            }
            else
                posts = await user_fs.get_posts()


            if (post_amount !== all)
                posts = posts.slice(-post_amount)

            res.status(StatusCodes.OK)
            res.json({posts})
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This function sends message from admin to all users
// Input: Text
async function admin_broadcast(req, res) {
    try {
        if (!req.body.hasOwnProperty('text'))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else
        {
            const admin = req.token_info.id === admin_id
            let admin_user = await user_fs.find_user_by_id(admin_id)

            if (admin)
            {    let new_message = {
                    text: req.body.text,
                    m_status: "unread",
                    time: new Date().toJSON(),
                    sender_id: req.token_info.id,
                    receiver_id: undefined
                }
                const message_id = await user_fs.add_broadcast_message(admin_user, new_message)
                admin_user = await user_fs.find_user_by_id(admin_id)

                const {m_id, m_status, text, time} = admin_user.messages.find(message => {
                    return message.m_id === message_id
                })
                new_message = {m_id, m_status, text, time}
                res.status(StatusCodes.OK)
                res.json(new_message)
            }
            else
            {
                res.status(StatusCodes.FORBIDDEN)
                res.json({error: "Forbidden"})
            }
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This function returns messages for user
// Input: Sender id or 0 for messages from all the users and status of message (all/read/unread)
async function get_user_message(req, res) {
    try {
        if (!req.query.hasOwnProperty('sender_id') ||
            !req.query.hasOwnProperty('m_status') ||
            !req.query.hasOwnProperty('message_amount'))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else if (!secure_validate.is_message_status_valid(req.query.m_status) ||
            (req.query.sender_id !== all && req.query.sender_id !== admin_id && !secure_validate.is_id_valid(user_type, req.query.sender_id)) ||
            isNaN(parseInt(req.query.message_amount)))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Invalid sender_id or m_status."})
        }
        else
        {
            let messages = await user_fs.get_messages(req.token_info.id, req.query.sender_id, req.query.m_status)

            if(req.query.message_amount !== all) {
                messages = messages.slice(-req.query.message_amount)
            }

            res.status(StatusCodes.OK)
            res.json({messages: messages})
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This functions sends message from user to another user
// Input: ID of user to send to and text
async function send_user_message(req, res) {
    try {
        if (!req.body.hasOwnProperty('text') ||
            !req.body.hasOwnProperty('receiver_id'))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Missing information."})
        }
        else if (req.body.receiver_id !== admin_id && !secure_validate.is_id_valid(user_type, req.body.receiver_id))
        {
            res.status(StatusCodes.BAD_REQUEST)
            res.json({error: "Invalid receiver_id or m_status."})
        }
        else
        {
            let sender = await user_fs.find_user_by_id(req.token_info.id)
            const receiver = await user_fs.find_user_by_id(req.body.receiver_id)
            let new_message = {
                text: req.body.text,
                m_status: "unread",
                time: new Date().toJSON(),
                sender_id: req.token_info.id,
                receiver_id: req.body.receiver_id
            }
            const message_id = await user_fs.add_message(sender, receiver, new_message)
            sender = await user_fs.find_user_by_id(req.token_info.id)

            const {receiver_id, m_id, m_status, text, time} = sender.messages.find(message => {
                return message.m_id === message_id
            })
            new_message = {receiver_id, m_id, m_status, text, time}
            res.status(StatusCodes.OK)
            res.json(new_message)
        }
    }catch (err) {
        console.error(err.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.json({error: "Internal Server Error."})
    }
}

// This is a middleware function to make sure authentication is valid
async function authenticateToken(req, res, next) {
    try {
        let token
        if ("authorization" in req.headers) {
            const authHeader = req.headers.authorization
            token = authHeader.split(' ')[1]
        } else if (req.headers.cookie) {
            const cookie = req.headers.cookie
            token = cookie.split(/; */).find(cookie => cookie.split('=')[0] === 'token').split('=')[1]
        } else {
            token = null
        }
        req.token = token

        if (token == null) {
            res.status(StatusCodes.UNAUTHORIZED)
            return res.json({error: "Unauthorized"})
        }
    }catch (err){
        res.status(StatusCodes.BAD_REQUEST)
        return res.json({error: "Might be a token issue."})
    }

    try {
        req.token_info = await secure_validate.verify_token(req.token)
        const user = await user_fs.find_user_by_id(req.token_info.id)
        if (user.u_status !== "active")
            throw Error("Status is not active.")
        next()
    } catch (err)
    {
        res.status(StatusCodes.FORBIDDEN)
        res.json({error: "Forbidden"})
    }
}

app.get('/', async (req, res) => { await get_landing_page(req, res ) })

// Routing
const router = express.Router()

router.get('/version', async (req, res) => { await get_version(req, res ) })
router.put('/admin/status', authenticateToken, async (req, res) => { await update_user_status(req, res ) })
router.post('/admin/broadcast', authenticateToken, async (req, res) => { await admin_broadcast(req, res ) })
router.delete('/user', authenticateToken, async (req, res) => { await delete_user(req, res ) })
router.get('/users', authenticateToken, async (req, res) => { await list_users(req, res ) })
router.post("/user/register", async (req, res) => { await create_user(req, res ) })
router.post("/user/login", async (req, res) => { await login_user(req, res ) })
router.post("/user/logout", authenticateToken, async (req, res) => { await logout_user(req, res ) })
router.post('/user/post', authenticateToken,async (req, res) => { await create_user_post(req, res ) })
router.delete('/user/post', authenticateToken, async (req, res) => { await delete_user_post(req, res ) })
router.get('/user/post', authenticateToken, async (req, res) => { await get_user_post(req, res ) })
router.get('/user/message', authenticateToken, async (req, res) => { await get_user_message(req, res ) })
router.post('/user/message', authenticateToken, async (req, res) => { await send_user_message(req, res ) })


router.get('/user/logged', authenticateToken, async (req, res) => { await is_logged_user(req, res ) })

app.use(express.static(path.join(__dirname, 'site')));

app.use('/api',router)



// Init
schedule.scheduleJob('*/10 * * * *', remove_expired_tokens)

user_fs.initialize_db(`./`).then(async res => {
    let msg = `${package_info.description} listening at port ${port}`
    app.listen(port, () => { console.log( msg )  })

}).catch(res => console.log(`Server can't start - no DB, error ${res}`))




