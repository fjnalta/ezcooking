let newIngredients = 999;

function loadData(id) {
    getIngredients(id);
}

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

function getIngredients(ingredientId) {
    $.ajax({
        type: 'GET',
        url: '/ingredients',
        success: function (msg) {
            prepareIngredientDropdown(ingredientId, msg);
            return msg;
        },
        dataType: "json"
    });
}

function prepareIngredientDropdown(ingredientId, data) {
    $("#dropdown-menu-ingredients_" + ingredientId).empty();
    $("#dropdownIngredient_" + ingredientId).prop('disabled', false);
    for(let i=0;i<data.length;i++) {
        $('<button/>').addClass('dropdown-item').prop({ type: 'button' }).text(data[i].name).click(function () {
            // Set Menu Text
            $('#dropdownIngredient_' + ingredientId).text(data[i].name + ' (' + data[i].shortName + ')');
            // Enable Update Button
            $("#buttonUpdateRecipe").prop('disabled', false);


        }).appendTo('#dropdown-menu-ingredients_' + ingredientId);
    }
}

function deleteIngredient(dishId) {
    $("#ingredientsRow_" + dishId).remove();
}

function addIngredientRow() {
    $("#ingredientsTable").append(
        "<tr id='ingredientsRow_" + newIngredients + "'>" +
            "<td>" +
                "<p>" +
                    "<input type='text' class='form-control' id='nameInput_" + newIngredients + "'>" +
                "</p>" +
            "</td>" +
            "<td>" +
                "<p>" +
                    "<input type='text' class='form-control' id='countInput_" + newIngredients + "'>" +
                "</p>" +
            "</td>" +
            "<td>" +
                "<div class='dropdown'>" +
                    "<button class='btn btn-info dropdown-toggle' type='button' id='dropdownIngredient_" + newIngredients + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        "Einheit" +
                    "</button>" +
                    "<div class='dropdown-menu' id='dropdown-menu-ingredients_" + newIngredients + "'></div>" +
                "</div>" +
            "</td>" +
            "<td>" +
                "<p style='text-align: right' id='ingredientsRow_" + newIngredients + "_action'>" +
                    "<a id='ingredientsRow_" + newIngredients + "_deleteAction' onclick=deleteIngredient(" + newIngredients + ");><i class='far fa-trash-alt'></i></a>" +
                "</p>" +
            "</td>" +
        "</tr>");

    getIngredients(newIngredients);
    newIngredients--;
}

function updateRecipe() {
    // TODO - gather information and save dish
    // TODO - some logic to now save empty ingredients / units
    console.log("TODO");
}