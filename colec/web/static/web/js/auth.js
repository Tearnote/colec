export const auth = {
    currentUser: null,
    AuthResult: function(success, details) {
        this.success = success;
        this.details = details;
    },
    fetchCurrentUser: async function() {
        const response = await fetch("/auth/me/", { credentials: "include" });
        const user = await response.json();
        if (!this.currentUser || this.currentUser.id !== user.id) {
            this.currentUser = user;
            this.trigger("userchange", this.currentUser);
        }
        return user;
    },
    login: async function(username, password) {
        const token = btoa(`${username}:${password}`);
        const response = await fetch("/auth/login/", {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Basic ${token}`,
            },
        });
        const json = await response.json();
        const result = new this.AuthResult(
            response.ok,
            json.detail,
        );
        if (result.success) {
            this.currentUser = json;
            this.trigger("userchange", this.currentUser);
        }
        return result;
    },
    logout: async function() {
        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch("/auth/logout/", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRFToken": csrfToken,
            },
        });
        const json = await response.json();
        const result = new this.AuthResult(
            response.ok,
            json.detail,
        );
        if (result.success) {
            this.currentUser = null;
            this.trigger("userchange", this.currentUser);
        }
        return result;
    }
};
_.extend(auth, Backbone.Events);

export const SignInModalView = Backbone.View.extend({
    tagName: "dialog",
    attributes: { open: "" },
    events: {
        "click": "onClick", // Close if clicked outside the modal
        "submit": "onSubmit",
    },
    html: `
        <article>
            <h2>Welcome back.</h2>
            <form id="sign-in-form">
                <label>
                    Username:
                    <input type="text" name="username" required>
                </label>
                <label>
                    Password:
                    <input type="password" name="password" required>
                </label>
                <p id="sign-in-error-text"></p>
            </form>
            <footer>
                <button id="sign-in-button" form="sign-in-form">Sign in</button>
            </footer>
        </article>
    `,
    // Cached DOM nodes
    content: null, // The actual modal, without the shroud
    form: null,
    submitButton: null,
    errorText: null,
    initialize: function() {
        this.render();
        this.listenTo(Backbone, "keydown", this.onKeydown);
    },
    render: function() {
        this.el.innerHTML = this.html;
        this.content = this.el.children[0];
        this.form = this.el.querySelector("#sign-in-form");
        this.submitButton = this.el.querySelector("#sign-in-button");
        this.errorText = this.el.querySelector("#sign-in-error-text");
        return this;
    },
    close: function() {
        this.remove();
        history.back();
    },
    onClick: function(e) {
        if (!this.content.contains(e.target)) this.close();
    },
    onSubmit: async function(e) {
        e.preventDefault();
        this.submitButton.setAttribute("aria-busy", "true");
        const inputs = this.form.elements;
        const result = await auth.login(inputs.username.value, inputs.password.value);
        if (result.success)
            this.close();
        else
            this.setError(result.details);
    },
    onKeydown: function(key) {
        if (key === "Escape") this.close();
    },
    setError: function(str) {
        this.submitButton.setAttribute("aria-busy", "false");
        this.errorText.textContent = str;
    }
});
