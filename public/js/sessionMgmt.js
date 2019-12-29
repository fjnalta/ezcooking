function registerUser() {
    $.ajax({
        type: 'POST',
        url: '/register',
        data: {
            'username' : $('#registerInputUsername').val(),
            'email' : $('#registerInputEmail').val(),
            'password' : $('#registerInputPassword1').val(),
            'password2' : $('#registerInputPasswort2').val()
        },
        success: function(){
            showRegistrationSuccessfulAlert();
            setTimeout(function(){
                location.reload();
            }, 3000)
        },
        error: function() {
            showRegistrationFailAlert();
        }
    });
}

function login() {
    $.ajax({
        type: 'POST',
        url: '/login',
        data: { 
            'email': $('#loginInputEmail').val(),
            'password': $('#loginInputPassword').val()
        },
        success: function(){
            showLoginSuccessfulAlert();
            setTimeout(function(){
                location.reload();
            }, 3000)
        },
        error: function() {
            showLoginFailAlert();
        }
    });
}

function logout() {
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: function(){
            location.reload();
        },
        error: function () {
            // TODO - popup
        }
    });
}