"use strict";

// TODO - handle all input logic in here - (remove from router)
class InputMiddleware {

/*    handleAddDishInput = (req, res, next) => {

        req.body.description,
            req.session.username,
            req.body.category,
            req.body.subCategory,
            JSON.parse(req.body.ingredients),
            req.body.name,
            req.body.duration,
            req.body.shortDescription;
        let filename = null;
        if (req.file) {
            filename = req.file.filename;
        } else {
            filename = 'no_image';
        }
    };*/

    handleAddCategoryInput = (req, res, next) => {
        if (req.body.categoryName) {
            next();
        } else {
            res.sendStatus(500);
        }
    };
}

module.exports = InputMiddleware;