function login() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/login',
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
        url: 'http://localhost:3000/logout',
        success: function(msg){
            location.reload();
        }
    });
}