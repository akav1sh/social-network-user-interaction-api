class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	handle_submit = e => {
		e.preventDefault();
	
		if (!e.target.email.value) {
			alert("Email is required");
		} else if (!e.target.email.value) {
			alert("Valid email is required");
		} else if (!e.target.password.value) {
			alert("Password is required");
		} else {
			login(e.target.email.value, e.target.password.value)
			.then((res) => {
				if (res.ok) {
					res.json().then((data) => {
						this.props.handle_logged_user();
					});
				} else {
					res.json().then(data => {
						alert(data.error);
						e.target.email.value = "";
						e.target.password.value = ""
					});
				}
			}).catch();
		}
	  };

	render() {
		return React.createElement(
			"div",
			{ className: "App" },
			React.createElement(
				"h1",
				null,
				"Sign in"
			  ),
			React.createElement(
			  "form",
			  { className: "form", onSubmit: this.handle_submit },
			  React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
				  "label",
				  { htmlFor: "email" },
				  "Email"
				),
				React.createElement("input", { type: "email", name: "email", placeholder: "name@email.com" })
			  ),
			  React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
				  "label",
				  { htmlFor: "password" },
				  "Password"
				),
				React.createElement("input", { type: "password", name: "password" })
			  ),
			  React.createElement(
				"button",
				{ className: "primary" },
				"Login"
			  )
			),
		  );

	}
}


class Register extends React.Component {
	constructor(props) {
		super(props);
	}

	handle_submit = e => {
		e.preventDefault();
	
		if (!e.target.email.value) {
		  alert("Email is required");
		} else if (!e.target.email.value) {
		  alert("Valid email is required");
		} else if (!e.target.full_name.value) {
			alert("Full name is required");
		} else if (!e.target.repeat_password.value) {
			alert("Repeat Password is required");
		} else if (!e.target.password.value) {
		  alert("Password is required");
		} else if (
		  e.target.password.value !== e.target.repeat_password.value
		) {
			alert("Passwords don't match");
			e.target.password.value = "";
			e.target.repeat_password.value = "";
		} else {
			register(e.target.full_name.value, e.target.email.value, e.target.password.value)
			.then((res) => {
				if (res.ok) {
					this.props.change_state();
				} else {
					res.json().then(data => {
						alert(data.error);
						e.target.full_name.value = "";
						e.target.email.value = "";
						e.target.password.value = "";
						e.target.repeat_password.value = "";
					});
				}
			}).catch();
		}
	  };


	render() {
		return React.createElement(
			"div",
			{ className: "App" },
			React.createElement(
				"h1",
				null,
				"Register"
			  ),
			React.createElement(
			  "form",
			  { className: "form", onSubmit: this.handle_submit },
			  React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
				  "label",
				  { htmlFor: "full_name" },
				  "Full name"
				),
				React.createElement("input", { type: "input", name: "full_name", placeholder: "John Doe" })
			  ),
			  React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
				  "label",
				  { htmlFor: "email" },
				  "Email"
				),
				React.createElement("input", { type: "email", name: "email", placeholder: "name@email.com" })
			  ),
			  React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
				  "label",
				  { htmlFor: "password" },
				  "Password",
				  React.createElement(
					"div",
					{ className: "info", id: "info" },
					React.createElement(
						"span",
						{ className: "tooltiptext info-tooltip" },
						"Password should be at least 8 characters and should contain at least one capital letter, one small letter and one digit."
					)
				),
				),
				React.createElement("input", { type: "password", name: "password" })
			  ),
			  React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
				  "label",
				  { htmlFor: "repeat_password" },
				  "Repeat Password"
				),
				React.createElement("input", { type: "password", name: "repeat_password" })
			  ),
			  
			  React.createElement(
				"button",
				{ className: "primary" },
				"Submit"
			  )
			),
		  );

	}
}

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	handle_admin = e => {	
		e.preventDefault();
		if (this.props.u_id === "1")	
			this.props.change_page("admin");
	}

	handle_posts = e => {		
		e.preventDefault();
		this.props.get_posts(this.props.u_id, this.props.full_name);
	}

	handle_messages = e => {
		e.preventDefault();
		this.props.change_page("messages");
	}

	handle_about = e => {
		e.preventDefault();
		this.props.change_page("about");
	}

	handle_logout = e => {
		e.preventDefault();
		logout()
		.then((res) => {
			if (res.ok) {
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
			this.props.change_page("register");
		}).catch();
	}

	
	render() {
		let admin, msg_bell, pst_bell;
		if (this.props.u_id === "1")
			admin = React.createElement("div", { className: "admin", id: "admin", onClick: this.handle_admin },
					React.createElement("span", { className: "tooltiptext" }, "Admin"));
		if (this.props.msg_bell)
			msg_bell = React.createElement("div", { className: "notification" });
		if (this.props.pst_bell)
			pst_bell = React.createElement("div", { className: "notification" });

		return React.createElement(
			"div",
			{ className: "header", id: "header" },
			React.createElement(
				"div",
				{ className: "header-icon", id: "header-icon", onClick: this.handle_posts },
			),
			React.createElement(
				"div",
				{ className: "icon-container", id: "icons" },
				admin,
				React.createElement(
					"div",
					{ className: "posts", id: "posts", onClick: this.handle_posts },
					pst_bell,
					React.createElement(
						"span",
						{ className: "tooltiptext" },
						"Posts"
					)
				),
				React.createElement(
					"div",
					{ className: "messages", id: "messages", onClick: this.handle_messages },
					msg_bell,
					React.createElement(
						"span",
						{ className: "tooltiptext" },
						"Messages"
					)
				),
				React.createElement(
					"div",
					{ className: "about", id: "about", onClick: this.handle_about },
					React.createElement(
						"span",
						{ className: "tooltiptext" },
						"About us"
					)
				),
				React.createElement(
					"div",
					{ className: "logout", id: "logout", onClick: this.handle_logout },
					React.createElement(
						"span",
						{ className: "tooltiptext" },
						"Log out"
					)
				)
			)
		);
	}
}

class Homepage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let page_layout, posts = null;

		if (this.props.loading) {
			page_layout = React.createElement("div", null,
			React.createElement("div", { className: "posts-container", id: "posts-container" },
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" })));
		} else {
			if (this.props.posts) {
				posts = this.props.posts.map((post, i) => {
					if ((this.props.user_post && post.p_id !== this.props.user_post.p_id)
						|| !this.props.user_post)
						return React.createElement(Post, { key: i, post: post }) 
				  });
			}

			page_layout = React.createElement("div", null,
				React.createElement("div", { className: "posts-container", id: "posts-container" },
				React.createElement(NewPost, { get_posts: this.props.get_posts.bind(this), u_id: this.props.u_id, full_name: this.props.full_name }),
				this.props.user_post ? React.createElement(Post, { post: this.props.user_post, user: true }) : null,
				posts ? posts.reverse() : React.createElement(Post)));
		}

		return page_layout;
	}
}

class MessagesPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let page_layout, messages = null;
		if (this.props.loading) {
			page_layout = React.createElement("div", null,
			React.createElement("div", { className: "posts-container", id: "posts-container" },
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" })));
		} else {
			if (this.props.messages) {
				messages = this.props.messages.map((message, i) => {
					return React.createElement(Message, { key: i, message: message }) 
				  });
			}

			page_layout = React.createElement("div", null,
				React.createElement("div", { className: "posts-container", id: "message-container" },
				React.createElement(NewMessage, { update_page: this.props.change_page.bind(this) }),
				messages ? messages.reverse() : 
				React.createElement(Message)));
		}

		return page_layout;
	}
}

class AboutPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement("div", null,
			React.createElement("div", { className: "posts-container about-container", id: "about" },
			React.createElement("div", { className: "post-text" }, "About us:",
			React.createElement("br", null),
				React.createElement("br", null),
				"This project was created for the course \"JavaScript on server and browser\"",
				React.createElement("br", null),
				React.createElement("br", null),
				"Created by:",
				React.createElement("br", null),
				React.createElement("br", null),
				"\u2003Ronel David Gekhman - 313564510",
				React.createElement("br", null),
				"\u2003roneldavidge@mta.ac.il",
				React.createElement("br", null),
				React.createElement("br", null),
				"\u2003Karina Batmanishvili - 321800898",
				React.createElement("br", null),
				"\u2003karinaba@mta.ac.il"
				),
			),
		);
	}
}

class AdminPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		this.get_users_list();
	}

	get_users_list() {
        get_users()
        .then((res) => {
			if (res.ok) {
                res.json()
				.then((data) => {
					if (data.users[0]) 
						this.setState((_prev_state) => ({ loading: false, original_list: data.users }));
				});
            } else {
                this.props.change_page("register");
			}
		}).catch();
    }

	render() {
		let page_layout;
		
		if (this.state.loading) {
			page_layout = React.createElement("div", null,
			React.createElement("div", { className: "posts-container", id: "posts-container" },
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" })));	
		} else {
			page_layout = React.createElement("div", null,
			React.createElement("div", { className: "posts-container" },
			React.createElement(Broadcast),
			React.createElement(UsersList, { original_list: this.state.original_list })));
		}
		return page_layout;
	}
}