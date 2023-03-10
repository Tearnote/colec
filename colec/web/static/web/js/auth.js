// Performs user authentication tasks
export const auth = {

    // Always represents the current user, or null if anonymous
    currentUser: null,

    // Result of sign-in / sign-out operation
    AuthResult: function(success, details) {
        this.success = success;
        this.details = details;
    },

    // Update logged-in user
    // returns the user object
    fetchCurrentUser: async function() {
        const response = await fetch("/auth/me/", { credentials: "include" });
        const user = await response.json();
        if (!this.currentUser || this.currentUser.id !== user.id) {
            this.currentUser = user;
            this.trigger("userchange", this.currentUser);
        }
        return user;
    },

    // Attempt login with provided credentials
    // returns AuthResult
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

    // Log the user out
    // returns AuthResult
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

// Modal component with the user sign-in form
export const SignInModalView = Backbone.View.extend({

    tagName: "dialog",
    attributes: { open: "" },
    events: {
        "click": "onClick",
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
    contentEl: null, // The actual modal, without the shroud
    formEl: null,
    submitButtonEl: null,
    errorTextEl: null,

    initialize: function() {
        this.render();
        this.listenTo(Backbone, "keydown", this.onKeydown);
    },

    render: function() {
        this.el.innerHTML = this.html;
        this.contentEl = this.el.children[0];
        this.formEl = this.el.querySelector("#sign-in-form");
        this.submitButtonEl = this.el.querySelector("#sign-in-button");
        this.errorTextEl = this.el.querySelector("#sign-in-error-text");
        return this;
    },

    // Close the modal
    // Since the modal is associated with a URL fragment, we go back to
    // the view that spawned it
    close: function() {
        this.remove();
        history.back();
    },

    // Close the modal if the shroud was clicked
    onClick: function(e) {
        if (!this.contentEl.contains(e.target)) this.close();
    },

    // Attempt login with user-provided details
    // Modal is closed on success, and error is displayed on failure
    onSubmit: async function(e) {
        e.preventDefault();
        this.submitButtonEl.setAttribute("aria-busy", "true");
        const inputs = this.formEl.elements;
        const result = await auth.login(inputs.username.value, inputs.password.value);
        if (result.success)
            this.close();
        else
            this.setError(result.details);
    },

    // Close the modal if esc was pressed
    onKeydown: function(key) {
        if (key === "Escape") this.close();
    },

    // Display an error string to the user
    setError: function(str) {
        this.submitButtonEl.setAttribute("aria-busy", "false");
        this.errorTextEl.textContent = str;
    }

});
