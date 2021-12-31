// Module for security methods such as token and passwords control.

const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

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

function is_password_valid(password){
    const re = new RegExp("^(?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[A-Z])\\S{8,}$")
    return re.test(password)
}

function is_email_valid(email){
    const re = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")
    return re.test(email)
}

module.exports = {
    make_hash_password, verify_user_password, is_password_valid, is_email_valid
}