const config = require('../config');
const mysql = require('promise-mysql');

let pool;
// configure mysql connection asynchronously
const init = async () => {
    pool = await mysql.createPool(config.mysql);
    await pool.getConnection((err, connection) => {
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
};

// Initialize
init();

// Session Management
// ==================
const isUserInDb = async (userName, eMail) => {
    try {
        let res = await pool.query({sql: "SELECT * FROM users WHERE name = ?"}, userName);
        return res.length > 0 && userName === res[0].name && eMail === res[0].email;
    } catch (e) {
        return "Error getting User" + e;
    }
};

const isEmailInDb = async (name) => {
    try {
        let res = await pool.query({sql: "SELECT * FROM users WHERE email = ?"}, name);
        if (res.length > 0) {
            return res;
        } else {
            return false;
        }
    } catch (e) {
        return "Error loading User" + e;
    }
};

// Search
// ======
// TODO - implement this
/*async function getIndices() {
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
}*/

// User
// ====
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

async function getUserId(username) {
    try {
        let res = await pool.query({ sql: "SELECT id FROM users WHERE name = ?" }, username);
        return res[0].id;
    } catch (e) {
        return "Error loading userId" + e;
    }
}

async function getUserInformation(id) {
    try {
        let data = {};
        let user = await pool.query({ sql: "SELECT name from users WHERE id = ?" }, id);
        let dishes = await getDishes(id);
        data['user'] = user;
        data['dishes'] = dishes;
        return data;
    } catch (e) {
        console.log('Error loading user information');
        console.log(e);
        return false;
    }
}

async function getLatestDishes() {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM dish ORDER BY creation_date DESC LIMIT 10"});
    } catch (e) {
        return "Error loading latest dishes" + e;
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

async function getDishes(id) {
    let res;
    try {
        res = await pool.query({sql: "SELECT * FROM dish WHERE creator_id = ?"}, id);
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
    try {
        return await pool.query({sql: "SELECT cc.id as cat_id, cc.name as catname, cs.id as sub_id, cs.subname  FROM category_subcategory as cs JOIN category_category cc on cs.category = cc.id"});
    } catch (e) {
        return "Error loading categories" + e;
    }
}

async function getCategoryOverview() {
    let categoriesCount;
    let subCategories;

    try {
        categoriesCount = await pool.query({sql: "SELECT category, cc.name, COUNT(*) AS 'count' FROM dish JOIN category_category cc on dish.category = cc.id GROUP BY category"});
        subCategories = await pool.query({sql: "SELECT category_subcategory.id, category_subcategory.subname, cc.id as categoryId, cc.name as category, IFNULL(subcatcount.count, 0) AS count FROM category_subcategory LEFT JOIN category_category cc on category_subcategory.category = cc.id LEFT JOIN (SELECT subcategory, COUNT(*) AS 'count' FROM dish GROUP BY subcategory) as subcatcount on category_subcategory.id = subcatcount.subcategory"});
    } catch (e) {
        return "Error loading categories" + e;
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
    try {
        return await pool.query({sql: "SELECT category_subcategory.id, subname, category, cc.name FROM category_subcategory JOIN category_category cc on category_subcategory.category = cc.id WHERE category = ?"}, category);
    } catch (e) {
        return "Error loading subCategories" + e;
    }
}

async function getUnits() {
    try {
        return await pool.query({sql: "SELECT id, name, short_name FROM category_unit"});
    } catch (e) {
        return "Error loading Units" + e;
    }
}

async function getIngredients(dishId) {
    try {
        let data = {};
        let res = await pool.query({sql: "SELECT ing.name, di.count, di.count_unit FROM dish_ingredients AS di JOIN ingredient AS ing ON di.ingredient_id = ing.id WHERE di.dish_id = ?"}, dishId);
        let units = await getUnits();
        data['ingredients'] = res;
        data['units'] = units;
        return data;
    } catch (e) {
        return "Error loading Ingredients from dish" + e;
    }
}

async function getDishesFromSubCategory(subCategory) {
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
        return res[0].id;
    } catch (e) {
        console.log('Error loading subCategory');
        console.log(e);
    }
}

async function getUnitId(name) {
    let res;
    try {
        res = await pool.query({sql: "SELECT id FROM category_unit WHERE name = ?"}, name);
        return res[0].id;
    } catch (e) {
        console.log('Error loading unitId');
        console.log(e);
    }
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
    return res[0].creator_id === userId;
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
    return res.insertId;
}

async function createDish(recipeName, duration, shortDescription, filename, description, user, category, subCategory, ingredients) {
    let dishQuery;

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
            dishQuery = await pool.query({sql: "INSERT INTO dish SET ?" }, records);
        } catch (e) {
            console.log('Error inserting new dish');
            console.log(e);
        }

        // Dish created - go on with ingredients
        let res = await createDishIngredients(ingredients, dishQuery.insertId, false);


        if (res) {
            // return destination URL
            return '/dish/' + dishQuery.insertId;
        } else {
            return '/error';
        }
    }
}

async function updateDish(recipeName, duration, shortDescription, filename, description, user, category, subCategory, ingredients, dishId) {
    // Get async data from DB
    let userId = await getUserId(user);
    let categoryId = await getCategoryId(category);
    let subCategoryId = await getSubCategoryId(subCategory);

    let date = Date.now();

    let records;
    // Prepare data according to DB scheme and handle image upload
    if (filename != null) {
        records = {
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
    } else {
        records = {
            name: recipeName,
            duration: duration,
            short_description: shortDescription,
            preparation: description,
            creation_date: date,
            creator_id: userId,
            category: categoryId,
            subcategory: subCategoryId
        }
    }

    try {
        let updateQuery = await pool.query({sql: "UPDATE dish SET ? WHERE id = ?" }, [records , dishId]);
    } catch (e) {
        console.log('Error inserting new dish');
        console.log(e);
    }

    // Dish created - go on with ingredients and return status
    return await createDishIngredients(ingredients, dishId, true);
}

async function createDishIngredients(ingredients, dishId, clean) {
    // if update is set - clear the db to not overflow
    if (clean) {
        let cleanRes = await removeDishIngredients(dishId);
    }

    let ingredientInDb;
    // Search for each ingredient and insert into DB if needed
    for (let i = 0; i < ingredients.length; i++) {
        try {
            // Check if ingredient is already available in DB
            ingredientInDb = await isIngredientInDb(ingredients[i]["Name"]);
        } catch (e) {
            console.log('Error checking if ingredient is already in DB');
            console.log(e);
            return false;
        }
        // If ingredient is not in DB - create new
        if (ingredientInDb === undefined) {
            try {
                ingredientInDb = await createIngredient(ingredients[i]["Name"]);
            } catch (e) {
                console.log('Error creating new Ingredient');
                console.log(e);
                return false;
            }
        }

        //console.log("current Ingredient ID is: " + ingredientInDb);

        // Clear up ingredient count if it contains letters - only allow 0-9-,-.
        ingredients[i]["Menge"] = ingredients[i]["Menge"].replace(/[^0-9.,]/g, "");
//        ingredients[i]["Menge"] = ingredients[i]["Menge"].replace(/,/g,".");

        // Insert current ingredient in DB
        try {
            let currentDishIngredient = {
                count: ingredients[i]["Menge"],
                dish_id: dishId,
                ingredient_id: ingredientInDb,
                count_unit: ingredients[i]["Einheit"]
            };
            await createDishIngredient(currentDishIngredient);
        } catch (e) {
            console.log('Error inserting dish ingredient');
            console.log(e);
            return false;
        }
    }
    return true;
}

async function removeDishIngredients(dishId) {
    try {
        return await pool.query({ sql: "DELETE FROM dish_ingredients WHERE dish_id = ?" }, dishId)
    } catch (e) {
        console.log('Error removing Dish ingredients');
        console.log(e);
        return false;
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
        try {
            await pool.query({sql: "DELETE FROM dish_ingredients WHERE dish_id = ?"}, dishId);
            await pool.query({sql: "DELETE FROM dish WHERE id = ?"}, dishId);
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
async function createUser(name, email, password) {
    // Prepare data according to DB scheme
    let records = {
        name: name,
        email: email,
        password: password,
        role: 'U'
    };

    try {
        let res = await pool.query({ sql: "INSERT INTO users SET ?" }, records);
        return true;
    } catch (e) {
        console.log('Error creating user');
        console.log(e);
        return false;
    }
}

async function changeUsername(userId, newUsername) {
    try {
        return await pool.query({sql: "UPDATE users SET ? WHERE id = ?"}, [{name: newUsername}, userId]);
    } catch (e) {
        console.log('Error change username');
        console.log(e);
        return false;
    }
}

async function changeEmail(userId, newEmail) {
    try {
        return await pool.query({sql: "UPDATE users SET ? WHERE id = ?"}, [{email: newEmail}, userId]);
    } catch (e) {
        console.log('Error change username');
        console.log(e);
        return false;
    }
}

async function changePassword(userId, newPassword) {
    try {
        return await pool.query({sql: "UPDATE users SET ? WHERE id = ?"}, [{password: newPassword}, userId]);
    } catch (e) {
        console.log('Error change password');
        console.log(e);
        return false;
    }
}

async function deleteAccount(userId) {
    try {
        let qry = await pool.query({sql: "UPDATE dish SET ? WHERE creator_id = ?"}, [{creator_id: 1}, userId]);
        return await pool.query({sql: "DELETE FROM users WHERE id = ?"}, userId);
    } catch (e) {
        console.log('Error delete user');
        console.log(e);
        return false;
    }
}


// Exports
// =======
module.exports = {
    createDish,
    getLatestDishes,
    getDish,
    getCategories,
    getCategoryOverview,
    getSubCategories,
    getDishesFromSubCategory,
    getIndices,
    isUserInDb,
    getCategoryNames,
    getSubCategoryNames,
    isEmailInDb,
    getDishes,
    deleteDish,
    hasUserDishPermissions,
    getUser,
    changeUsername,
    changeEmail,
    changePassword,
    deleteAccount,
    getUnits,
    getIngredients,
    updateDish,
    createUser,
    getUserInformation
};