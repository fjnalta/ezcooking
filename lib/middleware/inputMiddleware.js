"use strict";

class InputMiddleware {

    constructor(dbHandler) {
        console.log('InputMiddleware initialized');
        this.dbHandler = dbHandler;
    }

    // authentication middleware
    handleAddCategoryInput = (req, res, next) => {
        if (req.body.categoryName) {
            next();
        } else {
            res.sendStatus(500);
        }
    };
}

module.exports = InputMiddleware;