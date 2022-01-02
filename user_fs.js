
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
            await fs.readFile(path + "db")
                .then(res => {
                    const db_json = JSON.parse(res.toString('utf-8'))
                    current_user_id = db_json.max_u_id
                    console.log(current_user_id) //TODO add check if empty
                    current_post_id = db_json.max_p_id
                    console.log(current_post_id)
                    current_message_id = db_json.max_m_id
                    console.log(current_message_id)
                })
                .catch(err => {console.log(`Can't parse db, error: ${err}`)})
        }
        else
        {
            //TODO fix password check if all necessary properties there
            console.log("DB file is missing, creating a new one.")
            await fs.writeFile(path + "db", JSON.stringify({
                max_u_id: undefined,
                max_p_id: undefined,
                max_m_id: undefined,
                users: [{
                    full_name: "Root",
                    email: "root@mta.ac.il",
                    u_status: "active",
                    password: "213c3e97ec7a9d26a070aaa825005b35:5d52b9239c69b8a2d62700db85a02bbdd7cfd12fee1f8b4c91543fe073fae327661237748920cf310a12840c124a95a091e50c465757401c64239e4841bae33a",
                    posts: [],
                    messages: [],
                    time: new Date().toJSON(),
                    u_id: "1"}],

                tokens: []
            }))
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

async function find_token(received_token)
{
    return await fs.readFile(db_file)
        .then(res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user_id for mistakes
            return db_json.tokens.includes(received_token)
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function add_token(received_token)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user for mistakes
            db_json.tokens.push(received_token)
            await fs.writeFile(db_file, JSON.stringify(db_json))
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function remove_token(received_token)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user_id for mistakes
            if(db_json.tokens.includes(received_token))
            {
                db_json.tokens = db_json.tokens.filter(token => token !== received_token)
                await fs.writeFile(db_file, JSON.stringify(db_json))
            }
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function get_users()
{
    return await fs.readFile(db_file)
        .then(res => {
            const db_json = JSON.parse(res.toString('utf-8'))
            return db_json.users.map(user => {
                delete user.password
                delete user.messages
                delete user.time
                return user
            })
        })
        .catch(err => {console.log("Can't parse db")})
}

async function get_posts()
{
    return await fs.readFile(db_file)
        .then(res => {
            const db_json = JSON.parse(res.toString('utf-8'))
            let all_posts = []
            db_json.users.forEach(user => {
                all_posts = all_posts.concat(user.posts)
            });
            return all_posts

        })
        .catch(err => {console.log("Can't parse db")})
}

async function get_messages(requesting_user_id, sender_id, status)
{
    return await fs.readFile(db_file)
        .then(async res => {
            const db_json = JSON.parse(res.toString('utf-8'))
            const requesting_user = db_json.users.find(user => user.u_id === requesting_user_id)
            // filter sender id to get messages from single user or all if id === "0"
            const messages = requesting_user.messages
                .filter(message => message.sender_id === (sender_id !== "0" ? sender_id : message.sender_id))
                .filter(message => message.m_status === status)
            messages.forEach(message => message.m_status = "read")
            await fs.writeFile(db_file, JSON.stringify(db_json))
            return messages
        })
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

async function update_delete_post(user_id, post_id)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check user for mistakes
            const user = db_json.users.find(user => user.u_id === user_id)
            const post = user.posts.find(post => post.p_id === post_id )
            post.p_status = "deleted"
            await fs.writeFile(db_file, JSON.stringify(db_json))
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function find_user_by_email(email) {
    return await fs.readFile(db_file)
        .then(res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            return db_json.users.find(user => {
                return user.email === email
             })
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
            db_json.max_u_id = user.u_id
            db_json.users.push(user)
            await fs.writeFile(db_file, JSON.stringify(db_json))
            return user.u_id
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function add_message(sender, receiver, message)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check users for mistakes
            message.m_id = get_new_id("message")
            db_json.max_m_id = message.m_id
            db_json.users.forEach(user => {
                if(user.u_id === sender.u_id || user.u_id === receiver.u_id)
                {
                    user.messages.push(message)
                }
            })
            await fs.writeFile(db_file, JSON.stringify(db_json))
            return message.m_id
        })
        .catch(err => {
            console.log("Can't parse db")
        })
}

async function add_broadcast_message(sender, message)
{
    return await fs.readFile(db_file)
        .then(async res => {
            let db_json = JSON.parse(res.toString('utf-8'))
            // TODO check users for mistakes
            message.m_id = get_new_id("message")
            db_json.max_m_id = message.m_id
            db_json.users.forEach(user => {
                message = JSON.parse(JSON.stringify(message))
                message.receiver_id = user.u_id
                user.messages.push(message)
            })
            await fs.writeFile(db_file, JSON.stringify(db_json))
            return message.m_id
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
                    post.p_id = get_new_id("post")
                    db_json.max_p_id = post.p_id
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
    initialize_db, get_users, get_messages, get_posts, add_user, add_message, add_broadcast_message, add_post, find_user_by_id, find_user_by_email , is_email_exist,
    update_user_status, update_delete_post, find_token, add_token, remove_token
}