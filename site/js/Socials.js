class User extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return;
    }
}

class NewPost extends React.Component {
    constructor(props) {
		super(props);
	}

    handle_post = e => {
		e.preventDefault();

		create_post(e.target.post.value)
		.then((res) => {
			if (res.ok) {
				alert("Post successfull");
			} else {
				res.json().then(data => {
					alert(data.error);
				});
			}
			e.target.post.value = "";
		}).catch();

	}

    render() {
        return React.createElement(
            "div",
            { className: "post-container", id: "write-post" },
            React.createElement(
                "form",
                { className: "form", onSubmit: this.handle_post },
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
                        { className: "secondary" },
                        "Post"
                    ),	
                ),
              ),
        );
    }
}

class Message extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return;
    }
}

