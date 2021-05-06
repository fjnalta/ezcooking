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