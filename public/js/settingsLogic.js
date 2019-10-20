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
//            location.reload();
        },
        error: function() {
            // TODO - popup
            console.log('Error changing Username!');
            location.reload();
        }
    });
}

// function changeEmail(id){
//     req.body.action
//     req.body.newEmail, req.body.password
// }
//
// function changePassword(id) {
//     req.body.action
//     req.body.password, req.body.newPassword, req.body.newPassword2
//
//     $.ajax({
//         type: 'POST',
//         url: '/user' + session.userId,
//         data: {
//             'email': $('#loginInputEmail').val(),
//             'password': $('#loginInputPassword').val()
//         },
//         success: function(msg){
//             // TODO - popup
//             console.log('Logged in!');
//             location.reload();
//         },
//         error: function() {
//             // TODO - popup
//             console.log('error');
//         }
//     });
// }
//
// function deleteAccount(id) {
//     req.body.action
//     req.body.email, req.body.password, req.body.newPassword2
//     console.log('lul');
// }