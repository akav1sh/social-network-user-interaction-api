// External modules
const g_state = {app: undefined}
const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes
const package_info = require('./package.json')
const user_fs = require("./user_fs")

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
app.use(express.urlencoded( // to support URL-encoded bodies
    {
        extended: true
    }))



// User's table
const g_users = [ {id:1, name: 'Root'} ] //make a file

// API functions

// Version
function get_version( req, res)
{
    const version_obj = { version: package_info.version, description: package_info.description }
    res.send(  JSON.stringify( version_obj) )
}

function list_users( req, res)
{
    res.send(  JSON.stringify( user_fs.get_users()) )
}

function get_user( req, res )
{
    const id =  parseInt( req.params.id )

    if ( id <= 0)
    {
        res.status( StatusCodes.BAD_REQUEST )
        res.send( "Bad id given")
        return
    }

    const user =  g_users.find( user =>  user.id == id )
    if ( !user)
    {
        res.status( StatusCodes.NOT_FOUND )
        res.send( "No such user")
        return
    }

    res.send(  JSON.stringify( user) )
}

function delete_user( req, res )
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

function create_user( req, res )
{
    const name = req.body.name

    if ( !name)
    {
        res.status( StatusCodes.BAD_REQUEST )
        res.send( "Missing name in request")
        return
    }


    // Find max id
    let max_id = 0
    g_users.forEach(
        item => { max_id = Math.max( max_id, item.id) }
    )

    const new_id = max_id + 1
    const new_user = { id: new_id , name: name}
    g_users.push( new_user  )

    res.send(  JSON.stringify( new_user) )
}

function update_user( req, res )
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

function send_admin_message(req, res) {

}

function delete_admin_message(req, res) {

}


function login_user(req, res) {

}

function create_user_post(req, res) {

}

function delete_user_post(req, res) {

}

function get_user_post(req, res) {

}

function get_user_message(req, res) {

}

function send_user_message(req, res) {

}

// Routing
const router = express.Router()

// TODO maybe connect some admin methods with user and distinguish between them with token.
router.get('/version', (req, res) => { get_version(req, res ) })

router.get('/admin/users', (req, res) => { list_users(req, res ) })
router.put('/admin/status', (req, res) => { update_user(req, res ) })
router.post('/admin/message', (req, res) => { send_admin_message(req, res ) })
router.delete('/admin/post', (req, res) => { delete_admin_message(req, res ) })

router.delete('/user', (req, res) => { delete_user(req, res ) })
router.post("/user/register", (req, res) => { create_user(req, res ) })
router.post("/user/login", (req, res) => { login_user(req, res ) })
router.post('/user/post', (req, res) => { create_user_post(req, res ) })
router.delete('/user/post', (req, res) => { delete_user_post(req, res ) })
router.get('/user/post', (req, res) => { get_user_post(req, res ) })
router.get('/user/message', (req, res) => { get_user_message(req, res ) })
router.post('/user/message', (req, res) => { send_user_message(req, res ) })


app.use('/api',router)


// Init

user_fs.initialize_db(`./`).then(async res => {
    user_fs.add_post({id: 3000}, "LOVE YOU!")
    // console.log(await user_fs.get_users())
    console.log(await user_fs.find_user(3000))
    let msg = `${package_info.description} listening at port ${port}`
    app.listen(port, () => { console.log( msg )  })

}).catch(res => console.log(`Server can't start - no DB, error ${res}`))




