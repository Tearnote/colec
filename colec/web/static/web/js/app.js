// Workaround for JetBrains bug
// https://youtrack.jetbrains.com/issue/WEB-3552/
window.Backbone = Backbone;

// Forward global key events as Backbone events
document.addEventListener("keydown", function(e) {
    Backbone.trigger("keydown", e.key);
});

const auth = {
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

const HeaderView = Backbone.View.extend({
    tagName: "header",
    className: "container-fluid",
    html: `
        <nav>
            <a href="/"><h1>Colec</h1></a>
            <ul>
                <li><a role="button" class="outline" href="/signin">Sign in</a></li>
            </ul>
        </nav>
    `,
    initialize() {
        this.render();
    },
    render() {
        this.el.innerHTML = this.html;
        return this;
    },
});

const FooterView = Backbone.View.extend({
    tagName: "footer",
    className: "container-fluid",
    html: `
        <p>Colec, Copyright 2023</p>
    `,
    initialize() {
        this.render();
    },
    render() {
        this.el.innerHTML = this.html;
        return this;
    },
});

const LandingView = Backbone.View.extend({
    tagName: "main",
    className: "container-fluid",
    html: `
        <section id="eyecatch">
            <h2>Track your <span id="everything">everything.</span></h2>
            <a href="#" role="button">Sign up</a>
        </section>
        <section class="grid">
            <article>
                <header><h3>All in one place.</h3></header>
                <p>
                    With <em>Colec</em> you can track anything you own. Every
                    collection you care about, together in one place, with a
                    consistent UI, and easy to share with others.
                </p>
            </article>
            <article>
                <header><h3>Fields you care about.</h3></header>
                <p>
                    No more cluttered interfaces. You can fully customize any
                    collection, adding and removing fields of any type, such as
                    text, number, or dropdown. For more freeform input, you can
                    assign arbitrary tags to collection items.
                </p>
            </article>
            <article>
                <header><h3>Own your data.</h3></header>
                <p>
                    <em>Colec</em> is opensource, and can be hosted by anyone.
                    Your collections can be exported to a JSON format, for later
                    import in a different instance, or for use by any external
                    utilities.
                </p>
            </article>
        </section>
    `,
    initialize() {
        this.render();
    },
    render() {
        this.el.innerHTML = this.html;
        return this;
    },
});

const SignInModalView = Backbone.View.extend({
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

const IndexView = Backbone.View.extend({
    tagName: "body",
    header: new HeaderView(),
    footer: new FooterView(),
    content: new LandingView(),
    events: {
        "click a": "onAnchorClick", // Prevent links from reloading the page
    },
    initialize() {
        this.render();
    },
    render() {
        this.el.append(
            this.header.el,
            this.content.el,
            this.footer.el,
        );
        return this;
    },
    onAnchorClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        Backbone.history.navigate(href, {trigger: true});
    },
});

const AppRouter = Backbone.Router.extend({
    contentView: null,
    routes: {
        "": "index",
        "signin": "signin",
    },
    index() {
        const indexView = new IndexView();
        document.body.replaceWith(indexView.el);
        this.contentView = indexView;
    },
    signin() {
        if (!this.contentView) this.index();
        const signInModalView = new SignInModalView();
        this.contentView.el.append(signInModalView.el);
    },
});

let appRouter = new AppRouter();
Backbone.history.start({pushState: true});
