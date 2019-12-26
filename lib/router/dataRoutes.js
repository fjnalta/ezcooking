"use strict";

class DataRoutes {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    getUnits = (req, res) => {
        (async () => {
            let data = await this.dbHandler.dishHandler.getUnits();
            await res.json(data);
        })();
    };

    getIngredients = (req, res) => {
        (async () => {
            let data = await this.dbHandler.dishHandler.getIngredients(req.params.id);
            await res.json(data);
        })();
    };

    getCategoryNames = (req, res) => {
        (async () => {
            let data = await this.dbHandler.categoryHandler.getCategoryNames();
            await res.json(data);
        })();
    };

    getSubCategoryNames = (req, res) => {
        (async () => {
            let data = await this.dbHandler.categoryHandler.getSubCategoryNames(req.params.id);
            await res.json(data);
        })();
    };

}

module.exports = DataRoutes;

/*// TODO - no used?
router.get('/indices', authMiddleware.handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getIndices();
        res.json(data);
    })();
});

// TODO - no used?
router.get('/favorites', authMiddleware.handleSession, authMiddleware.checkUserLogin, function (req, res) {
    let data;
    // TODO - load favorites from db
    res.render('favorites', {
        session: req.session,
        data: data
    });
});*/