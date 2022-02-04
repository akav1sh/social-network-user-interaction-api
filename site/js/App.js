
class App extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		page: "login"
	  };
	}
  
	componentDidMount() {
	  this.rightSide.classList.add("right");
	}
  
	handle_homepage() {
		this.setState(_prev_state => ({ page: "homepage"}));
	}

	handle_login(u_id, u_name) {
		this.props.u_id = u_id;
		this.props.u_name = u_name;
	}

	get_props() {
		return this.props;
	}

	change_state() {
	  const { page } = this.state;
  
	  if (page === "login") {
		this.rightSide.classList.remove("right");
		this.rightSide.classList.add("left");
	  } else if (page === "register") {
		this.rightSide.classList.remove("left");
		this.rightSide.classList.add("right");
	  } 
	  this.setState((_prev_state) => ({ page: page === "login" ? "register" : "login"}));
	}
  
	render() {
	  const { page } = this.state;
	  const current = page === "login" ? "Register" : "Login";
	  let page_layout;
	  if (page === "login" || page === "register") {
		  page_layout = React.createElement(
			"div",
			{ className: "App" },
			React.createElement(
			  "div",
			  { className: "login" },
			  React.createElement(
				"div",
				{ className: "container"},
				page === "login" && React.createElement(Login, { handle_homepage: this.handle_homepage.bind(this), handle_login: this.handle_login.bind(this)}),
				page === "register" && React.createElement(Register, { change_state: this.change_state.bind(this) }),
			  ),
			  React.createElement(RightSide, {
				current: current,
				containerRef: ref => this.rightSide = ref,
				onClick: this.change_state.bind(this)
			  })
			)
		  );
	  } else {
		page_layout = React.createElement(Homepage, { get_props:this.get_props.bind(this)});
	  }
	  return page_layout
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