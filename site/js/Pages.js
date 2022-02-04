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
					res.json().then((json) => {
						this.props.handle_login(u_id, u_name);
						this.props.handle_homepage();
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


class Homepage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(Header),
			React.createElement(
			  "div",
			  { className: "profile-box", id: "profile" },
			  React.createElement(
				"div",
				{ className: "profile-pic", id: "profile-pic" }
			  )
			)
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
