// Prevent links from reloading the page
$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

const App = Backbone.Router.extend({
    contentEl: document.getElementById("content"),
    modalEl: document.getElementById("modal"),
    modalShown: false,
    routes: {
        "": "index",
        "signin": "signin",
    },
    index() {
        this.hideModal();
        this.contentEl.innerHTML = Templates.landingPage();
    },
    signin() {
        this.index();
        this.showModal(Templates.signInModal());
    },
    showModal(html) {
        if (this.modalShown) this.hideModal();
        this.modalEl.innerHTML = html;
        document.documentElement.classList.add("modal-is-open");
        this.modalShown = true;
    },
    hideModal() {
        if (!this.modalShown) return;
        this.modalEl.replaceChildren();
        document.documentElement.classList.remove("modal-is-open");
        this.modalShown = false;
    },
});

// Begin routing
let app = new App();
Backbone.history.start({pushState: true});
