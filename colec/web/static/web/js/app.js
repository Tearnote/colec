import {auth, SignInModalView} from "./auth.js";

// Workaround for JetBrains bug
// https://youtrack.jetbrains.com/issue/WEB-3552/
window.Backbone = Backbone;

// Forward global key events as Backbone events
document.addEventListener("keydown", function(e) {
    Backbone.trigger("keydown", e.key);
});

// Site header component
// Updates itself in response to user changes
const HeaderView = Backbone.View.extend({

    tagName: "header",
    className: "container-fluid",
    events: {
        "click #sign-out-button": "onSignOut",
    },

    template: _.template(`
        <nav>
            <a href="/"><h1>Colec</h1></a>
            <ul>
                <li><%= userText %></li>
                <li><%= userButton %></li>
            </ul>
        </nav>
    `),
    signInButtonHtml: `
        <a role="button" class="outline" href="/signin">Sign in</a>
    `,
    signOutButtonHtml: `
        <a id="sign-out-button" role="button" class="outline" href="#">Sign out</a>
    `,

    initialize: function() {
        this.render();
        this.listenTo(auth, "userchange", this.onUserChange);
    },

    // Renders user details if user argument is provided
    // If user is not provided, offer sign-in
    render: function(user) {
        if (!user) {
            this.el.innerHTML = this.template({
                userText: "",
                userButton: this.signInButtonHtml,
            });
        } else {
            this.el.innerHTML = this.template({
                userText: `You are signed in as ${user.username}`,
                userButton: this.signOutButtonHtml,
            });
        }
        return this;
    },

    onUserChange: function(user) {
        this.render(user);
    },

    onSignOut: function() {
        this.el.querySelector("#sign-out-button").setAttribute("aria-busy", "true");
        auth.logout(); // We don't need the promise - header will be updated via event
    },

});

// Site footer component
const FooterView = Backbone.View.extend({

    tagName: "footer",
    className: "container-fluid",

    html: `
        <p>Colec, Copyright 2023</p>
    `,

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.innerHTML = this.html;
        return this;
    },

});

// Static landing page content component
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

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.innerHTML = this.html;
        return this;
    },

});

// Structural component of the site's index (root) page
const IndexView = Backbone.View.extend({

    tagName: "body",
    header: new HeaderView(),
    footer: new FooterView(),
    content: new LandingView(),
    events: {
        "click a": "onAnchorClick",
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.append(
            this.header.el,
            this.content.el,
            this.footer.el,
        );
        return this;
    },

    // Prevent links to other URLs from reloading the page
    onAnchorClick: function(e) {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        Backbone.history.navigate(href, {trigger: true});
    },

});

// Primary URL router, controls which components are shown
const AppRouter = Backbone.Router.extend({

    contentView: null,

    routes: {
        "": "index",
        "signin": "signIn",
    },

    // Show the landing page
    index: function() {
        const indexView = new IndexView();
        document.body.replaceWith(indexView.el);
        this.contentView = indexView;
    },

    // Show the sign-in modal
    // If navigated to directly, the modal will have the landing page below
    signIn: function() {
        if (!this.contentView) this.index();
        const signInModalView = new SignInModalView();
        this.contentView.el.append(signInModalView.el);
    },

});

// Initialize the app by dispatching the current route
let appRouter = new AppRouter();
Backbone.history.start({pushState: true});

// Retrieve signed-in user if still active from another session
auth.fetchCurrentUser();
