$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

const signInModalTemplateText = $("#sign-in-modal-template").html();
const signInModalTemplate = _.template(signInModalTemplateText);
const landingPageTemplateText = $("#landing-page-template").html();
const landingPageTemplate = _.template(landingPageTemplateText);

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
Backbone.history.start({pushState: true});
