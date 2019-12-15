/**
 * Load Categories from DB
 */
function loadMainCategories() {
    $.ajax({
        type: 'GET',
        url: '/categories',
        success: function (msg) {
            populateCategories(msg);
        },
        dataType: "json"
    });
}

/**
 * Load Sub-Category if Category was selected
 * @param id is the DB id of the selected Category
 */
function loadSubCategories(id) {
    // Call for SubCategories
    $.ajax({
        type: 'GET',
        url: '/categories/' + id,
        success: function (msg) {
            populateSubCategories(msg);
        },
        dataType: "json"
    });
}