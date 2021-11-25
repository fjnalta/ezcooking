"use strict";

const runtime = require('../../config').runtime;
const fs = require('fs');


class DishRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    addDish = (req, res) => {
        (async () => {
            let categories = await this.dbHandler.categoryHandler.getAllCategories();
            res.render('add-dish', {
                session: res.auth,
                runtime : runtime,
                categories : categories
            });
        })();

    };

    createDish = (req, res) => {
        // Handle if an image was sent
        let filename = null;
        if (req.file) {
            filename = req.file.filename;
        } else {
            filename = 'no_image';
        }
        (async () => {
            let categories = JSON.parse(req.body.categories);
            let categoryIds = [];
            // Get category data from DB
            for(let i = 0; i < categories.length; i++) {
                let cat = await this.dbHandler.categoryHandler.getCategoryInformation(categories[i].subcategory, categories[i].category);
                categoryIds.push(cat[0]);
            }
            // insert dish in DB
            let val = await this.dbHandler.dishHandler.createDish(
                req.body.name,
                req.body.duration,
                req.body.shortDescription,
                filename,
                req.body.description,
                categoryIds,
                JSON.parse(req.body.ingredients),
                res.auth.preferred_username
            );

            // update search cache
            this.generateSearchJson();

            res.send(val);
        })();
    };

    updateDish = (req, res) => {
        // Handle if an image was sent
        let filename = null;
        if (req.file) {
            filename = req.file.filename;
        }
        (async () => {
            let categories = JSON.parse(req.body.subCategories);
            let categoryIds = [];

            // Get category data from DB
            for(let i = 0; i < categories.length; i++) {
                let cat = await this.dbHandler.categoryHandler.getCategoryInformation(categories[i].subcategory, categories[i].category);
                categoryIds.push(cat[0]);
            }
            let val = await this.dbHandler.dishHandler.updateDish(
                req.body.name,
                req.body.duration,
                req.body.shortDescription,
                filename,
                req.body.description,
                categoryIds,
                JSON.parse(req.body.ingredients),
                req.params.id,
                res.auth.preferred_username
            );

            // update search cache
            this.generateSearchJson();

            res.send(val);
        })();
    };

    /**
     * Render Dish - /dish/:id
     * @param req
     * @param res
     */
    getDish = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.dishHandler.getDish(req.params.id);
            if (data) {
                res.render('dish', {
                    session: res.auth,
                    data: data,
                    runtime : runtime
                });
            } else {
                res.render('errors/notFoundError', {
                    session: res.auth,
                    data: data,
                    runtime : runtime
                });
            }
        })();
    };

    /**
     * Render My Dishes - /myDishes
     * @param req
     * @param res
     */
    getDishes = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.dishHandler.getDishes(res.auth.preferred_username);
            res.render('myDishes', {
                session: res.auth,
                data: data,
                runtime : runtime
            });
        })();
    };

    /**
     * Render Edit Dish - /dish/edit
     * @param req
     * @param res
     */
    editDish = (req, res) => {
        (async () => {
            let categories = await this.dbHandler.categoryHandler.getAllCategories();
            let data = await this.dbHandler.dishHandler.getDish(req.params.id);
            res.render('edit-dish', {
                session: res.auth,
                data: data,
                runtime : runtime,
                categories : categories
            });
        })();
    };

    getSubCategories = (req, res) => {
        let records;
        let maxPages;

        (async () => {
            records = await this.dbHandler.dishHandler.getNumberOfDishesFromCategory(req.params.category);

            maxPages = records / 9;
            if(maxPages % 1 != 0) {
                maxPages = maxPages + 1;
            }

            maxPages = parseInt(maxPages);

            // handle current page
            let page = 1;

            if (req.query.page) {
                page = req.query.page;
            }
            // handle queries with large page numbers
            if(req.query.page > maxPages) {
                page = maxPages;
            }

            let categoryImage = await this.dbHandler.categoryHandler.getCategoryImage(req.params.category);
            let categories = await this.dbHandler.categoryHandler.getSubCategories(req.params.category);
            let dishes = await this.dbHandler.dishHandler.getDishesFromCategory(page, req.params.category);

            let nextPage = parseInt(page) + 1;
            let prevPage = parseInt(page) - 1;

            res.render('categories', {
                session: res.auth,
                data : dishes,
                categoryImage : categoryImage,
                categories : categories,
                pageInfo : {
                    maxPages : maxPages,
                    curPage : page,
                    nextPage : nextPage,
                    prevPage : prevPage
                },
                runtime : runtime
            });
        })();
    };

    getDishesFromSubCategory = (req, res) => {
        let records;
        let maxPages;

        let data;
        (async () => {
            records = await this.dbHandler.dishHandler.getNumberOfDishesFromSubCategory(req.params.subcategory);

            maxPages = records / 9;
            if(maxPages % 1 != 0) {
                maxPages = maxPages + 1;
            }

            maxPages = parseInt(maxPages);

            // handle current page
            let page = 1;

            if (req.query.page) {
                page = req.query.page;
            }
            // handle queries with large page numbers
            if(req.query.page > maxPages) {
                page = maxPages;
            }

            data = await this.dbHandler.dishHandler.getDishesFromSubCategory(page, req.params.subcategory);

            let nextPage = parseInt(page) + 1;
            let prevPage = parseInt(page) - 1;

            res.render('sub-categories', {
                session: res.auth,
                data: data,
                pageInfo : {
                    maxPages : maxPages,
                    curPage : page,
                    nextPage : nextPage,
                    prevPage : prevPage
                },
                runtime : runtime
            });
        })();
    };

    deleteDish = (req, res) => {
        (async () => {
            let data = await this.dbHandler.dishHandler.deleteDish(res.auth.preferred_username, req.params.id);
            if (data) {
                // delete image from filesystem if not default image
                if(data !== 'no_image') {
                        fs.unlink('public/uploads/' + data, (err) => {
                        console.log(err);
                    });
                }

                // update search cache
                this.generateSearchJson();

                res.sendStatus(200);
            } else {
                // something went wrong while deleting
                res.sendStatus(500);
            }
        })();
    };

    /**
     * generates search cache
     * called inside create/edit/delete dish
     * @returns {Promise<void>}
     */
    generateSearchJson = async () => {
        let data = await this.dbHandler.dishHandler.getAllDishes();
        try {
            fs.unlink('public/search.json', function () {
                console.log('search cache deleted');
            });
            fs.writeFileSync('public/search.json',JSON.stringify(data));
        } catch (e) {
            console.log('Error creating search cache');
        }
    }
}

module.exports = DishRoutes;


