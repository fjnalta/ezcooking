/* Alerts */

/**
 * Create new HTML class to hide an alert
 */
$(document).ready(function() {
    // Add fade out functionality to all element with data-hide attribute
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).fadeOut();
    });

});

function showTestAlert() {
    $("#testAlert").fadeIn();
    window.setTimeout(function() {
        $("#testAlert").fadeOut();
    }, 3000);
}

/**
 * Registration
 */
function showRegistrationSuccessfulAlert() {
    $("#registrationSuccessfulAlert").fadeIn();
    window.setTimeout(function() {
        $("#registrationSuccessfulAlert").fadeOut();
    }, 3000);
}

function showRegistrationFailAlert() {
    $("#registrationFailAlert").fadeIn();
    window.setTimeout(function() {
        $("#registrationFailAlert").fadeOut();
        }, 3000);
}

/**
 * Login
 */
function showLoginSuccessfulAlert() {
    $("#loginSuccessfulAlert").fadeIn();
    window.setTimeout(function() {
        $("#loginSuccessfulAlert").fadeOut();
    }, 3000);
}

function showLoginFailAlert() {
    $("#loginFailAlert").fadeIn();
    window.setTimeout(function() {
        $("#loginFailAlert").fadeOut();
    }, 3000);
}


/**
 *
 */

/*
<button class="btn btn-danger" type="button" onclick="showTestAlert()">DM</button>
 */