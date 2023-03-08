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
        let el = $("#content");
        el.html(html);
    },
    signin: function() {
        const html = signInModalTemplate();
        let el = $.parseHTML(html);
        $("body").append(el);
    },
});
let app = new App();
Backbone.history.start({pushState: true});
