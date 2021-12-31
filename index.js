// External modules
// const g_state = {app: undefined}
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes
const package_info = require('./package.json')
const user_fs = require("./user_fs")
const secure_validate = require("./security_and_validation")

const app = express()
let  port = 2718


// General app settings
const set_content_type = function (req, res, next)
{
    res.setHeader("Content-Type", "application/json; charset=utf-8")
    next()
}

app.use( set_content_type )
app.use(express.json())  // to support JSON-encoded bodies
// app.use(express.urlencoded( // to support URL-encoded bodies
//     {
//         extended: true
//     }))




// Version
async function get_version( req, res)
{
    const version_obj = { version: package_info.version, description: package_info.description }
    res.send(  JSON.stringify( version_obj) )
}

async function list_users( req, res)
{
    res.send(  JSON.stringify( user_fs.get_users()) )
}

async function delete_user( req, res )
{
    const id =  parseInt( req.params.id )

    if ( id <= 0)
    {
        res.status( StatusCodes.BAD_REQUEST )
        res.send( "Bad id given")
        return
    }

    if ( id == 1)
    {
        res.status( StatusCodes.FORBIDDEN ) // Forbidden
        res.send( "Can't delete root user")
        return
    }

    const idx =  g_users.findIndex( user =>  user.id == id )
    if ( idx < 0 )
    {
        res.status( StatusCodes.NOT_FOUND )
        res.send( "No such user")
        return
    }

    g_users.splice( idx, 1 )
    res.send(  JSON.stringify( {}) )
}

async function create_user( req, res )
{
    // No authentication needed
    //Validations
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
            name: req.body.full_name,
            email: req.body.email,
            u_status: "created",
            password: secure_validate.make_hash_password(req.body.password),
            time: new Date().toJSON(),
            posts: [],
            messages: []
        }
        const id = await user_fs.add_user(new_user) // Add new user to DB
        // const res_user  = await user_fs.find_user(id) // Find it in the DB to check it was saved correctly
        const { u_id, u_status, time }  = await user_fs.find_user(id) // Find it in the DB to check it was saved correctly
        const res_user = { u_id, u_status, time }
        res.status(StatusCodes.OK)
        res.json(res_user)
    }
}

async function update_user( req, res )
{
    const id =  parseInt( req.params.id )

    if ( id <= 0)
    {
        res.status( StatusCodes.BAD_REQUEST )
        res.send( "Bad id given")
        return
    }

    const idx =  g_users.findIndex( user =>  user.id == id )
    if ( idx < 0 )
    {
        res.status( StatusCodes.NOT_FOUND )
        res.send( "No such user")
        return
    }

    const name = req.body.name

    if ( !name)
    {
        res.status( StatusCodes.BAD_REQUEST )
        res.send( "Missing name in request")
        return
    }

    const user = g_users[idx]
    user.name = name

    res.send(  JSON.stringify( {user}) )
}

async function send_admin_message(req, res) {

}

async function delete_admin_message(req, res) {

}


async function login_user(req, res) {
    // No authentication needed
    //Validations
    if (!req.body.hasOwnProperty('email') ||
        !req.body.hasOwnProperty('password')) 
    {
        res.status(StatusCodes.BAD_REQUEST)
        res.json({error: "Missing information."})
    }
    else if(!secure_validate.is_email_valid(req.body.email) ||
            !secure_validate.is_password_valid(req.body.password) ||
            (!await user_fs.is_email_exist(req.body.email))) 
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
        else if (secure_validate.verify_user_password(user, req.body.password) &&
                (user.u_status === "deleted" || user.u_status === "suspended"))
        {
            res.status(StatusCodes.UNAUTHORIZED)
            res.json({error: "Account was suspended or deleted."})
        }
        else
        {
            const res_user = { token: "OK" } //TODO retunr TOKEN not PASSWORD!!!!
            res.status(StatusCodes.OK)
            res.json(res_user)
        }
    }

}

async function create_user_post(req, res) {

}

async function delete_user_post(req, res) {

}

async function get_user_post(req, res) {

}

async function get_user_message(req, res) {

}

async function send_user_message(req, res) {

}

// Routing
const router = express.Router()

// TODO maybe connect some admin methods with user and distinguish between them with token.
router.get('/version', async (req, res) => { await get_version(req, res ) })

router.get('/admin/users', async (req, res) => { await list_users(req, res ) })
router.put('/admin/status', async (req, res) => { await update_user(req, res ) })
router.post('/admin/message', async (req, res) => { await send_admin_message(req, res ) })
router.delete('/admin/post', async (req, res) => { await delete_admin_message(req, res ) })

router.delete('/user', async (req, res) => { await delete_user(req, res ) })
router.post("/user/register", async (req, res) => { await create_user(req, res ) })
router.post("/user/login", async (req, res) => { await login_user(req, res ) })
router.post('/user/post', async (req, res) => { await create_user_post(req, res ) })
router.delete('/user/post', async (req, res) => { await delete_user_post(req, res ) })
router.get('/user/post', async (req, res) => { await get_user_post(req, res ) })
router.get('/user/message', async (req, res) => { await get_user_message(req, res ) })
router.post('/user/message', async (req, res) => { await send_user_message(req, res ) })


app.use('/api',router)


// Init

user_fs.initialize_db(`./`).then(async res => {
    // user_fs.add_post({id: 3000}, "LOVE YOU!")
    // console.log(await user_fs.get_users())
    // console.log(await user_fs.find_user(0))
    let msg = `${package_info.description} listening at port ${port}`
    app.listen(port, () => { console.log( msg )  })

}).catch(res => console.log(`Server can't start - no DB, error ${res}`))




