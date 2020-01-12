function registerUser() {
    grecaptcha.ready(function() {
        grecaptcha.execute('6Lcu2MoUAAAAALOAo2r-qPFR8La5FQboPaJXCicb', { action: 'homepage' }).then(function(token) {
            $.ajax({
                type: 'POST',
                url: '/register',
                data: {
                    'username' : $('#registerInputUsername').val(),
                    'email' : $('#registerInputEmail').val(),
                    'password' : $('#registerInputPassword1').val(),
                    'password2' : $('#registerInputPassword2').val(),
                    'token': token
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
        })
    });

}

function login() {
    grecaptcha.ready(function() {
        grecaptcha.execute('6Lcu2MoUAAAAALOAo2r-qPFR8La5FQboPaJXCicb', { action: 'homepage' }).then(function(token) {
            $.ajax({
                type: 'POST',
                url: '/login',
                data: {
                    'email': $('#loginInputEmail').val(),
                    'password': $('#loginInputPassword').val(),
                    'token': token
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
        });
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