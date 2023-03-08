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

$("#sign-in-button").on("click", function() {
    app.navigate("signin", {trigger: true});
});
