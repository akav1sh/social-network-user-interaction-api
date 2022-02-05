const path = "/api"

async function login(email, password) {
    return fetch (path + '/user/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
}

async function register(full_name, email, password) {
    return fetch (path + '/user/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "full_name": full_name,
                "email": email,
                "password": password
            })
        })
}

async function logout() {
    return fetch (path + '/user/logout',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({})
        })
}

async function delete_user(password) {
    return fetch (path + '/user',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                password: password
            })
        })
}

async function create_post(text) {
    return fetch (path + '/user/post',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                text: text
            })
        })
}

async function get_post(u_id, amount) {
    const url = new URL(`${path}/user/post?u_id=${u_id}&post_amount=${amount}`)
    return fetch (url.toString(),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
        })
}

async function delete_post(p_id) {
    return fetch (path + '/user/post',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                pid: p_id,
            })
        })
}

async function get_message(sender_id, m_status) {
    const url = new URL(`${path}/user/message?sender_id=${sender_id}&m_status=${m_status}`)
    return fetch (url.toString(),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
        })
}

async function send_message(receiver_id, text) {
    return fetch (path + '/user/message',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                receiver_id: receiver_id,
                text: text
            })
        })
}

async function get_users() {
    return fetch (path + '/users',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
        })
}

async function update_user_status(u_id, u_status) {
    return fetch (path + '/admin/status',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                u_id: u_id,
                u_status: u_status
            })
        })
}

async function broadcast_message(text) {
    return fetch (path + '/admin/broadcast',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                text: text,
            })
        })
}

