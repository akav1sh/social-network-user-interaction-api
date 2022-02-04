
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
  
	handle_homepage(id, name) {
		this.setState(_prev_state => ({ page: "homepage", u_id: id, full_name: name}));
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
				page === "login" && React.createElement(Login, { handle_homepage: this.handle_homepage.bind(this),}),
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
		page_layout = React.createElement(Homepage, {u_id: this.state.u_id, full_name: this.state.full_name});
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