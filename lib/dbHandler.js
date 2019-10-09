const config = require('../config');
const util = require('util');
const mysql = require('mysql');

// connect mysql
const pool = mysql.createPool(config.mysql);

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (connection) {
        connection.release();
    }
    return;
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

async function getUserId(username) {
    let res;
    try {
        res = await pool.query({ sql: "SELECT id FROM users WHERE name = ?"}, username);
    } catch (e) {
        console.log('Error loading userId');
    }
    return res[0].id;
}

async function getUnitId(unit) {
    let res;
    try {
        res = await pool.query({ sql: "SELECT id FROM category_unit WHERE name = ?"}, unit);
    } catch (e) {
        console.log('Error loading unitId');
    }

    console.log(unit);
    console.log(res);
    return res[0].id;
}

async function getCategoryId(category) {
    let res;
    try {
        res = await pool.query({ sql: "SELECT id FROM category_category WHERE name = ?"}, category);
    } catch (e) {
        console.log('Error loading category');
    }
    return res[0].id;
}

async function getSubCategoryId(subCategory) {
    let res;
    try {
        res = await pool.query({ sql: "SELECT id FROM category_subcategory WHERE subname = ?"}, subCategory);
    } catch (e) {
        console.log(e);
        console.log('Error loading subCategory');
    }
    return res[0].id;
}

async function isIngredientInDb(name) {
    let res;
    try {
        res = await pool.query({ sql: "SELECT id FROM ingredient WHERE name =?"}, name);
    } catch (e) {
        console.log(e);
    }

    if (res[0] == undefined) {
        return undefined;
    } else {
        return res[0].id;
    }
}

async function createIngredient(name) {
    let res;
    let record = { name : name };

    try {
        res = await pool.query({ sql: "INSERT INTO ingredient SET ?" }, record);
    } catch (e) {
        console.log('Error inserting new Ingredient');
    }
    return res.insertId;
}

async function createDishIngredient(dishIngredient) {
    console.log(dishIngredient);
    let res;
    try {
        res = await pool.query({ sql: "INSERT INTO dish_ingredients SET ?" }, dishIngredient);
    } catch (e) {
        console.log(e);
        console.log('Error inserting new DishIngredient');
    }
    console.log(res);
    return res.insertId;
}

async function createDish(recipeName, duration, shortDescription, filename, description, user, category, subCategory, ingredients) {
    let dishQuery;
    let ingredientInDb;

    // Get async data from DB
    let userId = await getUserId(user);
    let categoryId = await getCategoryId(category);
    let subCategoryId = await getSubCategoryId(subCategory);

    let date = Date.now();

    // Prepare data according to DB scheme
    // id, name, duration, short_description, image_name, preparation, creation_date, creator_id, category, subcategory
    let records = {
        name : recipeName,
        duration: duration,
        short_description: shortDescription,
        image_name: filename,
        preparation: duration,
        creation_date: date,
        creator_id: userId,
        category: categoryId,
        subcategory: subCategoryId
    };

    // Do not create dish if one of these parameters can not be set
    if(userId == undefined || categoryId == undefined || subCategoryId == undefined) {
        return '/error';
    } else {
        try {
            dishQuery = await pool.query({ sql: "INSERT INTO dish SET ?" }, records);
        } catch (e) {
            console.log(e);
        }
        // Dish created - go on with ingredients
        // DishId saved in response - userQuery.insertId
        console.log(dishQuery.insertId);
        
        // Foreach ingredient search and insert into DB if needed
        for(let i=0;i<ingredients.length;i++) {
            try {
                // Check if ingredient is already available in DB
                ingredientInDb = await isIngredientInDb(ingredients[i]["Name"]);
            } catch (e) {
                console.log(e);
            }
            // If ingredient is not in DB - create new
            if (ingredientInDb == undefined) {
                try {
                    ingredientInDb = await createIngredient(ingredients[i]["Name"]);
                } catch (e) {
                    console.log(e);
                }
            }
            console.log("Ingredient ID is: " + ingredientInDb);

            // Insert dish_ingredients in DB
            try {
                let currentDishIngredient = {
                    count: ingredients[i]["Menge"],
                    dish_id: dishQuery.insertId,
                    ingredient_id: ingredientInDb,
                    count_unit: ingredients[i]["Einheit"]
                };

                await createDishIngredient(currentDishIngredient);
                //let dishIngredientsQuery = await createDishIngredient(currentDishIngredient);
            } catch (e) {
                console.log(e);
                console.log('Error inserting dish ingredient');
            }

        }
        return '/dish/' + dishQuery.insertId;
    }
}

module.exports = {
    pool,
    getUserId,
    createDish
};