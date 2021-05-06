"use strict";

class DishHandler {

    constructor(dbHandler) {
        console.log('DishHandler initialized');
        this.dbHandler = dbHandler;
    }

    getLatestDishes = async () => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT * FROM dish ORDER BY creation_date DESC LIMIT 10"});
        } catch (e) {
            return "Error loading latest dishes" + e;
        }
        return res;
    };

    getDish = async (dish) => {
        let resDish;
        let resIngredients;
        try {
            resDish = await this.dbHandler.query({
                sql: "SELECT " +
                    "dish.id,\n" +
                    "dish.name,\n" +
                    "duration,\n" +
                    "short_description,\n" +
                    "dish.image_name, preparation,\n" +
                    "creation_date,\n" +
                    "creator,\n" +
                    "dish.category as category_id,\n" +
                    "cc.name as category_name,\n" +
                    "subcategory as subcategory_id,\n" +
                    "cs.subname as subcategory\n" +
                    "FROM dish\n" +
                    "JOIN category_category as cc on dish.category = cc.id\n" +
                    "JOIN category_subcategory cs on dish.subcategory = cs.id\n" +
                    "WHERE dish.id = ?"
            }, dish);

            resIngredients = await this.dbHandler.query({sql: "SELECT dish_ingredients.id, count, cu.name as unit_name, cu.short_name, i.name FROM dish_ingredients JOIN ingredient i on dish_ingredients.ingredient_id = i.id JOIN category_unit cu on dish_ingredients.count_unit = cu.id WHERE dish_id = ?"}, dish);
        } catch (e) {
            console.log('Error loading dish ' + dish);
            console.log(e);
        }

        // check if dish is available & add ingredients to object
        if (resDish !== undefined && resDish[0] !== undefined) {
            resDish[0]['ingredients'] = resIngredients;
            return resDish[0];
        } else {
            return false;
        }
    };

    getDishes = async (user) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT * FROM dish WHERE creator = ?"}, user);
        } catch (e) {
            console.log('Error loading user dishes');
            console.log(e);
        }
        return res;
    };

    createDish = async (recipeName, duration, shortDescription, filename, description, category, subCategory, ingredients, user, categoryId, subCategoryId) => {
        let dishQuery;
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
            creator: user,
            category: categoryId,
            subcategory: subCategoryId
        };

        // TODO - move this logic to middleware
        // Do not create dish if one of these parameters can not be set
        if (user === undefined || categoryId === undefined || subCategoryId === undefined) {
                // Return destination URL - error page
                console.log('undefined');
                console.log(user);
                console.log(categoryId);
                console.log(subCategoryId);
                // TODO - return error as data
                return '/errors/notFoundError';
        } else {
            try {
                dishQuery = await this.dbHandler.query({sql: "INSERT INTO dish SET ?"}, records);
            } catch (e) {
                console.log('Error inserting new dish');
                console.log(e);
            }

            // Dish created - go on with ingredients
            let res = await this.createDishIngredients(ingredients, dishQuery.insertId, false);


            if (res) {
                // return destination URL
                return '/dish/' + dishQuery.insertId;
            } else {
                console.log('createDishIngredients fails');
                return '/errors/notFoundError';
            }
        }
    };

    updateDish = async (recipeName, duration, shortDescription, filename, description, category, subCategory, ingredients, dishId, user, categoryId, subCategoryId) => {
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
                creator: user,
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
                creator: user,
                category: categoryId,
                subcategory: subCategoryId
            }
        }

        try {
            let updateQuery = await this.dbHandler.query({sql: "UPDATE dish SET ? WHERE id = ?"}, [records, dishId]);
        } catch (e) {
            console.log('Error inserting new dish');
            console.log(e);
        }

        // Dish created - go on with ingredients and return status
        return await this.createDishIngredients(ingredients, dishId, true);
    };

    deleteDish = async (user, dishId) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT creator, image_name FROM dish WHERE id = ?"}, dishId);
        } catch (e) {
            console.log('Error deleting dish');
            console.log(e);
        }
        if (res[0].creator === user) {
            try {
                await this.dbHandler.query({sql: "DELETE FROM dish_ingredients WHERE dish_id = ?"}, dishId);
                await this.dbHandler.query({sql: "DELETE FROM dish WHERE id = ?"}, dishId);
            } catch (e) {
                console.log('Error deleting dish');
                console.log(e);
                return false;
            }
        } else {
            return false;
        }
        return res[0].image_name;
    };

    createDishIngredients = async (ingredients, dishId, clean) => {
        // if update is set - clear the db to not overflow
        if (clean) {
            let cleanRes = await this.removeDishIngredients(dishId);
        }

        let ingredientInDb;
        // Search for each ingredient and insert into DB if needed
        for (let i = 0; i < ingredients.length; i++) {
            try {
                // Check if ingredient is already available in DB
                ingredientInDb = await this.isIngredientInDb(ingredients[i]["Name"]);
            } catch (e) {
                console.log('Error checking if ingredient is already in DB');
                console.log(e);
                return false;
            }
            // If ingredient is not in DB - create new
            if (ingredientInDb === undefined) {
                try {
                    ingredientInDb = await this.createIngredient(ingredients[i]["Name"]);
                } catch (e) {
                    console.log('Error creating new Ingredient');
                    console.log(e);
                    return false;
                }
            }

            //console.log("current Ingredient ID is: " + ingredientInDb);

            // Clear up ingredient count if it contains letters - only allow 0-9-,-.
            ingredients[i]["Menge"] = ingredients[i]["Menge"].replace(/[^0-9.,\/-]/g, "");

            // Insert current ingredient in DB
            try {
                let currentDishIngredient = {
                    count: ingredients[i]["Menge"],
                    dish_id: dishId,
                    ingredient_id: ingredientInDb,
                    count_unit: ingredients[i]["Einheit"]
                };
                await this.createDishIngredient(currentDishIngredient);
            } catch (e) {
                console.log('Error inserting dish ingredient');
                console.log(e);
                return false;
            }
        }
        return true;
    };

    removeDishIngredients = async (dishId) => {
        try {
            return await this.dbHandler.query({sql: "DELETE FROM dish_ingredients WHERE dish_id = ?"}, dishId)
        } catch (e) {
            console.log('Error removing Dish ingredients');
            console.log(e);
            return false;
        }
    };


    getUnits = async () => {
        try {
            return await this.dbHandler.query({sql: "SELECT id, name, short_name FROM category_unit"});
        } catch (e) {
            return "Error loading Units" + e;
        }
    };

    createIngredient = async (name) => {
        let res;
        let record = {name: name};
        try {
            res = await this.dbHandler.query({sql: "INSERT INTO ingredient SET ?"}, record);
        } catch (e) {
            console.log('Error inserting new Ingredient');
            console.log(e);
        }
        return res.insertId;
    };

    createDishIngredient = async (dishIngredient) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "INSERT INTO dish_ingredients SET ?"}, dishIngredient);
        } catch (e) {
            console.log('Error inserting new DishIngredient');
            console.log(e);
        }
        return res.insertId;
    };

    getIngredients = async (dishId) => {
        try {
            let data = {};
            let res = await this.dbHandler.query({sql: "SELECT ing.name, di.count, di.count_unit FROM dish_ingredients AS di JOIN ingredient AS ing ON di.ingredient_id = ing.id WHERE di.dish_id = ?"}, dishId);
            let units = await this.getUnits();
            data['ingredients'] = res;
            data['units'] = units;
            return data;
        } catch (e) {
            return "Error loading Ingredients from dish" + e;
        }
    };

    isIngredientInDb = async (name) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT id FROM ingredient WHERE name =?"}, name);
        } catch (e) {
            console.log('Error searching ingredient');
            console.log(e);
        }

        if (res[0] === undefined) {
            return undefined;
        } else {
            return res[0].id;
        }
    };

    isUserDishOwner = async (user, dishId) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT creator FROM dish WHERE id = ?"}, dishId);
        } catch (e) {
            console.log('Error getting User dish permissions');
            console.log(e);
        }
        return res[0].creator === user;
    };
}

module.exports = DishHandler;