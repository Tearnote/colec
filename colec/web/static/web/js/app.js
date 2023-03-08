// Prevent links from reloading the page
$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

const App = Backbone.Router.extend({
    contentEl: document.getElementById("content"),
    modalEl: document.getElementById("modal"),
    routes: {
        "": "index",
        "signin": "signin",
    },
    index() {
        this.contentEl.innerHTML = Templates.landingPage();
    },
    signin() {
        this.index();
        this.modalEl.innerHTML = Templates.signInModal();
        document.documentElement.classList.add("modal-is-open");
    },
});

// Begin routing
let app = new App();
Backbone.history.start({pushState: true});
