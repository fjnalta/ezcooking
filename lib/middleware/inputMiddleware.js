"use strict";

// TODO - handle all input logic in here - (remove from router)
class InputMiddleware {

    constructor(dbHandler) {
        console.log('InputMiddleware initialized');
        this.dbHandler = dbHandler;
    }

    handleRegistrationInput = (req, res, next) => {
        let checkUser = /^[a-z0-9]+$/.test(req.body.username);
        let checkUserLength = (req.body.username).length > 3;
        let checkMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!checkUser || !checkUserLength) {
            console.log("Username Check: " + /^[a-z0-9]+$/.test(req.body.username));
            console.log("Username Length: " + checkUserLength);
            // TODO - return error
            res.sendStatus(500);
        } else if(!checkMail) {
            // TODO - return error
            console.log("E-Mail Check: " + checkMail.test(req.body.email));
            res.sendStatus(500);
        } else if(req.body.password !== req.body.password2) {
            // TODO - return error
            console.log("Password Check: Passwords do not match");
            res.sendStatus(500);
        } else if(!((req.body.password).length > 4)) {
            // TODO - return error
            console.log("Password Length: Password is too short");
            res.sendStatus(500);
        } else {
            next();
        }
    };

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