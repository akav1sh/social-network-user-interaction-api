class User extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return;
    }
}

class NewPost extends React.Component {
    constructor(props) {
		super(props);
	}

    handle_post = e => {
		e.preventDefault();

		create_post(e.target.post.value)
		.then((res) => {
			if (res.ok) {
				alert("Post successfull");
                this.props.update_homepage();
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
			e.target.post.value = "";
		}).catch();

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
        } else {
            layout = React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "A post from " + this.props.post.full_name + ":",
            React.createElement("br", null), this.props.post.text,));
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

		send_message(e.target.id.value, e.target.message.value)
		.then((res) => {
			if (res.ok) {
				alert("Message successfull");
                this.props.update_page();
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
			e.target.id.value = "";
            e.target.message.value = "";
		}).catch();

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
		e.preventDefault(e.target.id.value);

		broadcast_message(e.target.broadcast.value)
		.then((res) => {
			if (res.ok) {
				alert("Broadcast successfull");
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
            e.target.broadcast.value = "";
		}).catch();

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
        return React.createElement("div", { className: "post-container" },
            React.createElement("div", { className: "post-text" }, "A message from user id " + this.props.message.sender_id + ":",
            React.createElement("br", null), this.props.message.text,));
    }
}

class UserStatus extends React.Component {
    constructor(props) {
		super(props);
	}

    handle_status = e => {
        e.preventDefault(e.target);
		update_user_status(e.target.id.value, e.nativeEvent.submitter.name)
		.then((res) => {
			if (res.ok) {
				alert("Status successfully updated");
                console.log(document.cookie)
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
			e.target.id.value = "";
		}).catch();

	}

    render() {
        return React.createElement(
            "div",
            { className: "post-container", id: "write-post" },
            React.createElement(
                "form",
                { className: "form", onSubmit: this.handle_status },
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


