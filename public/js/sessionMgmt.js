function login() {
    $.ajax({
        type: 'POST',
        url: '/login',
        data: { 
            'email': $('#loginInputEmail').val(),
            'password': $('#loginInputPassword').val()
        },
        success: function(msg){
            // TODO - popup
            console.log('Logged in!');
            location.reload();
        },
        error: function() {
            // TODO - popup
            console.log('error');
        }
    });
}

function register() {
    console.log('Register!');
    // TODO - build AJAX backend call
    // POST - /register
}

function logout() {
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: function(msg){
            location.reload();
        }
    });
}