/**
 * Create JsGrid with loaded Metrics. The Grid is empty in the beginning.
 * It is used to manage all ingredients dynamically.
 * shared code between addDish and editDish
 * @param units loaded Metrics
 * @param data ingredients
 */
function createGrid(units, data) {
    $("#jsGrid").jsGrid({
        width: "100%",
        height: "300px",
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        data : data,
        fields: [
            { name: "Name", type: "text", width: 200, validate: "required" },
            { name: "Menge", type: "text", width: 60, validate: "required" },
            { name: "Einheit", type: "select", items: units, valueField: "id", textField: "name" },
            { type: "control" }
        ]
    });
}

/**
 * Load Units from Db to create empty IngredientsTable
 * used in addDish
 */
function createIngredientsTable() {
    $.ajax({
        type: 'GET',
        url: '/units',
        success: function (msg) {
            createGrid(msg, []);
        },
        dataType: "json"
    });
}

/**
 * Load Units from Db to create pre filled IngredientsTable
 * used in editDish
 * @param id current dish id
 */
async function createFilledIngredientsTable(id) {
    $.ajax({
        type: 'GET',
        url: '/ingredients/' + id,
        success: function (msg) {
            let ingredients = [];
            for(let i=0;i<msg.ingredients.length;i++) {
                ingredients.push({ Name: msg.ingredients[i].name, Menge: msg.ingredients[i].count, Einheit: msg.ingredients[i].count_unit });
            }
            createGrid(msg.units, ingredients);
        },
        dataType: "json"
    });
}