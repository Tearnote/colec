$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

const signInModalTemplateText = $("#sign-in-modal-template").html();
const signInModalTemplate = _.template(signInModalTemplateText);

let App = Backbone.Router.extend({
    routes: {
        "signin": "signin",
    },
    signin: function() {
        const html = signInModalTemplate();
        let el = $.parseHTML(html);
        $("body").append(el);
    },
});
let app = new App();
Backbone.history.start({pushState: true});
