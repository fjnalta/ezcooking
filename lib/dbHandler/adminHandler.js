"use strict";

class AdminHandler {
    constructor(dbHandler) {
        console.log('AdminHandler initialized');
        this.dbHandler = dbHandler;
    }

    addCategory = async (name, image) => {
        try {
            let res;
            // Check if category already exists
            let qry = this.dbHandler.categoryHandler.getCategoryNames();
            for (let i = 0; i < qry.length; i++) {
                if (qry[i].name === name) {
                    console.log("Error adding Category" + " - Category exists");
                    return false;
                }
            }
            // Insert new Category
            let record = {name: name};
            res = await this.dbHandler.query({sql: "INSERT INTO category_category SET ?"}, record);

            return res.insertId;

        } catch (e) {
            return "Error adding Category" + e;
        }

    };

    addSubCategory = async (name, image, category) => {
        try {
            // TODO - create new SubCategory
        } catch (e) {
            console.log("Error adding SubCategory" + e);
            return false;
        }
    };

    setDishOwner = async (user, dishId) => {
        try {
            return await this.dbHandler.query({sql: "UPDATE dish SET ? WHERE id = ?"}, [{creator: user}, dishId]);
        } catch (e) {
            console.log('Error changing dish owner');
            console.log(e);
            return false;
        }
    };
}

module.exports = AdminHandler;