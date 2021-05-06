"use strict";

class CategoryHandler {

    constructor(dbHandler) {
        console.log('CategoryHandler initialized');
        this.dbHandler = dbHandler;
    }

    getCategoryId = async (category) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT id FROM category_category WHERE name = ?"}, category);
        } catch (e) {
            console.log('Error loading category');
            console.log(e);
        }
        return res[0].id;
    };

    getSubCategoryId = async (subCategory) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT id FROM category_subcategory WHERE subname = ?"}, subCategory);
            return res[0].id;
        } catch (e) {
            console.log('Error loading subCategory');
            console.log(e);
        }
    };

    getCategoryOverview = async () => {
        let categoriesCount;
        let subCategories;

        try {
            categoriesCount = await this.dbHandler.query({sql: "SELECT category, cc.name, COUNT(*) AS 'count' FROM dish JOIN category_category cc on dish.category = cc.id GROUP BY category"});
            subCategories = await this.dbHandler.query({sql: "SELECT category_subcategory.id, category_subcategory.subname, cc.id as categoryId, cc.name as category, IFNULL(subcatcount.count, 0) AS count FROM category_subcategory LEFT JOIN category_category cc on category_subcategory.category = cc.id LEFT JOIN (SELECT subcategory, COUNT(*) AS 'count' FROM dish GROUP BY subcategory) as subcatcount on category_subcategory.id = subcatcount.subcategory"});
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
    };

    getCategoryNames = async () => {
        let res;
        let data = [];
        try {
            res = await this.dbHandler.query({sql: "SELECT * FROM category_category"});
        } catch (e) {
            console.log('Error loading category names');
            console.log(e);
        }
        for (let i = 0; i < res.length; i++) {
            data.push({id: res[i].id, name: res[i].name});
        }
        return data;
    };

    getSubCategories = async (category) => {
        try {
            return await this.dbHandler.query({sql: "SELECT category_subcategory.id, subname, category, image_name, cc.name FROM category_subcategory JOIN category_category cc on category_subcategory.category = cc.id WHERE category = ?"}, category);
        } catch (e) {
            return "Error loading subCategories" + e;
        }
    };

    getDishesFromSubCategory = async (subCategory) => {
        // TODO - this is dirty
        // returns undefined if no recipe available
        // fix this and always provide category and subcategory name
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT dish.id, dish.name, dish.duration, dish.short_description, dish.image_name, cs.subname, cc.name as 'catname' FROM dish JOIN category_subcategory cs on dish.subcategory = cs.id JOIN category_category cc on dish.category = cc.id WHERE subcategory = ?"}, subCategory);
        } catch (e) {
            console.log('Error loading dishes');
            console.log(e);
        }
        return res;
    };

    getSubCategoryNames = async (category) => {
        let res;
        let data = [];
        try {
            res = await this.dbHandler.query({sql: "SELECT * FROM category_subcategory WHERE category = ?"}, category);
        } catch (e) {
            console.log('Error loading subCategory names');
            console.log(e);
        }
        for (let i = 0; i < res.length; i++) {
            data.push({id: res[i].id, name: res[i].subname, category: res[i].category});
        }
        return data;
    };
}

module.exports = CategoryHandler;