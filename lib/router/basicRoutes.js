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
        let records;
        let maxPages;
        let data;

        // handle max page
        (async () => {
            records = await this.dbHandler.dishHandler.getNumberOfDishes();

            maxPages = records / 9;
            if(maxPages % 1 != 0) {
                maxPages = maxPages + 1;
            }

            // handle current page
            let page = 1;
            if (req.query.page) {
                page = req.query.page;
            }
            // handle queries with large page numbers
            if(req.query.page > maxPages) {
                page = maxPages;
            }
            data = await this.dbHandler.dishHandler.browseDish(page);

            let nextPage = parseInt(page) + 1;
            let prevPage = parseInt(page) - 1;

            res.render('browse', {
                session: res.auth,
                data: data,
                pageInfo : {
                    maxPages : maxPages,
                    curPage: page,
                    nextPage : nextPage,
                    prevPage : prevPage
                },
                runtime: runtime
            });
        })();
    };

    categories = (req, res) => {
        let data;
        (async () => {
            data = await this.dbHandler.categoryHandler.getCategoryOverview();
            res.render('browseCategory', {
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