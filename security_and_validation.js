// Module for security methods such as token and passwords control.

const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

const jwt = require("jsonwebtoken")
require("dotenv").config()

function make_hash_password(password)
{
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');

    return `${salt}:${hashedPassword}`
}

function verify_user_password(user, password)
{
    const [salt, key] = user.password.split(':');
    const hashedBuffer = scryptSync(password, salt, 64);

    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(hashedBuffer, keyBuffer);
}

function is_id_valid(id_type, id)
{
    const re = new RegExp(`^[${id_type}]\\d+$`)
    return !(id.charAt(0) !== id_type || !re.test(id))

}

function create_token(user)
{
    const token_info = {id: user.u_id}

    return {token: jwt.sign(token_info, process.env.TOKEN_SECRET)}
}

function verify_token(token, callback)
{
    jwt.verify(token, process.env.TOKEN_SECRET, callback)
}

function is_password_valid(password)
{
    const re = new RegExp("^(?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[A-Z])\\S{8,}$")
    return re.test(password)
}

function is_email_valid(email)
{
    const re = new RegExp("^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$")
    return re.test(email)
}

function verify_status_update(user, new_status)
{
    switch (user.u_status)
    {
        case "created":
            if(new_status !== "created")
                return true
            break
        case "suspended":
            if(new_status !== "suspended" || new_status !== "created")
                return true
            break
        case "active":
            if(new_status !== "created" || new_status !== "active")
                return true
            break
        default:
            return false
    }
    
    return false
}

function is_user_status_valid(u_status)
{
    return !(u_status !== "active" || u_status !== "deleted" || u_status !== "deleted");
}

module.exports = {
    make_hash_password, verify_user_password, is_password_valid, is_email_valid, is_id_valid, is_user_status_valid,
    verify_status_update, create_token, verify_token
}