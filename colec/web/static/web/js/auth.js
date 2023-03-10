export const auth = {
    async login(username, password) {
        const token = btoa(`${username}:${password}`);
        return fetch("/auth/login/", {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Basic ${token}`,
            },
        });
    },
};

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
    onSubmit(e) {
        e.preventDefault();
        this.submitButton.setAttribute("aria-busy", "true");
        const inputs = this.form.elements;
        auth.login(inputs.username.value, inputs.password.value)
            .then(response => response.json().then(data => ({
                ok: response.ok,
                body: data.detail,
            })))
            .then(response => {
                if (!response.ok)
                    throw new Error(response.body);
                this.close();
            })
            .catch(error => this.setError(error));
    },
    onKeydown(key) {
        if (key === "Escape") this.close();
    },
    setError(str) {
        this.submitButton.setAttribute("aria-busy", "false");
        this.errorText.textContent = str;
    }
});
