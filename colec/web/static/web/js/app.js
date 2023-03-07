const signInModalTemplateText = $("#sign-in-modal-template").html();
const signInModalTemplate = _.template(signInModalTemplateText);

document.getElementById("sign-in-button").addEventListener("click", () => {
    const html = signInModalTemplate();
    let el = $.parseHTML(html);
    console.log(el);
    $("body").append(el);
});
