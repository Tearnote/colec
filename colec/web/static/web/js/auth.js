export const auth = {
    currentUser: null,
    SignInResult: function(success, details) {
        this.success = success;
        this.details = details;
    },
    async login(username, password) {
        const token = btoa(`${username}:${password}`);
        const response = await fetch("/auth/login/", {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Basic ${token}`,
            },
        });
        const json = await response.json();
        const result = new this.SignInResult(
            response.ok,
            json.detail,
        );
        if (result.success) {
            this.currentUser = json;
            this.trigger("signin", this.currentUser);
        }
        return result;
    },
    async fetchCurrentUser() {
        const response = await fetch("/auth/me/", { credentials: "include" });
        return await response.json();
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
    initialize() {
        this.render();
        this.listenTo(Backbone, "keydown", this.onKeydown);
    },
    render() {
        this.el.innerHTML = this.html;
        this.content = this.el.children[0];
        this.form = this.el.querySelector("#sign-in-form");
        this.submitButton = this.el.querySelector("#sign-in-button");
        this.errorText = this.el.querySelector("#sign-in-error-text");
        return this;
    },
    close() {
        this.remove();
        history.back();
    },
    onClick(e) {
        if (!this.content.contains(e.target)) this.close();
    },
    async onSubmit(e) {
        e.preventDefault();
        this.submitButton.setAttribute("aria-busy", "true");
        const inputs = this.form.elements;
        try {
            const result = await auth.login(inputs.username.value, inputs.password.value);
            if (result.success)
                this.close();
            else
                throw new Error(result.details);
        } catch(error) {
            this.setError(error);
        }
    },
    onKeydown(key) {
        if (key === "Escape") this.close();
    },
    setError(str) {
        this.submitButton.setAttribute("aria-busy", "false");
        this.errorText.textContent = str;
    }
});
