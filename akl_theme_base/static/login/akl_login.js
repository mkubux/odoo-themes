// toggle the password display

$(function() {
    var togglePassword = document.getElementById("toggle-password");
    togglePassword.addEventListener('click', function() {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    });
})
