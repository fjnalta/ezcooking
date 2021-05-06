"use strict";

const runtime = require('../../config').runtime;

class BasicRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    index = (req, res) => {
        (async () => {
            let data;
            data = await this.dbHandler.dishHandler.getLatestDishes();
            res.render('index', {
                session: res.auth,
                data: data,
                runtime : runtime
            });
        })();
    };

    browse = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.categoryHandler.getCategoryOverview();
            res.render('browse', {
                session: res.auth,
                data: data,
                runtime: runtime
            });
        })();
    };

    // TODO - implement real error handling
    error = (req, res) => {
        res.render('errors/notFoundError', {
            session: res.auth,
            runtime: runtime
        });
    };
}

module.exports = BasicRoutes;