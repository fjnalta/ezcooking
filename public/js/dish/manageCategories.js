/**
 * Populate Categories in Dropdown Menu
 * @param data is a JSON Array of all Categories - format:
 * [{"id":2,"name":"Getränke"}]
 */
function populateCategories(data) {
    for(let i=0;i<data.length;i++) {
        $("<button/>").addClass("dropdown-item").prop({ type: "button" }).text(data[i].name).click(function () {
            // Disable Save Button because SubCategory is not set
            $("#buttonSendRecipe").prop('disabled', true);
            // Remove selection from SubCategory
            $("#dropdownSubCategory").text("Sub-Kategorie");
            // Set Menu Text
            $("#dropdownCategory").text(data[i].name);
            // Load Sub Categories
            loadSubCategories(data[i].id);
        }).appendTo("#dropdown-menu-category");
    }
}

/**
 * Populate SubCategories in Dropdown Menu
 * @param data is a JSON Array of all Categories - format:
 * [{"id":27,"name":"Gemüse","category":3}]
 */
function populateSubCategories(data) {
    // Activate SubCategory Menu
    $("#dropdown-menu-subcategory").empty();
    $("#dropdownSubCategory").prop('disabled', false);
    for(let i=0;i<data.length;i++) {
        $("<button/>").addClass("dropdown-item").prop({ type: "button" }).text(data[i].name).click(function () {
            // Set Menu Text
            $("#dropdownSubCategory").text(data[i].name);
            // Enable Save Button
            $("#buttonSendRecipe").prop('disabled', false);
        }).appendTo("#dropdown-menu-subcategory");
    }
}