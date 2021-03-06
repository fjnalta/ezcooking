"use strict";

class AdminHandler {
    constructor(dbHandler) {
        console.log('AdminHandler initialized');
        this.dbHandler = dbHandler;
    }

    addCategory = async (name, image) => {
        console.log("called add category - " + name + " " + image);
        try {
            let res;
            // Check if category already exists

            console.log(dbHandler.toString());
            let qry = this.dbHandler.categoryHandler.getCategoryNames();
            console.log(qry.length);

            for (let i = 0; i < qry.length; i++) {
                if (qry[i].name === name) {
                    console.log("Error adding Category" + " - Category exists");
                    return false;
                }
            }
            // Insert new Category
            let record = {name: name};
            res = await this.dbHandler.query({sql: "INSERT INTO category_category SET ?"}, record);

            console.log(res);
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

    setDishOwner = async (userId, dishId) => {
        try {
            return await this.dbHandler.query({sql: "UPDATE dish SET ? WHERE id = ?"}, [{creator_id: userId}, dishId]);
        } catch (e) {
            console.log('Error changing dish owner');
            console.log(e);
            return false;
        }
    };
}

module.exports = AdminHandler;