// External modules
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes
const package_info = require('./package.json')
const user_fs = require("./user_fs")
const secure_validate = require("./security_and_validation")

const app = express()
let  port = 2718

const all = "0"
const admin_id = "1"
const user_type = '3'
const post_type = '7'
const message_type = '9'

// General app settings
const set_content_type = function (req, res, next) {
    res.setHeader("Content-Type", "application/json; charset=utf-8")
    next()
}

app.use( set_content_type )
app.use(express.json())  // to support JSON-encoded bodies

// Version
async function get_version( req, res) {
    const version_obj = { version: package_info.version, description: package_info.description }
    res.send(  JSON.stringify( version_obj) )
}

async function list_users( req, res) {
    console.log(req.token_info.id)
    const admin = req.token_info.id === admin_id
    // YES Authentication needed!

    const users = await user_fs.get_users()
    res.status(StatusCodes.OK)
    //Fix admin or user from TOKEN
    if (admin)
    {
        res.json({users: users})
    }
    else
    {
        res.json({users: users.map(user => {
            delete user.email
            delete user.u_status
            delete user.posts
            return user
        })})
    }
}

async function delete_user( req, res ) {
    // YES Authentication needed!
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

        if (!secure_validate.verify_user_password(user, req.password))
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
            const res_user = {u_id: u_id, u_status: "deleted"}
            res.status(StatusCodes.OK)
            res.json(res_user)
        }
    }
}

async function create_user( req, res ) {
    // No authentication needed
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
}

async function update_user_status( req, res ) {
    // YES authentication needed
    // Validation
    if(!req.body.hasOwnProperty("u_id") ||
       !req.body.hasOwnProperty("u_status"))
    {
        res.status(StatusCodes.BAD_REQUEST)
        res.json({error: "Missing information."})
    }
    else if(!secure_validate.is_id_valid(user_type, req.body.u_id) ||
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
            const { u_id, u_status } = await user_fs.update_user_status(user_to_update.u_id, req.body.u_status)
            const res_user = { u_id, u_status }
            res.status(StatusCodes.OK)
            res.json(res_user)
        }
    }
}

async function send_admin_message(req, res) {

}

async function delete_admin_message(req, res) {

}

async function login_user(req, res) {
    // No authentication needed
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
    {   //check for if found
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
            const res_token = secure_validate.create_token(user)
            await user_fs.add_token(res_token.token)
            res.status(StatusCodes.OK)
            res.json(res_token)
        }
    }

}

async function logout_user(req, res) {
    // YES authentication needed

    await user_fs.remove_token(req.token)
    res.status(StatusCodes.OK)
}

async function create_user_post(req, res) {

    // YES authentication needed
    // Validation
    if(!req.body.hasOwnProperty("text"))
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
        res.status(StatusCodes.OK)
        res.json(new_post)
    }
}

async function delete_user_post(req, res) {
    

}

async function get_user_post(req, res) {
    // YES authentication needed
    // Validation
    if(!req.body.hasOwnProperty("u_id") ||
        !req.body.hasOwnProperty("post_amount"))
    {
        res.status(StatusCodes.BAD_REQUEST)
        res.json({error: "Missing information."})
    }
    else
    {
        const u_id = req.body.u_id
        const post_amount = req.body.post_amount
        let posts = undefined
        if (u_id !== all)
        {
            const user = await user_fs.find_user_by_id(u_id)
            posts = user.posts.filter(post => post.p_status === "active")
        }
        else
        {
            posts = await user_fs.get_posts()
        }
        
        if (post_amount !== all)
                posts = posts.slice(-post_amount)

        res.status(StatusCodes.OK)
        res.json(posts)
    }

}

async function get_user_message(req, res) {

}

async function send_user_message(req, res) {

}

function authenticateToken(req, res, next)
{
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    req.token = token
    if (token == null) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    try {
        req.token_info = secure_validate.verify_token(token)
        next()
    } catch (err)
    {
        res.sendStatus(StatusCodes.FORBIDDEN)
    }
}

// Routing
const router = express.Router()

// TODO maybe connect some admin methods with user and distinguish between them with token.
router.get('/version', async (req, res) => { await get_version(req, res ) })

router.get('/admin/users', authenticateToken, async (req, res) => { await list_users(req, res ) })
router.put('/admin/status', authenticateToken, async (req, res) => { await update_user_status(req, res ) })
router.post('/admin/message', authenticateToken, async (req, res) => { await send_admin_message(req, res ) })
router.delete('/admin/post', authenticateToken,async (req, res) => { await delete_admin_message(req, res ) })

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


app.use('/api',router)


// Init

user_fs.initialize_db(`./`).then(async res => {
    // user_fs.add_post({id: 3000}, "LOVE YOU!")
    // console.log(await user_fs.get_users())
    // console.log(await user_fs.find_user_by_id(0))
    let msg = `${package_info.description} listening at port ${port}`
    app.listen(port, () => { console.log( msg )  })

}).catch(res => console.log(`Server can't start - no DB, error ${res}`))




