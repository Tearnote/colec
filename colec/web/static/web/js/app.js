// Workaround for JetBrains bug
// https://youtrack.jetbrains.com/issue/WEB-3552/
window.Backbone = Backbone;

// Forward global key events as Backbone events
document.addEventListener("keydown", function(e) {
    Backbone.trigger("keydown", e.key);
});

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
        "click #sign-in-button": "onSignIn",
    },
    html: `
        <article>
            <h2>Welcome back.</h2>
            <form id="sign-in-form">
                <label>
                    Username:
                    <input type="text" name="username">
                </label>
                <label>
                    Password:
                    <input type="password" name="password">
                </label>
            </form>
            <footer>
                <input id="sign-in-button" type="submit" form="sign-in" value="Sign in">
            </footer>
        </article>
    `,
    initialize() {
        this.listenTo(Backbone, "keydown", this.onKeydown);
    },
    render() {
        this.el.innerHTML = this.html;
        return this;
    },
    close() {
        this.remove();
        history.back();
    },
    onClick(e) {
        const modalContent = this.el.children[0];
        if (modalContent.contains(e.target)) return;
        this.close();
    },
    onSignIn(e) {
        e.preventDefault();
        const inputs = this.el.querySelector("#sign-in-form").elements;
        const token = btoa(`${inputs.username.value}:${inputs.password.value}`);
        console.log("start");
        $.ajax("/auth/login/", {
            method: "POST",
            headers: {
                Authorization: `Basic ${token}`,
            },
            success() {
                console.log("Sign-in success");
            },
            error() {
                console.log("Sign-in error");
            }
        });
    },
    onKeydown(key) {
        if (key === "Escape") this.close();
    },
});

const IndexView = Backbone.View.extend({
    tagName: "body",
    header: new HeaderView(),
    footer: new FooterView(),
    content: new LandingView(),
    events: {
        "click a": "onAnchorClick", // Prevent links from reloading the page
    },
    render() {
        this.header.render();
        this.footer.render();
        this.content.render();
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
        indexView.render();
        document.body.replaceWith(indexView.el);
        this.contentView = indexView;
    },
    signin() {
        if (!this.contentView) this.index();
        const signInModalView = new SignInModalView();
        signInModalView.render();
        this.contentView.el.append(signInModalView.el);
    },
});

let appRouter = new AppRouter();
Backbone.history.start({pushState: true});
