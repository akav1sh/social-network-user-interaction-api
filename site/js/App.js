
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  page: "loading",
		  timerId: null,
		  last_post_id: null,
		  last_msg_id: null
		};
		this.notification = this.notification.bind(this);
	}
  
	componentDidMount() {
		if (this.state.page === "login")
			this.rightSide.classList.add("right");	
		
		this.handle_logged_user();
	}

	notification() {
		let msg_bell, pst_bell;
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
											&& this.state.last_msg_id !== msg_data.messages[0].m_id) {
												msg_bell = true;
												pst_bell = true;
											}
										else if (msg_data.messages[0] 
												 && this.state.last_msg_id !== msg_data.messages[0].m_id) {
													msg_bell = true;
													pst_bell = false;
												 }
										else if (post_data.posts[0] 
												 && this.state.last_post_id !== post_data.posts[0].p_id) {
													msg_bell = false;
													pst_bell = true;
												 }
										else {
											msg_bell = false;
											pst_bell = false;
										}

										if (this.state.msg_bell !== msg_bell || this.state.pst_bell !== pst_bell)
											this.setState(prev_state => ({ prev_state, msg_bell: msg_bell, pst_bell: pst_bell }));
									});
								} else {
									if (post_res.statusText === "Forbidden")
										this.change_page("register")
								}
							}).catch();
						}
						else if (post_data.posts[0] 
							 	 && this.state.last_post_id !== post_data.posts[0].p_id) {
									msg_bell = false;
									pst_bell = true;
								  }
						else {
							msg_bell = false;
							pst_bell = false;
						}

						if (!this.state.last_msg_id && (this.state.msg_bell !== msg_bell || this.state.pst_bell !== pst_bell))
							this.setState(prev_state => ({ prev_state, msg_bell: msg_bell, pst_bell: pst_bell }));
					});
				} else {
					if (post_res.statusText === "Forbidden")
						this.change_page("register")
				}
			}).catch();
		}
	}

	handle_logged_user() {
		const seconds = 30;
		is_logged()
		.then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					this.state.timerId = setInterval(this.notification, seconds * 1000);
					this.get_message_to_save();
					this.get_posts(data.u_id, data.full_name);
				});
			} else {
				this.change_page("register")
			}
		}).catch();
	}

	get_message_to_save() {
		get_message(0, "all", 1)
		.then((res) => {
			if (res.ok) {
				res.json()
				.then((data) => {
					if (data.messages[0]) 
						this.save_last_msg_id(data.messages[0].m_id);
				});
			} else {
				this.change_page("register")
			}
		}).catch();
	}

	get_posts(id, name) {
		let user_post, posts;
		if (id) {
			get_post(id, 1)
			.then((res_user) => {
				if (res_user.ok) {
					res_user.json().then((data_user) => {
						get_post(0, 4)
						.then((res_posts) => {
							if (res_posts.ok) {
								res_posts.json().then((data_posts) => {
									if (data_posts.posts[0] && data_user.posts[0]) {
										this.save_last_post_id(data_posts.posts[data_posts.posts.length - 1].p_id);
										user_post = data_user.posts[0];
										posts = data_posts.posts;
									} else if (data_posts.posts[0]) {
										this.save_last_post_id(data_posts.posts[data_posts.posts.length - 1].p_id);
										user_post = null;
										posts = data_posts.posts;
									} else if (data_user.posts[0]) {
										user_post = data_user.posts[0];
										posts = null;
									} else {
										user_post = null;
										posts = null;
									}
									this.handle_homepage(id, name, user_post, posts)
								});
							} else {
								if (res_posts.statusText === "Forbidden")
									this.change_page("register")
							}
						}).catch();
					});
				} else {
					if (res_user.statusText === "Forbidden")
						this.change_page("register")
					}
			}).catch();
		}
    }

	get_messages() {
		let messages = null;
        get_message(0, "all", 4)
        .then((res) => {
			if (res.ok) {
                res.json()
				.then((data) => {
					if (data.messages[0]) {
						this.save_last_msg_id(data.messages[data.messages.length - 1].m_id);
						messages = data.messages;
					}
					this.setState((_prev_state) => ({ page: "messages", messages: messages, msg_bell: false }));
				});
            } else {
				this.change_page("register");
			}
		}).catch();
    }

	save_last_post_id(post_id) {
		this.state.last_post_id = post_id;
	}

	save_last_msg_id(msg_id) {
		this.state.last_msg_id = msg_id;
	}

	change_page(new_page) {
		if (new_page === "messages") 
			this.get_messages()
		else
			this.setState((_prev_state) => ({ page: new_page }));

		if (new_page === "register") {
			clearInterval(this.state.timerId)
			this.change_state();
		}
	}
  
	handle_homepage(id, name, user_post, posts) {
		this.setState(_prev_state => ({ page: "homepage", u_id: id, full_name: name, profile_pic: Math.floor(Math.random() * 4) + 1, user_post: user_post, posts: posts, pst_bell: false }));
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

		if (page === "loading"){
			page_layout = React.createElement("img", { src: "./css/images/loading.gif" })
		} else if (page === "login" || page === "register") {
			page_layout =  React.createElement(
				"div",
				{ className: "App" },
				React.createElement(
				  "div",
				  { className: "login" },
				  React.createElement(
					"div",
					{ className: "container"},
					page === "login" && React.createElement(Login, { handle_logged_user: this.handle_logged_user.bind(this) }),
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
				page_dislay = React.createElement(Homepage, { get_posts: this.get_posts.bind(this), 
					u_id: this.state.u_id, full_name: this.state.full_name, user_post: this.state.user_post, posts: this.state.posts });
			} else if (page === "messages"){
				page_dislay = React.createElement(MessagesPage, { change_page: this.change_page.bind(this),
					save_last_msg_id: this.save_last_msg_id.bind(this), messages: this.state.messages });
			} else if (page === "about"){
				page_dislay = React.createElement(AboutPage);
			} else if (page === "admin"){
				page_dislay = React.createElement(AdminPage, { change_page: this.change_page.bind(this),
					 u_id: this.state.u_id, full_name: this.state.full_name, profile_pic: this.state.profile_pic });
			}
			page_layout = React.createElement("div", null,
				React.createElement(Header, { u_id: this.state.u_id, full_name: this.state.full_name, 
					 msg_bell: this.state.msg_bell, pst_bell: this.state.pst_bell, change_page: this.change_page.bind(this), get_posts: this.get_posts.bind(this) }),
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

  