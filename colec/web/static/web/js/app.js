const App = Backbone.Router.extend({
    contentEl: document.getElementById("content"),
    modalEl: document.getElementById("modal"),
    contentShown: null,
    modalShown: null,
    routes: {
        "": "index",
        "signin": "signin",
    },
    index() {
        this.hideModal();
        this.showContent("landingPage");
    },
    signin() {
        if (!this.contentShown) this.index();
        this.showModal("signInModal");
    },

    showContent(templateName) {
        if (this.contentShown === templateName) return;
        this.contentEl.innerHTML = Templates[templateName]();
        this.contentShown = templateName;
    },
    showModal(templateName) {
        if (this.modalShown === templateName) return;
        if (this.modalShown) this.hideModal();
        this.modalEl.innerHTML = Templates[templateName]();
        document.documentElement.classList.add("modal-is-open");
        this.modalShown = templateName;
    },
    hideModal() {
        if (!this.modalShown) return;
        this.modalEl.replaceChildren();
        document.documentElement.classList.remove("modal-is-open");
        this.modalShown = null;
    },
});

// Begin routing
let app = new App();
Backbone.history.start({pushState: true});

// Prevent links from reloading the page
$(document).on("click", "a", function(e) {
    e.preventDefault();
    const href = $(this).attr("href");
    Backbone.history.navigate(href, {trigger: true});
});

// Make modals closeable by clicking outside of them
app.modalEl.addEventListener("click", function(e) {
    const modalContent = this.querySelector("article");
    if (modalContent.contains(e.target)) return;
    history.back();
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && app.modalShown)
        history.back();
});
