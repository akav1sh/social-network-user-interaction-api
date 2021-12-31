const fs = require("fs").promises

let db_file
// TODO comment
// const user_type = '3'
// const post_type = '7'
// const message_type = '9'
let current_user_id = undefined
let current_post_id = undefined
let current_message_id = undefined

//TODO make read / write to fs wrapper for errors
// User_fs handles the DB file, receive and returning usable JSON objects of required data.

async function exists( path )
{
    try {
        await fs.stat( path )
        return true
    }
    catch( e )
    {
        return false
    }    
}

async function initialize_db(path)
{
    try
    {
        if(await exists(path + "db"))
        {
            console.log("DB file already exists, not creating a new one!")
        }
        else
        {
            //TODO fix password check if all necessary properties there
            console.log("DB file is missing, creating a new one.")
            await fs.writeFile(path + "db", JSON.stringify({
                users: [{
                    u_id: 0,
                    name: 'Root',
                    email: "root@mta.ac.il",
                    u_status: "active",
                    password: undefined,
                    posts: [],
                    messages: []
            }]}))
            console.log("Done creating the file!")
        }
        db_file = path + "db"
        return true
    }
    catch (e)
    {
        console.log(`Error: ${e}`)
        //TODO add error handling
        throw e
    }
}

async function get_users()
{
    return await fs.readFile(db_file)
        .then(res => {return JSON.parse(res.toString('utf-8'))})
        .catch(err => {console.log("Can't parse db")})
}

async function find_user_by_id(user_id) {
    return await fs.readFile(db_file)
        .then(res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user_id for mistakes
            return db_json.users.find(user => user.u_id === user_id)
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function update_user_status(user_id, new_status)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user for mistakes
            const user = db_json.users.find(user => user.u_id === user_id)
            user.u_status = new_status
            await fs.writeFile(db_file, JSON.stringify(db_json))
            return user
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function add_user(user)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user for mistakes
            user.u_id = get_new_id("user")
            db_json.users.push(user)
            await fs.writeFile(db_file, JSON.stringify(db_json))
            return user.u_id
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function add_message(sender_user, receiver_user, message)
{
    await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check users for mistakes
            db_json.users.forEach(user => {
                if(user.u_id === sender_user.u_id || user.u_id === receiver_user.u_id)
                {
                    message.m_id = get_new_id("message")
                    user.messages.push(message)
                }
            })
            await fs.writeFile(db_file, JSON.stringify(db_json))
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}


async function add_post(poster, post)
{
    await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check users for mistakes
            db_json.users.forEach(user => {
                if(user.u_id === poster.u_id)
                {
                    post.u_id = get_new_id("post")
                    user.posts.push(post)
                }
            })
            await fs.writeFile(db_file, JSON.stringify(db_json))
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

function get_new_id(id_type)
{
    switch (id_type) {
        case "user":
            if (current_user_id !== undefined)
                current_user_id = '3' + (parseInt(current_user_id.slice(1)) + 1)
            else
                current_user_id = '30'
            return current_user_id
        case "post":
            if (current_post_id !== undefined)
                current_post_id = '7' + (parseInt(current_post_id.slice(1)) + 1)
            else
                current_post_id = '70'
            return current_post_id
        case "message":
            if (current_message_id !== undefined)
                current_message_id = '9' + (parseInt(current_message_id.slice(1)) + 1)
            else
                current_message_id = '90'
            return current_message_id
        default:
            throw TypeError(`${id_type} is a wrong id type, send a valid id type.`)
    }
}

async function is_email_exist(email){
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            return db_json.users.find(user => {
                return user.email === email
            })
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

module.exports = {
    initialize_db, get_users, add_user, add_message, add_post, find_user_by_id, is_email_exist, update_user_status
}