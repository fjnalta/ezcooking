const config = require('../config');
const util = require('util');
const mysql = require('mysql');
const pool = mysql.createPool(config.mysql);

// Check for common exceptions
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection refused.');
        } else {
            console.error(err);
        }
    }
    if (connection) {
        connection.release();
    }
});

// Promisify node-mysql for Node.js async/await.
pool.query = util.promisify(pool.query);

// Session Management
async function isUserInDb(userName, eMail) {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM users WHERE name = ?"}, userName);
    } catch (e) {
        console.log('Error getting User');
        return false;
    }
    if (res.length > 0 && userName == res[0].name && eMail == res[0].email) {
        return true;
    } else {
        return false;
    }
}

async function isEmailInDb(name) {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM users WHERE email = ?"}, name);
    } catch (e) {
        console.log('Error loading User');
        console.log(e);
    }
    if (res.length > 0) {
        return res;
    } else {
        return false;
    }
}

// Search
async function getIndices() {
    let res = {};

    res['dishes'] = [];
    res['categories'] = [];
    res['subcategories'] = [];

    let dish;
    let category;
    let subcategory;

    try {
        dish = await pool.query({sql: "SELECT name, id FROM dish"});
        category = await pool.query({sql: "SELECT name, id FROM category_category"});
        subcategory = await pool.query({sql: "SELECT subname as 'name', id FROM category_subcategory"});
    } catch (e) {
        console.log('Error loading indices');
        console.log(e);
    }

    res['dishes'].push(dish);
    res['categories'].push(category);
    res['subcategories'].push(subcategory);

    // for(let i=0;i<dish.length;i++) {
    //     res['dishes'].push(dish[i].name);
    // }
    // for(let i=0;i<category.length;i++) {
    //     res['categories'].push(category[i].name);
    // }
    // for(let i=0;i<subcategory.length;i++) {
    //     res['subcategories'].push(subcategory[i].name);
    // }

    console.log(res);


    return res;
}

// End Search


async function getUserId(username) {
    let res;
    try {
        res = await pool.query({sql: "SELECT id FROM users WHERE name = ?"}, username);
    } catch (e) {
        console.log('Error loading userId');
    }
    return res[0].id;
}

async function getLatestDishes() {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM dish ORDER BY creation_date DESC LIMIT 10"});
    } catch (e) {
        console.log('Error loading latest dishes');
        console.log(e);
    }
    return res;
}

async function getDish(dish) {
    let resDish;
    let resIngredients;
    try {
        resDish = await pool.query({
            sql: "SELECT " +
                "dish.id,\n" +
                "dish.name,\n" +
                "duration,\n" +
                "short_description,\n" +
                "image_name, preparation,\n" +
                "creation_date,\n" +
                "creator_id,\n" +
                "us.name as creator,\n" +
                "dish.category as category_id,\n" +
                "cc.name as category_name,\n" +
                "subcategory as subcategory_id,\n" +
                "cs.subname as subcategory\n" +
                "FROM dish\n" +
                "JOIN category_category as cc on dish.category = cc.id\n" +
                "JOIN category_subcategory cs on dish.subcategory = cs.id\n" +
                "JOIN users as us on dish.creator_id = us.id\n" +
                "WHERE dish.id = ?"
        }, dish);

        resIngredients = await pool.query({sql: "SELECT dish_ingredients.id, count, cu.name as unit_name, cu.short_name, i.name FROM dish_ingredients JOIN ingredient i on dish_ingredients.ingredient_id = i.id JOIN category_unit cu on dish_ingredients.count_unit = cu.id WHERE dish_id = ?"}, dish);
    } catch (e) {
        console.log('Error loading dish ' + dish);
        console.log(e);
    }

    // add ingredients to object
    resDish[0]['ingredients'] = resIngredients;
    return resDish[0];
}

async function getMyDishes(user) {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM dish WHERE creator_id = ?"}, user);
    } catch (e) {
        console.log('Error loading user dishes');
        console.log(e);
    }
    return res;
}

async function getCategoryNames() {
    let res;
    let data = [];
    try {
        res = await pool.query({sql: "SELECT * FROM category_category"});
    } catch (e) {
        console.log('Error loading category names');
        console.log(e);
    }
    for (let i = 0; i < res.length; i++) {
        data.push({id: res[i].id, name: res[i].name});
    }
    return data;
}

async function getSubCategoryNames(category) {
    let res;
    let data = [];
    try {
        res = await pool.query({sql: "SELECT * FROM category_subcategory WHERE category = ?"}, category);
    } catch (e) {
        console.log('Error loading subCategory names');
        console.log(e);
    }
    for (let i = 0; i < res.length; i++) {
        data.push({id: res[i].id, name: res[i].subname, category: res[i].category});
    }
    return data;
}

async function getCategories() {
    let categoriesCount;
    let subCategories;

    try {
        categoriesCount = await pool.query({sql: "SELECT category, cc.name, COUNT(*) AS 'count' FROM dish JOIN category_category cc on dish.category = cc.id GROUP BY category"});
        subCategories = await pool.query({sql: "SELECT category_subcategory.id, category_subcategory.subname, cc.id as categoryId, cc.name as category, IFNULL(subcatcount.count, 0) AS count FROM category_subcategory LEFT JOIN category_category cc on category_subcategory.category = cc.id LEFT JOIN (SELECT subcategory, COUNT(*) AS 'count' FROM dish GROUP BY subcategory) as subcatcount on category_subcategory.id = subcatcount.subcategory"});

    } catch (e) {
        console.log('Error loading categories');
        console.log(e);
    }

    let res = {};
    res['subCategories'] = [];
    res['categories'] = [];

    // clean up format
    for (let i = 0; i < categoriesCount.length; i++) {
        res['categories'].push({
            id: categoriesCount[i].category,
            category: categoriesCount[i].name,
            count: categoriesCount[i].count
        });
    }

    for (let i = 0; i < subCategories.length; i++) {
        res['subCategories'].push({
            id: subCategories[i].id,
            subname: subCategories[i].subname,
            categoryId: subCategories[i].categoryId,
            category: subCategories[i].category,
            count: subCategories[i].count
        });
    }
    return res;
}

async function getSubCategories(category) {
    let res;
    try {
        res = await pool.query({sql: "SELECT category_subcategory.id, subname, category, cc.name FROM category_subcategory JOIN category_category cc on category_subcategory.category = cc.id WHERE category = ?"}, category);
    } catch (e) {
        console.log('Error loading subCategories');
        console.log(e);
    }
    return res;
}

async function getDishes(subCategory) {
    // TODO - this is dirty
    // returns undefined if no recipe available
    // fix this and always provide category and subcategory name
    let res;
    try {
        res = await pool.query({sql: "SELECT dish.id, dish.name, dish.duration, dish.short_description, dish.image_name, cs.subname, cc.name as 'catname' FROM dish JOIN category_subcategory cs on dish.subcategory = cs.id JOIN category_category cc on dish.category = cc.id WHERE subcategory = ?"}, subCategory);
    } catch (e) {
        console.log('Error loading dishes');
        console.log(e);
    }
    return res;
}

async function getCategoryId(category) {
    let res;
    try {
        res = await pool.query({sql: "SELECT id FROM category_category WHERE name = ?"}, category);
    } catch (e) {
        console.log('Error loading category');
        console.log(e);
    }
    return res[0].id;
}

async function getSubCategoryId(subCategory) {
    let res;
    try {
        res = await pool.query({sql: "SELECT id FROM category_subcategory WHERE subname = ?"}, subCategory);
    } catch (e) {
        console.log('Error loading subCategory');
        console.log(e);
    }
    return res[0].id;
}

async function getIngredientNames() {
    let res;
    let data = [];
    try {
        res = await pool.query({sql: "SELECT * FROM category_unit WHERE unit = ?"}, 1);
    } catch (e) {
        console.log('Error loading ingredientNames');
        console.log(e);
    }

    for (myRes of res) {
        data.push({id: myRes.id, name: myRes.name, shortName: myRes.short_name});
    }
    return data;
}

async function getUser(id) {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM users WHERE id = ?"}, id);
    } catch (e) {
        console.log(e);
        console.log('Error getting User');
    }
    return res[0];
}

async function isIngredientInDb(name) {
    let res;
    try {
        res = await pool.query({sql: "SELECT id FROM ingredient WHERE name =?"}, name);
    } catch (e) {
        console.log('Error searching ingredient');
        console.log(e);
    }

    if (res[0] === undefined) {
        return undefined;
    } else {
        return res[0].id;
    }
}

async function hasUserDishPermissions(userId, dishId) {
    let res;
    try {
        res = await pool.query({sql: "SELECT creator_id FROM dish WHERE id = ?"}, dishId);
    } catch (e) {
        console.log('Error getting User dish permissions');
        console.log(e);
    }

    if (res[0].creator_id == userId) {
        return true;
    } else {
        return false;
    }
}

async function createIngredient(name) {
    let res;
    let record = {name: name};
    try {
        res = await pool.query({sql: "INSERT INTO ingredient SET ?"}, record);
    } catch (e) {
        console.log('Error inserting new Ingredient');
        console.log(e);
    }
    return res.insertId;
}

async function createDishIngredient(dishIngredient) {
    let res;
    try {
        res = await pool.query({sql: "INSERT INTO dish_ingredients SET ?"}, dishIngredient);
    } catch (e) {
        console.log('Error inserting new DishIngredient');
        console.log(e);
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
        name: recipeName,
        duration: duration,
        short_description: shortDescription,
        image_name: filename,
        preparation: description,
        creation_date: date,
        creator_id: userId,
        category: categoryId,
        subcategory: subCategoryId
    };

    // Do not create dish if one of these parameters can not be set
    if (userId === undefined || categoryId === undefined || subCategoryId === undefined) {
        // Return destination URL - error page
        return '/error';
    } else {
        try {
            dishQuery = await pool.query({sql: "INSERT INTO dish SET ?"}, records);
        } catch (e) {
            console.log('Error inserting new dish');
            console.log(e);
        }
        // Dish created - go on with ingredients
        // DishId saved in response - userQuery.insertId

        // Search for each ingredient and insert into DB if needed
        for (let i = 0; i < ingredients.length; i++) {
            try {
                // Check if ingredient is already available in DB
                ingredientInDb = await isIngredientInDb(ingredients[i]["Name"]);
            } catch (e) {
                console.log('Error checking if ingredient is already in DB');
                console.log(e);
            }
            // If ingredient is not in DB - create new
            if (ingredientInDb === undefined) {
                try {
                    ingredientInDb = await createIngredient(ingredients[i]["Name"]);
                } catch (e) {
                    console.log('Error creating new Ingredient');
                    console.log(e);
                }
            }
            console.log("current Ingredient ID is: " + ingredientInDb);

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
                console.log('Error inserting dish ingredient');
                console.log(e);
            }
        }
        // return destination URL
        return '/dish/' + dishQuery.insertId;
    }
}

async function deleteDish(userId, dishId) {
    let res;
    try {
        res = await pool.query({sql: "SELECT creator_id, image_name FROM dish WHERE id = ?"}, dishId);
    } catch (e) {
        console.log('Error deleting dish');
        console.log(e);
    }
    if (res[0].creator_id === userId) {
        let delDishIngredients;
        let delDish;
        try {
            delDishIngredients = await pool.query({sql: "DELETE FROM dish_ingredients WHERE dish_id = ?"}, dishId);
            delDish = await pool.query({sql: "DELETE FROM dish WHERE id = ?"}, dishId);
        } catch (e) {
            console.log('Error deleting dish');
            console.log(e);
            return false;
        }
    } else {
        return false;
    }
    return res[0].image_name;
}

// Settings Database Access
// ========================
async function changeUsername(userId, newUsername) {
    let res;
    try {
        res = await pool.query({sql: "UPDATE users SET name = ? WHERE id = ?" }, [newUsername, userId]);
    } catch (e) {
        console.log('Error change username');
        console.log(e);
        return false;
    }
    return res;
}

async function changeEmail(username, userId, newEmail, password) {

}

async function changePassword(username, userId, password, newPassword, newPassword2) {

}

async function deleteAccount(username, userId, email, password, newPassword2) {

}

// Exports
// -------
module.exports = {
    pool,
    createDish,
    getLatestDishes,
    getDish,
    getCategories,
    getSubCategories,
    getDishes,
    getIndices,
    isUserInDb,
    getIngredientNames,
    getCategoryNames,
    getSubCategoryNames,
    isEmailInDb,
    getMyDishes,
    deleteDish,
    hasUserDishPermissions,
    getUser,
    changeUsername,
    changeEmail,
    changePassword,
    deleteAccount
};