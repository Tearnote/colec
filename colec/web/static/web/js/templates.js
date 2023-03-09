function buildTemplate(id) {
    return _.template(document.getElementById(id + "-template").innerHTML);
}

export const Templates = {
    landingPage: buildTemplate("landing-page"),
    signInModal: buildTemplate("sign-in-modal"),
};
