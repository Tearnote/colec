class Templates {
    constructor() {
        this.landingPage = this.buildTemplate("landing-page");
        this.signInModal = this.buildTemplate("sign-in-modal");
    }

    buildTemplate(id) {
        return _.template(document.getElementById(id + "-template").innerHTML);
    }
}
