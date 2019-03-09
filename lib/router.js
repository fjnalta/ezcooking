const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const multer  = require('multer');
// const upload = multer({ dest: 'public/uploads/' });
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
// const bcrypt = require('bcrypt');
const config = require('../config');
const router = express.Router();

// connect mysql
const pool = mysql.createPool(config.mysql);

// authentication middleware
function handleSession(req, res, next) {
    if (req.session.email && req.session.id && req.session.username) {
        return next();
    } else {
        req.session = undefined;
        return next();
    }
}

// check permission
function checkUserPermission(req, res, next) {
    if (req.session != undefined) {
        // check db for login data
        pool.query("SELECT * FROM users WHERE name = ?", req.session.username, function (err, result, fields) {
            if (err) {
                throw err;
            } else {
                if (result.length > 0 && req.session.username == result[0].name && req.session.email == result[0].email) {
                    return next();
                }
            }
        });
    } else {
        // if there is no valid login data - redirect to error page
        return res.render('error', {
            session: undefined
        });
    }
}

// function requiresAdmin(req, res, next) {
//    pool.query("SELECT role FROM users WHERE name = ?", req.session.username, function (err, result, fields) {
//        if(err) {
//            throw err;
//        } else {
//            if(result.length > 0 && result[0].role == 'A') {
//                return next();
//            } else {
//                return res.redirect('/');
//            }
//        }
//    });
// }

// GET - routes
// ------------
// basic routes
router.get('/', handleSession, function (req, res) {
    // TODO - load dishes from DB
    res.render('index', {
        session: req.session
    });
});

router.get('/browse', handleSession, function (req, res) {
    // TODO - load dish categories from db
    res.render('browse', {
        session: req.session
    });
});

// need authentication + need permission
router.get('/profile', handleSession, checkUserPermission, function (req, res) {
    // TODO - load dish categories from db
    res.render('profile', {
        session: req.session
    });
});

router.get('/settings', handleSession, checkUserPermission, function (req, res) {
    // TODO - load dish categories from db
    res.render('settings', {
        session: req.session
    });
});

router.get('/dish', handleSession, checkUserPermission, function (req, res) {
    // TODO - load dish categories from db
    res.render('add-dish', {
        session: req.session
    });
});

// need authentication + need permission + need admin
// TODO

// POST - routes
// -------------
router.post('/login', function (req, res) {
    if (req.body.email && req.body.password != undefined) {
        pool.query({
            sql: "SELECT * FROM users WHERE email = ?"
        }, req.body.email, function (err, result, fields) {
            if (err) {
                throw err;
            } else {
                if (result.length > 0) {
                    // success
                    if (result[0].password = req.body.password) {
                        req.session.username = result[0].name;
                        req.session.email = result[0].email;
                        res.redirect('/');
                    } else {
                        // TODO - print error in modal
                    }

                    // TODO - encrypt pw's
                    //bcrypt.compare(req.body.password, result[0].password, function(err, passCheck){
                    //if (passCheck){
                    //    req.session.username = req.body.username;
                    //    req.session.privileges = result[0].role;
                    //    res.redirect('/');
                    //}
                    //})
                }
            }
        });
    }
});

// need authentication
router.post('/logout', handleSession, function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

//router.post('/course/:id', handleSession, function (req, res) {
    // Course.find({ '_id' : req.params.id , 'users.name' : req.session.username }, function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     res.send(data);
    // });
//});

//router.delete('/course/:id/topic/:topicId', handleSession, function (req, res) {
    // Course.update({ _id: req.params.id },
    //     { "$pull": { "topics": { "_id": req.params.topicId } }},
    //     { safe: true, multi:true }, function(err, obj) {
    //         if(err) {
    //             throw err;
    //         }
    //         res.send().status(200);
    //     });
//});

// Admin Routes
// router.get('/admin', requiresLogin, requiresAdmin, function (req, res) {
//     Course.find({ 'users.name' : req.session.username }, function (err, data) {
//         if (err) {
//             res.sendStatus(500);
//         }
//         res.render('admin', { session: req.session.username, privileges: req.session.privileges, course: data, courses: data });
//     });
// });


// router.post('/admin/course', requiresLogin, requiresAdmin, function(req, res) {
//     var myCourse = new Course({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         owner: req.body.owner,
//         shortDescription: req.body.shortDescription,
//         description: req.body.description,
//         users: req.body.users
//     });

//     myCourse.save(function (err) {
//         if (err) {
//             throw err;
//         }
//         res.send().status(200);
//     });
// });

module.exports = router;