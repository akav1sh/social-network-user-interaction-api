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
                        { className: "post-input", type: "text", name: "post", placeholder: "I'm feeling..." }
                        ),
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

class LatestPost extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            exists: false
        };
        this.get_user_post(this.props.u_id);
	}

    get_user_post(u_id) {
        get_post(u_id, 1)
        .then((res) => {
			if (res.ok) {
                res.json().then((data) => {
                    if (data.posts[0])
                        this.setState((_prev_state) => ({ exists: true, text: data.posts[0].text, time: data.posts[0].time, p_status: data.posts[0].p_status, p_id: data.posts[0].p_id}));
                });
            } else {
				res.json().then(data => {
					alert(data.error);
				});
			}
		}).catch();
    }

    render() {
        let latest_post;

        if (this.state.exists) {
            latest_post = React.createElement(
                "div",
                { className: "post-container", id: "write-post" },
                React.createElement(
                    "div",
                    { className: "post-text" },
                    "Your latest post:",
                    React.createElement("br", null),
                    this.state.text,
                    ),
                );
        } else {
            latest_post = latest_post = React.createElement(
                "div",
                { className: "post-container", id: "write-post" },
                React.createElement(
                    "div",
                    { className: "post-text" },
                    "You haven't made a post yet... Give it a try!",
                    ),
                );
        }
        return latest_post; 
    }
}

class Post extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            exists: false
        };
        this.single_post(this.props.amount);
	}

    single_post() {
        get_post(0, this.props.amount)
        .then((res) => {
			if (res.ok) {
                res.json().then((data) => {
                    console.log(data.posts)
                    if (data.posts[0])
                        this.setState((_prev_state) => ({ exists: true, posts_list: data.posts }));
                });
            } else {
				res.json().then(data => {
					alert(data.error);
				});
			}
		}).catch();
    }

    render() {
        let single_post;
        console.log(this.state.exists)
        console.log("posts: " + this.state.posts_list)
        if (this.state.exists) {
            console.log(this.props.amount)
            for (let i = 0; i < this.props.amount; ++i && this.state.posts_list[i]) {
                single_post =+ React.createElement(
                    "div",
                    { className: "post-container", id: "write-post" },
                    React.createElement(
                        "div",
                        { className: "post-text" },
                        "A post from *:",
                        React.createElement("br", null),
                        this.state.posts_list[i].text,
                        ),
                    );
            }
        } else {
            single_post = React.createElement(
                "div",
                { className: "post-text" },
                "No more posts to show",
            );
        }
        return single_post; 
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

class Message extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return;
    }
}

