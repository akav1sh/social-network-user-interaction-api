class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	handle_submit = e => {
		e.preventDefault();
		console.log(e.target.email.value);
	
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
		console.log(e.target.email.value);
	
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
	
	render() {
		return React.createElement(
			"div",
			{ className: "header", id: "header" },
			React.createElement(
				"div",
				{ className: "header-icon", id: "header-icon" }
			),
			React.createElement(
				"div",
				{ className: "icon-container", id: "icons" },
				React.createElement(
					"div",
					{ className: "posts", id: "posts" },
					
				),
				React.createElement(
					"div",
					{ className: "messages", id: "messages" },
					
				),
				React.createElement(
					"div",
					{ className: "about", id: "about" },
					
				),
				React.createElement(
					"div",
					{ className: "logout", id: "logout" },
					
				)
			)
		);
	}
}

class Homepage extends React.Component {
	constructor(props) {
		super(props);
	}

	handle_post = e => {
		e.preventDefault();
		console.log(e.target.post.value);
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(Header),
			React.createElement(
				"div",
				{ className: "profile-container", id: "profile" },
				React.createElement(
				"div",
				{ className: "profile-pic", id: "profile-pic" }
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
			), 
			React.createElement(
				"div",
				{ className: "post-container", id: "write-post" },
			  	React.createElement(
				"div",
				null,
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
							{ className: "secondary", onSubmit: this.handle_post },
							"Post"
						),	
					),
			  	),
			),
		);
	}
}
