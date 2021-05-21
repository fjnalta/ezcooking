"use strict";

class DishHandler {

    constructor(dbHandler) {
        console.log('DishHandler initialized');
        this.dbHandler = dbHandler;
    }

    getAllDishes = async () => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT id, name, short_description FROM dish"})
        } catch (e) {
            console.log('Error loading all dishes');
        }
        return res;
    };

    getLatestDishes = async () => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT * FROM dish ORDER BY creation_date DESC LIMIT 9"});
        } catch (e) {
            return "Error loading latest dishes" + e;
        }
        return res;
    };


    getDishesFromCategory = async (category) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT\n" +
                    "dish.id,\n" +
                    "dish.name,\n" +
                    "dish.short_description,\n" +
                    "dish.image_name\n" +
                    "FROM dish\n" +
                    "JOIN dish_category dc on dish.id = dc.dish_id\n" +
                    "WHERE dc.category_id = ?"}, category);
        } catch (e) {
            console.log('Error loading dishes from category');
        }
        return res;
    };

    getDishesFromSubCategory = async (subCategory) => {
        let res = {};
        try {
            let category = await this.dbHandler.query({
                sql: "SELECT subname as subcategory,\n" +
                    "cc.name as category\n" +
                    "FROM category_subcategory\n" +
                    "JOIN category_category cc on category_subcategory.category = cc.id\n" +
                    "WHERE category_subcategory.id = ?" }, subCategory);

            res.category = category;

            let dish = await this.dbHandler.query({
                sql:
                    "SELECT dish.id, " +
                    "dish.name, " +
                    "dish.duration, " +
                    "dish.short_description, " +
                    "dish.image_name, " +
                    "cs.subname, " +
                    "cc.name as 'catname'\n" +
                    "FROM dish\n" +
                    "  JOIN dish_category dc on dish.id = dc.dish_id\n" +
                    "  JOIN category_subcategory cs on dc.subcategory_id = cs.id\n" +
                    "  JOIN category_category cc on dc.category_id = cc.id\n" +
                    "WHERE dc.subcategory_id = ?" }, subCategory);

            res.dish = dish;
        } catch (e) {
            console.log('Error loading dishes');
            console.log(e);
        }
        return res;
    };

    getDish = async (dish) => {
        let resDish;
        let resIngredients;
        let resCategories;
        try {
            resDish = await this.dbHandler.query({
                sql: "SELECT\n" +
                    "dish.id,\n" +
                    "dish.name,\n" +
                    "duration,\n" +
                    "short_description,\n" +
                    "dish.image_name,\n" +
                    "preparation,\n" +
                    "creation_date,\n" +
                    "creator\n" +
                    "FROM dish\n" +
                    "WHERE dish.id = ?"}, dish);

            resCategories = await this.dbHandler.query({
                sql: "SELECT\n" +
                    "category_id,\n" +
                    "subcategory_id,\n" +
                    "dish_id,\n" +
                    "cc.name,\n" +
                    "cs.subname\n" +
                    "FROM dish_category\n" +
                    "JOIN category_category as cc on dish_category.category_id = cc.id\n" +
                    "JOIN category_subcategory as cs on dish_category.subcategory_id = cs.id\n" +
                    "WHERE dish_id = ?" }, dish);

            resIngredients = await this.dbHandler.query({
                sql: "SELECT dish_ingredients.id,\n" +
                    "count,\n" +
                    "cu.name as unit_name,\n" +
                    "cu.short_name,\n" +
                    "i.name\n" +
                    "FROM dish_ingredients\n" +
                    "JOIN ingredient i on dish_ingredients.ingredient_id = i.id\n" +
                    "JOIN category_unit cu on dish_ingredients.count_unit = cu.id\n" +
                    "WHERE dish_id = ?"}, dish);

        } catch (e) {
            console.log('Error loading dish ' + dish);
            console.log(e);
        }
        // check if dish is available and add ingredients and categories to object
        if (resDish !== undefined && resDish[0] !== undefined) {
            resDish[0]['ingredients'] = resIngredients;
            resDish[0]['categories'] = resCategories;
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

    createDish = async (recipeName, duration, shortDescription, filename, description, categories, ingredients, user) => {
        let dishQuery;
        let date = Date.now();
        // Prepare data according to DB scheme
        let records = {
            name: recipeName,
            duration: duration,
            short_description: shortDescription,
            image_name: filename,
            preparation: description,
            creation_date: date,
            creator: user
        };
        try {
            dishQuery = await this.dbHandler.query({sql: "INSERT INTO dish SET ?"}, records);
        } catch (e) {
            console.log('Error inserting new dish');
            console.log(e);
        }
        // dish created - insert categories
        let cats = await this.createDishCategories(categories, dishQuery.insertId, false);
        // dish created - insert ingredients
        let res = await this.createDishIngredients(ingredients, dishQuery.insertId, false);
        if (res) {


            // return destination URL
            return '/dish/' + dishQuery.insertId;
        } else {
            console.log('createDishIngredients failed');
            return '/errors/notFoundError';
        }
    };

    updateDish = async (recipeName, duration, shortDescription, filename, description, categories, ingredients, dishId, user) => {
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
                creator: user
            };
        } else {
            records = {
                name: recipeName,
                duration: duration,
                short_description: shortDescription,
                preparation: description,
                creation_date: date,
                creator: user
            }
        }
        try {
            let updateQuery = await this.dbHandler.query({sql: "UPDATE dish SET ? WHERE id = ?"}, [records, dishId]);
        } catch (e) {
            console.log('Error inserting new dish');
            console.log(e);
        }
        // dish created - reset categories
        let cats = await this.createDishCategories(categories, dishId, true);
        // dish created - reset ingredients
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
                await this.dbHandler.query({sql: "DELETE FROM dish_category WHERE dish_id = ?"}, dishId);
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


    createDishCategories = async (categories, dishId, clean) => {
        // if update is set - clear available DB entries
        if(clean) {
            await this.removeDishCategories(dishId);
        }
        let res;
        for(let i = 0; i < categories.length; i ++) {
            let record = {
                category_id: categories[i].category_id,
                subcategory_id : categories[i].subcategory_id,
                dish_id : dishId,
            };
            try {
                res = await this.dbHandler.query({sql: "INSERT INTO dish_category SET ?"}, record);
            } catch (e) {
                console.log('createDishCategories failed');
                return false;
            }
        }
    };

    createDishIngredients = async (ingredients, dishId, clean) => {
        // if update is set - clear available DB entries
        if (clean) {
            await this.removeDishIngredients(dishId);
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

    removeDishCategories = async (dishId) => {
        try {
            return await this.dbHandler.query({sql: "DELETE FROM dish_category WHERE dish_id = ?"}, dishId)
        } catch (e) {
            console.log('Error removing dish categories');
            console.log(e);
            return false;
        }
    };

    removeDishIngredients = async (dishId) => {
        try {
            return await this.dbHandler.query({sql: "DELETE FROM dish_ingredients WHERE dish_id = ?"}, dishId)
        } catch (e) {
            console.log('Error removing dish ingredients');
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