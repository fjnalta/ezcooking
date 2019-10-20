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

/**
 * Load Units (Metric) from DB
 */
function createIngredientsTable() {
    $.ajax({
        type: 'GET',
        url: '/ingredients',
        success: function (msg) {
            createGrid(msg);
        },
        dataType: "json"
    });
}

/**
 * Create JsGrid with loaded Metrics. The Grid is empty in the beginning.
 * It is used to manage all ingredients dynamically.
 * @param units are the loaded Metrics
 */
function createGrid(units) {
    $("#jsGrid").jsGrid({
        width: "100%",
        height: "300px",
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        data : [],
        fields: [
            { name: "Name", type: "text", width: 200, validate: "required" },
            { name: "Menge", type: "text", width: 60, validate: "required" },
            { name: "Einheit", type: "select", items: units, valueField: "id", textField: "name" },
            { type: "control" }
        ]
    });
}

/**
 * Send the created Recipe to the Server
 */
function sendRecipe() {
    // create FormData so Node.js can handle it
    let formData = new FormData();

    console.log(JSON.stringify($("#jsGrid").jsGrid("option", "data")));

    // gather recipe information
    formData.append('name',$("#dishInputName").val());
    formData.append('shortDescription', $("#dishInputShortDescription").val());
    formData.append('duration', $("#dishInputDuration").val());
    formData.append('category', $("#dropdownCategory").text());
    formData.append('subCategory', $("#dropdownSubCategory").text());
    formData.append('ingredients', JSON.stringify($("#jsGrid").jsGrid("option", "data")));
    formData.append('description', $("#dishInputDescription").val());
    formData.append('data',$("#dishUploadImage")[0].files[0]);

    // Ajax call to backend
    $.ajax({
        url: '/dish',
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        type: 'POST',
        success: function(data){
            // Redirect frontend
            window.location.replace(data);
        }
    });

    // Disable button to prevent double postings
    $("#buttonSendRecipe").prop('disabled', true);
}