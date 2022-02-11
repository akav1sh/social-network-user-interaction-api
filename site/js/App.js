
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  page: "loading",
		};
		this.handle_logged_user();
	}
  
	componentDidMount() {
		if (this.state.page === "login")
			this.rightSide.classList.add("right");
	}
	
	handle_logged_user() {
		is_logged()
		.then((res) => {
			console.log(res)
			if (res.ok) {
				res.json().then((data) => {
					this.handle_homepage(data.u_id, data.full_name);
				});
			} else {
				this.change_page("register")
			}
		}).catch();
	}

	change_page(new_page) {
		this.setState((_prev_state) => ({ page: new_page}));

		if (new_page === "register") {
			this.change_state();
		}
	}
  
	handle_homepage(id, name) {
		this.setState(_prev_state => ({ page: "homepage", u_id: id, full_name: name, profile_pic: Math.floor(Math.random() * 4) + 1}));
	}

	change_state() {
	  const { page } = this.state;
  
	  if (!this.rightSide.classList.contains("right") && !this.rightSide.classList.contains("left")) {
		this.rightSide.classList.add("right");
	  }

	  if (page === "login") {
		this.rightSide.classList.remove("right");
		this.rightSide.classList.add("left");
	  } else {
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
			page_layout =  React.createElement(
				"div",
				{ className: "App" },
				React.createElement(
				  "div",
				  { className: "login" },
				  React.createElement(
					"div",
					{ className: "container"},
					page === "login" && React.createElement(Login, { handle_homepage: this.handle_homepage.bind(this) }),
					page === "register" && React.createElement(Register, { change_state: this.change_state.bind(this) }),
				  ),
				  React.createElement(RightSide, {
					current: current,
					containerRef: ref => this.rightSide = ref,
					onClick: this.change_state.bind(this)
				  })
				)
			  );
		} else if (page === "homepage"){
			page_layout = React.createElement(Homepage, 
				{ change_page: this.change_page.bind(this), u_id: this.state.u_id, full_name: this.state.full_name, profile_pic: this.state.profile_pic });
		} else if (page === "about"){
			page_layout = React.createElement(About, 
				{ change_page: this.change_page.bind(this), u_id: this.state.u_id, full_name: this.state.full_name, profile_pic: this.state.profile_pic });
		} else if (page === "admin"){
			page_layout = React.createElement(Admin, 
				{ change_page: this.change_page.bind(this), u_id: this.state.u_id, full_name: this.state.full_name, profile_pic: this.state.profile_pic });
		} else if (page === "loading"){
			page_layout = React.createElement("img", { src: "./css/images/loading.gif" })
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

  