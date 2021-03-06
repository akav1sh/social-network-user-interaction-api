class NewPost extends React.Component {
    constructor(props) {
		super(props);
	}

    handle_post = e => {
		e.preventDefault(e.target.post.value);

        if (!e.target.post.value)
            alert("Can't post an empty post")
        else {
            create_post(e.target.post.value)
            .then((res) => {
                if (res.ok) {
                    this.props.get_posts(this.props.u_id, this.props.full_name);
                } else {
                    res.json().then(data => {
                        alert(data.error);
                    });
                }
                e.target.post.value = "";
            }).catch();
        }
	}

    render() {
        return React.createElement(
            "div",
            { className: "post-container", id: "write-post" },
            React.createElement(
                "form",
                { className: "form", onSubmit: this.handle_post },
            React.createElement(
                "div",
                { className: "post-text" },
                "Write a post:"
                ),
                React.createElement(
                    "div",
                    { className: "flex-box" },
                    React.createElement(
                        "div",
                        { className: "input-group" },
                        React.createElement("input",
                        { className: "post-input", type: "text", name: "post", placeholder: "I'm feeling..." }),
                    ),
                    React.createElement(
                        "button",
                        { className: "secondary" },
                        "Post"
                    ),	
                ),
              ),
        );
    }
}

class Post extends React.Component {
    constructor(props) {
		super(props);
        
	}

    render() {
        let layout;
        if (this.props.post === "loading") {
            layout = React.createElement("img", { src: "css/images/animation.gif", alt: "Italian Trulli" });
        } else if (this.props.user) {
            const timestamp = new Date(this.props.post.time);
            layout = React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "My last post:",
            React.createElement("div", { className: "text-container" }, this.props.post.text),
            React.createElement("div", { className: "time-text" }, "Time: " + timestamp.toLocaleString('he-IL') + "\u2003Post ID: " + this.props.post.p_id)));
        } else if (this.props.post) {
            const timestamp = new Date(this.props.post.time);
            layout = React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "A post from " + this.props.post.full_name + ":",
            React.createElement("div", { className: "text-container" }, this.props.post.text),
            React.createElement("div", { className: "time-text" }, "Time: " + timestamp.toLocaleString('he-IL') + "\u2003Post ID: " + this.props.post.p_id)));
        } else {
            layout = React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "No posts yet, be the first!"));
        }
        
        return layout;
    }
}

class NewMessage extends React.Component {
    constructor(props) {
		super(props);
	}

    handle_message = e => {
		e.preventDefault(e.target.id.value);
        e.preventDefault(e.target.message.value);
        
        if (!e.target.message.value)
            alert("Can't send empty message")
        else if (!e.target.id.value)
            alert("Can't send message without id")
        else {
            send_message(e.target.id.value, e.target.message.value)
            .then((res) => {
                if (res.ok) {
                    this.props.update_page("messages");
                } else {
                    res.json().then(data => {
                        alert(data.error);
                    });
                }
                e.target.id.value = "";
                e.target.message.value = "";
            }).catch();
        }
	}

    render() {
        return React.createElement(
            "div",
            { className: "post-container", id: "write-post" },
            React.createElement(
                "form",
                { className: "form", onSubmit: this.handle_message },
            React.createElement(
                "div",
                { className: "post-text" },
                "Write a message:"
                ),
                React.createElement(
                    "div",
                    { className: "flex-box" },
                    React.createElement(
                        "div",
                        { className: "input-group" },
                        React.createElement("input",
                        { className: "post-input", type: "text", name: "id", placeholder: "User ID" })
                    ),
                    React.createElement(
                        "div",
                        { className: "input-group" },
                        React.createElement("input",
                        { className: "post-input", type: "text", name: "message", placeholder: "Heartfelt message..." }),
                    ),
                    React.createElement(
                        "button",
                        { className: "secondary" },
                        "Send"
                    ),	
                ),
              ),
        );
    }
}


class Broadcast extends React.Component {
    constructor(props) {
		super(props);
	}

    handle_message = e => {
		e.preventDefault(e.target.broadcast.value);
        
        if (!e.target.broadcast.value)
            alert("Can't send empty broadcast")
        else {
            broadcast_message(e.target.broadcast.value)
            .then((res) => {
                if (res.ok) {
                } else {
                    res.json().then(data => {
                        alert(data.error);
                    });
                }
                e.target.broadcast.value = "";
            }).catch();
        }
	}

    render() {
        return React.createElement(
            "div",
            { className: "post-container", id: "write-post" },
            React.createElement(
                "form",
                { className: "form", onSubmit: this.handle_message },
            React.createElement(
                "div",
                { className: "post-text" },
                "Write a broadcast:"
                ),
                React.createElement(
                    "div",
                    { className: "flex-box" },
                    React.createElement(
                        "div",
                        { className: "input-group" },
                        React.createElement("input",
                        { className: "post-input", type: "text", name: "broadcast", placeholder: "Important notice..." }),
                    ),
                    React.createElement(
                        "button",
                        { className: "secondary" },
                        "Send"
                    ),	
                ),
              ),
        );
    }
}

class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let layout;
        if (this.props.message) {
            const timestamp = new Date(this.props.message.time);
            layout = React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "A message from user id " + this.props.message.sender_id + ":",
            React.createElement("div", { className: "text-container" }, this.props.message.text),
            React.createElement("div", { className: "time-text" }, "Time: " + timestamp.toLocaleString('he-IL') + "\u2003Message ID: " + this.props.message.m_id)));
        } else {
            layout = React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "You don't have any messages yet!"));
        }
        return layout
    }
}

class UserStatus extends React.Component {
    constructor(props) {
		super(props);
	}
}

class User extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return React.createElement("div", { className: "post-text" },
        React.createElement("u", null, "User " + this.props.user.u_id +":"),
            React.createElement("div", { className: "user-text" },
                React.createElement("br", null),
                React.createElement("b", null, "\u2003Full name: "),
                this.props.user.full_name,
                React.createElement("br", null),
                React.createElement("b", null, "\u2003Email: "),
                this.props.user.email,
                React.createElement("br", null),
                React.createElement("b", null, "\u2003Status: "),
                React.createElement("div", { className: "status" }, this.props.user.u_status),
                React.createElement("br", null),
                React.createElement("br", null)));
    }
}

class UsersList extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            original_list: this.props.original_list,
            users: this.props.original_list
        }
	}

    handle_status = e => {
        e.preventDefault(e.target);
		update_user_status(e.target.id.value, e.nativeEvent.submitter.name)
		.then((res) => {
			if (res.ok) {
                get_users()
                .then((res) => {
                    if (res.ok) {
                        res.json()
                        .then((data) => {
                            if (data.users[0]) 
                                this.setState((_prev_state) => ({ original_list: data.users, users: data.users }));
                        });
                    } else {
                        this.props.change_page("register");
                    }
                }).catch();
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
			e.target.id.value = "";
		}).catch();

	}

    handle_users = e => {
		e.preventDefault(e.target.id.value);
		let new_users_list;
        if (this.state.original_list) {
            switch(e.nativeEvent.submitter.name) {
                case 'search':
                    new_users_list = this.state.original_list.filter(user => user.u_id === e.target.id.value);
                    break;
                case 'created':
                    new_users_list = this.state.original_list.filter(user => user.u_status === 'created');
                    break;
                case 'active':
                    new_users_list = this.state.original_list.filter(user => user.u_status === 'active');
                    break;
                case 'suspended':
                    new_users_list = this.state.original_list.filter(user => user.u_status === 'suspended');
                    break;
                case 'deleted':
                    new_users_list = this.state.original_list.filter(user => user.u_status === 'deleted');
                    break;
                case 'all':
                    new_users_list = this.state.original_list;
                    break;
            }
        }
        e.target.id.value = "";
        this.setState((_prev_state) => ({ users: new_users_list }));
	}

    render() {
        let user_status, layout, users;
        
        if (this.state.users) {
            users = this.state.users.map((user, i) => {
                return React.createElement(User, { key: i, user: user }) 
            });
        }

        user_status = React.createElement(
            "div",
            { className: "post-container", id: "write-post" },
            React.createElement(
                "form",
                { className: "form", onSubmit: this.handle_status },
            React.createElement(
                "div",
                { className: "post-text" },
                "Update user status:"
                ),
                React.createElement(
                    "div",
                    { className: "flex-box" },
                    React.createElement(
                        "div",
                        { className: "input-group" },
                        React.createElement("input",
                        { className: "post-input", type: "text", name: "id", placeholder: "User ID" })
                    ),
                    React.createElement(
                        "button",
                        { className: "secondary", name: "active"},
                        "Activate"
                    ),
                    React.createElement(
                        "button",
                        { className: "secondary", name: "suspended" },
                        "Suspend"
                    ),
                    React.createElement(
                        "button",
                        { className: "secondary", name: "deleted" },
                        "Delete"
                    ),	
                ),
              ),
        );
        
        if (window.innerWidth <= 760) {
            layout = React.createElement(
                "div",
                { className: "post-container admin-container", id: "write-post" },
                React.createElement(
                    "form",
                    { className: "form", onSubmit: this.handle_users },
                React.createElement(
                    "div",
                    { className: "post-text" },
                    "Users List:"
                    ),
                    React.createElement(
                        "div",
                        { className: "flex-box" },
                        React.createElement(
                            "div",
                            { className: "input-group" },
                            React.createElement("input",
                            { className: "post-input", type: "text", name: "id", placeholder: "User ID" })
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "search"},
                            "Search"
                        ),	
                    ),
                ),
                React.createElement(
                    "div",
                    { className: "user-container" },
                    users)
            );
        } else {
            layout = React.createElement(
                "div",
                { className: "post-container admin-container", id: "write-post" },
                React.createElement(
                    "form",
                    { className: "form", onSubmit: this.handle_users },
                React.createElement(
                    "div",
                    { className: "post-text" },
                    "Users List:"
                    ),
                    React.createElement(
                        "div",
                        { className: "flex-box" },
                        React.createElement(
                            "div",
                            { className: "input-group" },
                            React.createElement("input",
                            { className: "post-input", type: "text", name: "id", placeholder: "User ID" })
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "search"},
                            "Search"
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "created" },
                            "Created"
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "active" },
                            "Active"
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "suspended" },
                            "Suspended"
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "deleted" },
                            "Deleted"
                        ),
                        React.createElement(
                            "button",
                            { className: "secondary", name: "all" },
                            "All"
                        ),	
                    ),
                ),
                React.createElement(
                    "div",
                    { className: "user-container" },
                    users)
            );
        }
    
        return React.createElement("div", { className: "flex-box-column" }, user_status, layout);
    }
}


class Profile extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return React.createElement(
            "div",
            { className: "profile-container", id: "profile" },
            React.createElement(
            "div",
            { className: "profile-pic" + this.props.profile_pic, id: "profile-pic" }
            ), 
            React.createElement(
                "div",
                { className: "homepage-text", id: "user-info" },
                "User ID: ",
                React.createElement("br", null),
                this.props.u_id,
                React.createElement("br", null),
                React.createElement("br", null),
                "Full name: ",
                React.createElement("br", null),
                this.props.full_name,
            ),
        );
    }
}


