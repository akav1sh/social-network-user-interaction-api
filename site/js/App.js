
class App extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		page: "login"
	  };
	  this.rightSide = React.createRef();
	}
  
	componentDidMount() {
	  this.rightSide.classList.add("right");
	}
  
	handle_click() {
		
		this.setState(prevState => ({ page: "homepage"}));
	}

	change_state() {
	  const { page } = this.state;
  
	  if (page === "login") {
		this.rightSide.classList.remove("right");
		this.rightSide.classList.add("left");
	  } else if (page === "register") {
		this.rightSide.classList.remove("left");
		this.rightSide.classList.add("right");
	  } else {
		this.rightSide.classList.remove("left");
		this.rightSide.classList.remove("right");
		this.rightSide.classList.add("hompage");
	  }
	  this.setState(prevState => ({ page: page === "login" ? "register" : "login"}));
	}
  
	render() {
	  const { page } = this.state;
	  const current = page === "login" ? "Register" : "Login";
	  return React.createElement(
		"div",
		{ className: "App" },
		React.createElement(
		  "div",
		  { className: "login" },
		  React.createElement(
			"div",
			{ className: "container"},
			page === "login" && React.createElement(Login),
			page === "register" && React.createElement(Register),
			page === "homepage" && React.createElement(Homepage),
			React.createElement(
				"button",
				{ className: "primary", onClick: this.handle_click.bind(this) },
				"Homepage"
			  )
		  ),
		  React.createElement(RightSide, {
			current: current,
			containerRef: ref => this.rightSide = ref,
			onClick: this.change_state.bind(this)
		  })
		)
	  );
	}
  }
  
  const RightSide = props => {
	return React.createElement(
	  "div",
	  {
		className: "right-side",
		ref: props.containerRef,
		onClick: props.onClick
	  },
	  React.createElement(
		"div",
		{ className: "inner-container" },
		React.createElement(
		  "div",
		  { className: "text" },
		  props.current
		)
	  )
	);
  };
    
  
 
  class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	handleSubmit = e => {
		e.preventDefault();
		console.log(e.target.email.value);
	
		if (!e.target.email.value) {
		  alert("Email is required");
		} else if (!e.target.email.value) {
		  alert("Valid email is required");
		} else if (!e.target.password.value) {
		  alert("Password is required");
		} else if (
		  e.target.email.value === "me@example.com" &&
		  e.target.password.value === "123456"
		) {
		  alert("Successfully logged in");
		  e.target.email.value = "";
		  e.target.password.value = "";
		} else {
		  alert("Wrong email or password combination");
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
			  { className: "form", onSubmit: this.handleSubmit },
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

	handleSubmit = e => {
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
			alert("Successfully created user");
			e.target.full_name.value = "";
			e.target.email.value = "";
			e.target.password.value = "";
			e.target.repeat_password.value = "";
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
			  { className: "form", onSubmit: this.handleSubmit },
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
			{ className: "App" },
			React.createElement(
				"h1",
				null,
				"Homepage"
			  )
		);
	}

}