async function  login(email, password) {
    return fetch ('/api/user/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email":email,
                "password":password
            })
        })
}

async function  register(full_name, email, password) {
    return fetch ('/api/user/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "full_name":full_name,
                "email":email,
                "password":password
            })
        })
}