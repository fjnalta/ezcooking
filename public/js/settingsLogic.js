function changeName(id) {
    $.ajax({
        type: 'POST',
        url: '/user/' + id,
        data: {
            'action': 0,
            'newUsername': $('#inputNewName').val(),
            'password': $('#inputNamePassword').val()
        },
        success: function(msg){
            // TODO - popup
            console.log('Success!');
            window.location.href = "/";
        },
        error: function() {
            // TODO - popup
            console.log('Error changing Username!');
            location.reload();
        }
    });
}

function changeEmail(id) {
    $.ajax({
        type: 'POST',
        url: '/user/' + id,
        data: {
            'action': 1,
            'newEmail': $('#inputNewEmail').val(),
            'password': $('#inputEmailPassword').val()
        },
        success: function(msg){
            // TODO - popup
            console.log('Success!');
            window.location.href = "/";
        },
        error: function() {
            // TODO - popup
            console.log('Error changing Username!');
            location.reload();
        }
    });
}

function changePassword(id) {
    $.ajax({
        type: 'POST',
        url: '/user/' + id,
        data: {
            'action': 2,
            'password': $('#inputOldPassword').val(),
            'newPassword': $('#inputNewPassword').val(),
            'newPassword2': $('#inputNewPassword2').val()
        },
        success: function(msg){
            // TODO - popup
            console.log('Success!');
            window.location.href = "/";
        },
        error: function() {
            // TODO - popup
            console.log('Error changing Username!');
            location.reload();
        }
    });
}

function deleteAccount(id) {
    $.ajax({
        type: 'POST',
        url: '/user/' + id,
        data: {
            'action': 3,
            'password': $('#inputPassword').val()
        },
        success: function(msg){
            // TODO - popup
            console.log('Success!');
            window.location.href = "/";
        },
        error: function() {
            // TODO - popup
            console.log('Error changing Username!');
            location.reload();
        }
    });
}