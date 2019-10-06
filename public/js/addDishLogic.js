function createIngredientsTable() {
    // First load Units from DB
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/ingredients/amount',
        success: function (msg) {
            let units = msg;
            createGrid(units);
        },
        dataType: "json"
    });
}

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

function sendRecipe() {
    console.log(ingredients);
}