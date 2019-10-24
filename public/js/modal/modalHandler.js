$(document).keypress(function(e) {
    console.log('ajo');
    if ($("#loginModal").hasClass('show') && (e.keycode == 13 || e.which == 13)) {
        login();
        //$("#loginModal").removeClass('show');
    }
});