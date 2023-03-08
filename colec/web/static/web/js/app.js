// Prevent links from reloading the page
$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

const App = Backbone.Router.extend({
    routes: {
        "": "index",
        "signin": "signin",
    },
    index() {
        document.getElementById("content").innerHTML = Templates.landingPage();
    },
    signin() {
        this.index();
        document.getElementById("modal").innerHTML = Templates.signInModal();
        document.documentElement.classList.add("modal-is-open");
    },
});

// Begin routing
let app = new App();
Backbone.history.start({pushState: true});
