
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  page: "loading",
		  timerId: null
		};
		this.notification = this.notification.bind(this);
		this.handle_logged_user();
	}
  
	componentDidMount() {
		if (this.state.page === "login")
			this.rightSide.classList.add("right");
	}

	notification() {
		// clearInterval(this.state.timerId);
		if (this.state.last_post_id) {
			get_post(0, 1)
			.then((post_res) => {
				if (post_res.ok) {
					post_res.json()
					.then((post_data) => {
						if (this.state.last_msg_id) {
							get_message(0, "all", 1)
							.then((msg_res) => {
								if (msg_res.ok) {
									msg_res.json()
									.then((msg_data) => {
										if (msg_data.messages[0] 
											&& post_data.posts[0] 
											&& this.state.last_post_id !== post_data.posts[0].p_id
											&& this.state.last_msg_id !== msg_data.messages[0].m_id) 
											this.setState(prev_state => ({ prev_state, msg_bell: true, pst_bell: true }))
										else if (msg_data.messages[0] 
												 && this.state.last_msg_id !== msg_data.messages[0].m_id)
											this.setState(prev_state => ({ prev_state, msg_bell: true, pst_bell: false }));
										else if (post_data.posts[0] 
												 && this.state.last_post_id !== post_data.posts[0].p_id)
											this.setState(prev_state => ({ prev_state, msg_bell: false, pst_bell: true }));
										else
											this.setState(prev_state => ({ prev_state, msg_bell: false, pst_bell: false }));
									});
								} else {
									//TODO
								}
							}).catch();
						}
						else if (post_data.posts[0] 
							 	 && this.state.last_post_id !== post_data.posts[0].p_id)
					   		this.setState(prev_state => ({ prev_state, msg_bell: false, pst_bell: true }));
						else
					   		this.setState(prev_state => ({ prev_state, msg_bell: false, pst_bell: false }));
					});
				} else {
					//TODO
				}
			}).catch();
		}
		


		//msg_bell, pst_bell
		//this.setState(prev_state => ({ prev_state, notification: false }));

	}

	handle_logged_user() {
		is_logged()
		.then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					get_message(0, "all", 1)
					.then((res) => {
						if (res.ok) {
							res.json()
							.then((data) => {
								if (data.messages[0]) 
									this.save_last_msg_id(data.messages[0].m_id);
								this.state.timerId = setInterval(this.notification, 1000);
							});
						}
					}).catch();
					this.handle_homepage(data.u_id, data.full_name);
				});
			} else {
				this.change_page("register")
			}
		}).catch();
	}

	save_last_post_id(post_id) {
		this.setState(prev_state => ({ prev_state, last_post_id: post_id }));
	}

	save_last_msg_id(msg_id) {
		this.setState(prev_state => ({ prev_state, last_msg_id: msg_id }));
	}

	change_page(new_page) {
		this.setState((_prev_state) => ({ page: new_page}));

		if (new_page === "register") {
			clearInterval(this.state.timerId)
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
	  	let page_layout, page_dislay;

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
		} else { 
			if (page === "homepage"){
				page_dislay = React.createElement(Homepage, { u_id: this.state.u_id, change_page: this.change_page.bind(this), save_last_post_id: this.save_last_post_id.bind(this) });
			} else if (page === "messages"){
				page_dislay = React.createElement(MessagesPage, { change_page: this.change_page.bind(this), save_last_msg_id: this.save_last_msg_id.bind(this) });
			} else if (page === "about"){
				page_dislay = React.createElement(AboutPage);
			} else if (page === "admin"){
				page_dislay = React.createElement(AdminPage, { change_page: this.change_page.bind(this), u_id: this.state.u_id, full_name: this.state.full_name, profile_pic: this.state.profile_pic });
			} else if (page === "loading"){
				page_dislay = React.createElement("img", { src: "./css/images/loading.gif" })
			}
			
			page_layout = React.createElement("div", null,
				React.createElement(Header, { u_id: this.state.u_id, full_name: this.state.full_name,
					 msg_bell: this.state.msg_bell, pst_bell: this.state.pst_bell, change_page: this.change_page.bind(this), handle_homepage: this.handle_homepage.bind(this) }),
				React.createElement(Profile, { u_id: this.state.u_id, full_name: this.state.full_name, profile_pic: this.state.profile_pic }),
				page_dislay);
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

  