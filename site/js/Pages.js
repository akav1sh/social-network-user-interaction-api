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
					alert("Successfully logged in");
					res.json().then((data) => {
						this.props.handle_homepage(data.u_id, data.full_name);
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
					alert("Successfully registered");
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
				  "Password"
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
		this.props.handle_homepage(this.props.u_id, this.props.full_name);
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
				alert("Successfully logged out");
				this.props.change_page("register");
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
		}).catch();
	}

	
	render() {
		let admin, msg_bell, pst_bell;
		if (this.props.u_id === "1")
			admin = React.createElement("div", { className: "admin", id: "admin", onClick: this.handle_admin });
		if (this.props.msg_bell)
			msg_bell = React.createElement("div", { className: "notification" });
		if (this.props.pst_bell)
			pst_bell = React.createElement("div", { className: "notification" });

		return React.createElement(
			"div",
			{ className: "header", id: "header" },
			React.createElement(
				"div",
				{ className: "header-icon", id: "header-icon", onClick: this.handle_posts }
			),
			React.createElement(
				"div",
				{ className: "icon-container", id: "icons" },
				admin,
				React.createElement(
					"div",
					{ className: "posts", id: "posts", onClick: this.handle_posts },
					pst_bell
				),
				React.createElement(
					"div",
					{ className: "messages", id: "messages", onClick: this.handle_messages },
					msg_bell
				),
				React.createElement(
					"div",
					{ className: "about", id: "about", onClick: this.handle_about },
				),
				React.createElement(
					"div",
					{ className: "logout", id: "logout", onClick: this.handle_logout },
				)
			)
		);
	}
}

class Homepage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user_post: null,
			posts: null
		};

	}

	componentDidMount() {
		this.get_posts()
	}

	update_homepage() {
		this.get_posts()
	}

	get_posts() {
        get_post(this.props.u_id, 1)
        .then((res_user) => {
			if (res_user.ok) {
                res_user.json().then((data_user) => {
                    if (data_user.posts[0]) {
						get_post(0, 4)
						.then((res_posts) => {
							if (res_posts.ok) {
								res_posts.json().then((data_posts) => {
									if (data_posts.posts[0]) {
										this.props.save_last_post_id(data_posts.posts[data_posts.posts.length - 1].p_id);
										this.setState((_prev_state) => ({ loading: false, user_post: data_user.posts[0], posts: data_posts.posts }));
									}
								});
							} else {
								this.props.change_page("register");
							}
						}).catch();
					}
                });
            } else {
				this.props.change_page("register")
			}
		}).catch();
    }

	render() {
		let page_layout, posts = null;

		if (this.state.loading) {
			page_layout = React.createElement("div", null,
			React.createElement("div", { className: "posts-container", id: "posts-container" },
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" })));
		} else {
			if (this.state.posts) {
				posts = this.state.posts.map((post, i) => {
					if (post.p_id !== this.state.user_post.p_id)
						return React.createElement(Post, { key: i, post: post }) 
				  });
			}

			page_layout = React.createElement("div", null,
				React.createElement("div", { className: "posts-container", id: "posts-container" },
				React.createElement(NewPost, { update_homepage: this.update_homepage.bind(this) }),
				this.state.user_post ? React.createElement(Post, { post: this.state.user_post }) : null,
				posts.reverse()));
		}

		return page_layout;
	}
}

class MessagesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			messages: null
		};

	}

	componentDidMount() {
		this.get_messages()
	}

	update_messagepage() {
		this.get_messages()
	}

	get_messages() {
        get_message(0, "all", 4)
        .then((res) => {
			if (res.ok) {
                res.json()
				.then((data) => {
					if (data.messages[0]) {
						this.props.save_last_msg_id(data.messages[data.messages.length - 1].m_id);
						this.setState((_prev_state) => ({ loading: false, messages: data.messages }));
					}
				});
            } else {
				this.props.change_page("register");
			}
		}).catch();
    }

	render() {
		let page_layout, messages = null;
		if (this.state.loading) {
			page_layout = React.createElement("div", null,
			React.createElement("div", { className: "posts-container", id: "posts-container" },
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" }),
			React.createElement(Post, { post: "loading" })));
		} else {
			if (this.state.messages) {
				messages = this.state.messages.map((message, i) => {
					return React.createElement(Message, { key: i, message: message }) 
				  });
			}

			page_layout = React.createElement("div", null,
				React.createElement("div", { className: "posts-container", id: "message-container" },
				React.createElement(NewMessage, { update_page: this.update_messagepage.bind(this) }),
				messages.reverse()));
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
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed tristique quam, et molestie augue. Sed dictum massa interdum, cursus lacus a, mattis ex. Sed laoreet bibendum diam, a malesuada dui auctor et. Aliquam erat volutpat. Nullam ut lectus euismod, viverra enim ac, pretium eros. Proin ultrices massa ac urna condimentum euismod. Morbi sit amet viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus faucibus nisi condimentum urna vehicula rhoncus. Nunc pharetra mi condimentum nunc semper tincidunt. Curabitur aliquam vel ligula vel ullamcorper.",
					"Mauris sed est at augue accumsan dignissim. Donec malesuada pulvinar dolor, a vulputate orci malesuada nec. Integer sit amet dolor dapibus, hendrerit neque at, efficitur dui. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur ligula nisl, facilisis eu egestas vel, placerat at nisi. Aliquam sit amet justo eget ipsum dictum iaculis. Vivamus vehicula est eget velit aliquet, vel congue mi porttitor. Fusce vehicula enim in mollis aliquam. Donec imperdiet cursus erat, quis sagittis massa ullamcorper in. Proin mattis, elit nec faucibus porta, nisl massa molestie erat, sed interdum orci quam ut nisi. Duis maximus leo ut nisl consequat faucibus. Vestibulum interdum scelerisque est a scelerisque. Sed non libero quis nulla bibendum pellentesque."
				),
			),
		);
	}
}

class AdminPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement("div", null,
			React.createElement("div", { className: "posts-container" },
			React.createElement(Broadcast),
			React.createElement(UserStatus),
			React.createElement(UsersList, { change_page: this.props.change_page.bind(this) })),
			
		);
	}
}