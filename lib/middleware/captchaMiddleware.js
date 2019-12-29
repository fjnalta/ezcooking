"use strict";

const runtime = require('../../config').runtime;
const request = require('request');

class CaptchaMiddleware {

    constructor(dbHandler) {
        console.log('CaptchaMiddleware initialized');
        this.dbHandler = dbHandler;
    }

    // authentication middleware
    verifyToken = (req, res, next) => {
        let response = res;
        let token = req.body.token;
        if (req.body.token && runtime.app.recaptcha) {
            request.post('https://www.google.com/recaptcha/api/siteverify', {
                form: {
                    secret : runtime.app.recaptcha,
                    response : token
                }
            }, (error, res, body) => {
                if (error) {
                    // calling google api failed
                    response.sendStatus(500);
                }
                let tokenResponse = JSON.parse(body);
                if (tokenResponse.success) {
                    //console.log(`statusCode: ${res.statusCode}`);
                    //console.log(body);
                    next();
                }
            });
        } else {
            // token or recaptcha token not provided
            res.sendStatus(500);
        }
    };
}

module.exports = CaptchaMiddleware;