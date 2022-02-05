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
		this.props.change_page("admin");
	}

	handle_posts = e => {		
		this.props.change_page("homepage");
	}

	handle_messages = e => {
		e.preventDefault();

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
		let admin;
		if (this.props.u_id === "1")
			admin = React.createElement(
				"div",
				{ className: "admin", id: "admin", onClick: this.handle_admin },	
			);
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
				),
				React.createElement(
					"div",
					{ className: "messages", id: "messages" },
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
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(Header, { u_id: this.props.u_id, change_page: this.props.change_page.bind(this) }),
			React.createElement(Profile, { u_id: this.props.u_id, full_name: this.props.full_name, profile_pic: this.props.profile_pic }),
			React.createElement(
				"div",
				{ className: "posts-container", id: "posts-container" },
				React.createElement(NewPost),
				React.createElement(LatestPost, { u_id: this.props.u_id }),
				// React.createElement(Post, { amount: 3 }),
			),
		);
	}
}

class About extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(Header, { u_id: this.props.u_id, change_page: this.props.change_page.bind(this) }),
			React.createElement(Profile, { u_id: this.props.u_id, full_name: this.props.full_name, profile_pic: this.props.profile_pic }), 
			React.createElement(
				"div",
				{ className: "posts-container about-container", id: "about" },
				React.createElement(
					"div",
					{ className: "post-text" },
					"About us:",
				React.createElement("br", null),
				React.createElement("br", null),
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed tristique quam, et molestie augue. Sed dictum massa interdum, cursus lacus a, mattis ex. Sed laoreet bibendum diam, a malesuada dui auctor et. Aliquam erat volutpat. Nullam ut lectus euismod, viverra enim ac, pretium eros. Proin ultrices massa ac urna condimentum euismod. Morbi sit amet viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus faucibus nisi condimentum urna vehicula rhoncus. Nunc pharetra mi condimentum nunc semper tincidunt. Curabitur aliquam vel ligula vel ullamcorper.",
					"Mauris sed est at augue accumsan dignissim. Donec malesuada pulvinar dolor, a vulputate orci malesuada nec. Integer sit amet dolor dapibus, hendrerit neque at, efficitur dui. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur ligula nisl, facilisis eu egestas vel, placerat at nisi. Aliquam sit amet justo eget ipsum dictum iaculis. Vivamus vehicula est eget velit aliquet, vel congue mi porttitor. Fusce vehicula enim in mollis aliquam. Donec imperdiet cursus erat, quis sagittis massa ullamcorper in. Proin mattis, elit nec faucibus porta, nisl massa molestie erat, sed interdum orci quam ut nisi. Duis maximus leo ut nisl consequat faucibus. Vestibulum interdum scelerisque est a scelerisque. Sed non libero quis nulla bibendum pellentesque."
				),
			),
		);
	}
}

class Admin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(Header, { u_id: this.props.u_id, change_page: this.props.change_page.bind(this) }),
			React.createElement(Profile, { u_id: this.props.u_id, full_name: this.props.full_name, profile_pic: this.props.profile_pic }),
			
		);
	}
}