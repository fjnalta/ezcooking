$(document).keypress(function(e) {
    if ($("#loginModal").hasClass('show') && (e.keycode == 13 || e.which == 13)) {
        login();
        // Login does redirect automatically - no need to hide the modal
        //$("#loginModal").removeClass('show');
    }
});