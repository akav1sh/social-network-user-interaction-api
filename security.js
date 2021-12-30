// Module for security methods such as token and passwords control.

const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

function make_hash_password(user)
{
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(user.password, salt, 64).toString('hex');

    user.password = `${salt}:${hashedPassword}`

    return user
}

function verify_password(user, password)
{
    const [salt, key] = user.password.split(':');
    const hashedBuffer = scryptSync(password, salt, 64);

    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(hashedBuffer, keyBuffer);
}


module.exports = {
    make_hash_password, verify_password
}