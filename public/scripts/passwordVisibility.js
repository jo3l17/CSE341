var seePassword = false
var seeConfirmPassword = false
function changePasswordVisibility() {
    document.getElementById('password').type = seePassword ? 'password' : 'text'
    var eye = document.getElementById('password-eye');
    var eye_slash = document.getElementById('password-eye-slash');
    if (seePassword) {
        eye.classList.add('d-none');
        eye_slash.classList.remove('d-none');
    } else {
        eye.classList.remove('d-none');
        eye_slash.classList.add('d-none');
    }
    seePassword = !seePassword;
}
function changeconfirmPasswordVisibility() {
    document.getElementById('confirmPassword').type = seeConfirmPassword ? 'password' : 'text'
    var eye = document.getElementById('confirmPassword-eye');
    var eye_slash = document.getElementById('confirmPassword-eye-slash');
    if (seeConfirmPassword) {
        eye.classList.add('d-none');
        eye_slash.classList.remove('d-none');
    } else {
        eye.classList.remove('d-none');
        eye_slash.classList.add('d-none');
    }
    seeConfirmPassword = !seeConfirmPassword;
}