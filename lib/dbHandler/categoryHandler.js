"use strict";

class CategoryHandler {

    constructor(dbHandler) {
        console.log('CategoryHandler initialized');
        this.dbHandler = dbHandler;
    }

    getCategoryInformation = async (subCategory, category) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT category_subcategory.id as subcategory_id, cc.id as category_id FROM category_subcategory JOIN category_category cc on category_subcategory.category = cc.id WHERE subname = ? AND cc.name = ?"}, [ subCategory, category ]);
        } catch (e) {
            console.log('Error loading category information');
            console.log(e);
        }
        return res;
    };

    /**
     * Method for reading all available categories and subCategories
     * @returns JSON of all categories and subCategories
     */
    getAllCategories = async () => {
        let categories;
        let subCategories;

        let res = {};
        res['categories'] = [];
        res['subCategories'] = [];

        try {
            categories = await this.dbHandler.query({sql: "SELECT * FROM category_category"});
            subCategories = await this.dbHandler.query({sql: "SELECT category_subcategory.id as sub_id, subname, category as category_id, cc.name as category FROM category_subcategory JOIN category_category cc on category_subcategory.category = cc.id"});

            for (let i = 0; i < categories.length; i++) {
                res['categories'].push({
                    id : categories[i].id,
                    name : categories[i].name
                });
            }

            for (let i = 0; i < subCategories.length; i++) {
                res['subCategories'].push({
                    id : subCategories[i].sub_id,
                    name : subCategories[i].subname,
                    category_id : subCategories[i].category_id,
                    category : subCategories[i].category
                });
            }
        } catch (e) {
            console.log('Error loading Categories');
            console.log(e);
        }
        return res;
    };

    getCategoryOverview = async () => {
        let categoriesCount;
        let subCategories;

        try {
            categoriesCount = await this.dbHandler.query({sql: "SELECT category_id, cc.name, cc.image_name, COUNT(*) AS 'count' FROM dish_category JOIN category_category cc on dish_category.category_id = cc.id GROUP BY category_id"});
            subCategories = await this.dbHandler.query({sql: "SELECT category_subcategory.id, category_subcategory.subname, cc.id as categoryId, cc.name as category, IFNULL(subcatcount.count, 0) AS count FROM category_subcategory LEFT JOIN category_category cc on category_subcategory.category = cc.id LEFT JOIN (SELECT subcategory_id, COUNT(*) AS 'count' FROM dish_category GROUP BY subcategory_id) as subcatcount on category_subcategory.id = subcatcount.subcategory_id"});
        } catch (e) {
            return "Error loading categories " + e;
        }

        let res = {};
        res['subCategories'] = [];
        res['categories'] = [];

        // clean up format
        for (let i = 0; i < categoriesCount.length; i++) {
            res['categories'].push({
                id: categoriesCount[i].category_id,
                category: categoriesCount[i].name,
                image_name: categoriesCount[i].image_name,
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

    getCategoryImage = async (category) => {
        let res;
        try {
            res = await this.dbHandler.query({sql: "SELECT image_name FROM category_category WHERE id = ?"}, category);
        } catch (e) {
            return "Error loading category image" + e;
        }
        return res[0].image_name;
    }

    getSubCategories = async (category) => {
        try {
            return await this.dbHandler.query({sql: "SELECT category_subcategory.id, subname, category, category_subcategory.image_name, cc.name FROM category_subcategory JOIN category_category cc on category_subcategory.category = cc.id WHERE category = ?"}, category);
        } catch (e) {
            return "Error loading subCategories" + e;
        }
    };
}

module.exports = CategoryHandler;