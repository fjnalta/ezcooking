"use strict";

class DishRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }


    addDish = (req, res) => {
        res.render('add-dish', {
            session: req.session
        });
    };

    createDish = (req, res) => {
        // TODO - check if everything was provided
        // Handle if an image was sent
        let filename = null;
        if (req.file) {
            filename = req.file.filename;
        } else {
            filename = 'no_image';
        }

        (async () => {
            // Get async data from DB
            let userId = await this.dbHandler.userHandler.getUserId(req.session.username);
            let categoryId = await this.dbHandler.categoryHandler.getCategoryId(req.body.category);
            let subCategoryId = await this.dbHandler.categoryHandler.getSubCategoryId(req.body.subCategory);

            let val = await this.dbHandler.dishHandler.createDish(
                req.body.name,
                req.body.duration,
                req.body.shortDescription,
                filename,
                req.body.description,
                req.session.username,
                req.body.category,
                req.body.subCategory,
                JSON.parse(req.body.ingredients),
                userId,
                categoryId,
                subCategoryId);
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
            // Call dbHandler
            let userId = await this.dbHandler.userHandler.getUserId(req.session.username);
            let categoryId = await this.dbHandler.categoryHandler.getCategoryId(req.body.category);
            let subCategoryId = await this.dbHandler.categoryHandler.getSubCategoryId(req.body.subCategory);

            let val = await this.dbHandler.dishHandler.updateDish(
                req.body.name,
                req.body.duration,
                req.body.shortDescription,
                filename,
                req.body.description,
                req.session.username,
                req.body.category,
                req.body.subCategory,
                JSON.parse(req.body.ingredients),
                req.params.id,
                userId,
                categoryId,
                subCategoryId
            );
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
                    session: req.session,
                    data: data
                });
            } else {
                res.render('errors/notFoundError', {
                    session: req.session,
                    data: data
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
            data = await this.dbHandler.dishHandler.getDishes(req.session.userId);
            res.render('myDishes', {
                session: req.session,
                data: data
            });
        })();
    };

    /**
     * Render Edit Dish - /dish/edit
     * @param req
     * @param res
     */
    editDish = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.dishHandler.getDish(req.params.id);
            res.render('edit-dish', {
                session: req.session,
                data: data
            });
        })();
    };

    getSubCategories = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.categoryHandler.getSubCategories(req.params.category);
            res.render('categories', {
                session: req.session,
                data: data
            });
        })();
    };

    getDishesFromSubCategory = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.categoryHandler.getDishesFromSubCategory(req.params.subcategory);
            res.render('sub-categories', {
                session: req.session,
                data: data
            });
        })();
    };

    deleteDish = (req, res) => {
        (async () => {
            let data = await this.dbHandler.dishHandler.deleteDish(req.session.userId, req.params.id);
            if (data) {
                // delete image from filesystem if not default image
                if(data !== 'no_image') {
                    fs.unlink('public/uploads/' + data, (err) => {
                        console.log(err);
                    });
                }
                res.sendStatus(200);
            } else {
                // something went wrong while deleting
                res.sendStatus(500);
            }
        })();
    };
}

module.exports = DishRoutes;


