function buildTemplate(id) {
    return _.template(document.getElementById(id + "-template").innerHTML);
}

const Templates = {
    landingPage: buildTemplate("landing-page"),
    signInModal: buildTemplate("sign-in-modal"),
};
