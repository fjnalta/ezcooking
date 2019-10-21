function register() {
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
            // TODO - popup
            location.reload();
        },
        error: function() {
            // TODO - popup
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
            // TODO - popup
            location.reload();
        },
        error: function() {
            // TODO - popup
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