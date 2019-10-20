function register() {
    console.log('Register!');
    // TODO - build AJAX backend call
    // POST - /register
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
        }
    });
}