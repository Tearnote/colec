// Prevent links from reloading the page
$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

// Templates
const signInModalTemplateText = $("#sign-in-modal-template").html();
const signInModalTemplate = _.template(signInModalTemplateText);
const landingPageTemplateText = $("#landing-page-template").html();
const landingPageTemplate = _.template(landingPageTemplateText);

// Primary router
let App = Backbone.Router.extend({
    routes: {
        "": "index",
        "signin": "signin",
    },
    index: function() {
        const html = landingPageTemplate();
        $("#content").html(html);
    },
    signin: function() {
        this.index();
        const html = signInModalTemplate();
        $("#modal").html(html);
        $("html").addClass("modal-is-open");
    },
});
let app = new App();

// Begin routing
Backbone.history.start({pushState: true});
