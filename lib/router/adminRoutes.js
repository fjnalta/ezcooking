"use strict";

const bcrypt = require('bcryptjs');
const runtime = require('../../config').runtime;

class AdminRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    getAdmin = (req, res) => {
        res.render('admin', {
            session: req.session,
            runtime : runtime
        });
    };

    setDishOwner = async (req, res) => {
        let data = await this.dbHandler.adminHandler.setDishOwner(req.session.userId, req.params.id);
        if(data) {
            res.redirect('/mydishes');
        } else {
            res.sendStatus(500);
        }
    };

    addCategory = async (req, res) => {
        // Handle if an image was sent
        let filename;
        if (req.file) {
            filename = req.file.filename;
        } else {
            filename = 'no_image';
        }

        let data = await this.dbHandler.adminHandler.addCategory(req.body.categoryName, filename);
        if(data) {
            res.redirect('/admin');
        } else {
            res.sendStatus(500);
        }
    };

}

module.exports = AdminRoutes;