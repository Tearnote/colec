// Prevent links from reloading the page
$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

// Primary router
const templates = new Templates();
let App = Backbone.Router.extend({
    routes: {
        "": "index",
        "signin": "signin",
    },
    index: function() {
        const html = templates.landingPage();
        $("#content").html(html);
    },
    signin: function() {
        this.index();
        const html = templates.signInModal();
        $("#modal").html(html);
        $("html").addClass("modal-is-open");
    },
});
let app = new App();

// Begin routing
Backbone.history.start({pushState: true});
