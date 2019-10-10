const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const path = require('path');
const config = require('../config');
const router = express.Router();

// connect mysql
const dbHandler = require('./dbHandler');
// TODO - remove pool from this class
const pool = dbHandler.pool;

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
            session: undefined,
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
    let data;
    (async () => {
        data = await dbHandler.getLatestDishes();
        res.render('index', {
            session: req.session,
            data: data
        });
    })();
});

router.get('/dish/:id', handleSession, function (req, res) {
    let data;
    (async () => {
        data = await dbHandler.getDish(req.params.id);
        res.render('dish', {
            session: req.session,
            data: data
        });
    })();

});

router.get('/browse', handleSession, function (req, res) {
    res.render('browse', {
        session: req.session
    });
});


// need authentication + need permission
router.get('/dish', handleSession, checkUserPermission, function (req, res) {
    res.render('add-dish', {
        session: req.session
    });
});

router.get('/settings', handleSession, checkUserPermission, function (req, res) {
    res.render('settings', {
        session: req.session
    });
});

router.get('/mydishes', handleSession, checkUserPermission, function (req, res) {
    let data;
    res.render('myDishes', {
        session: req.session,
        data: data
    });
});

router.get('/favorites', handleSession, checkUserPermission, function (req, res) {
    let data;
    // TODO - load favorites from db
    res.render('favorites', {
        session: req.session,
        data: data
    });
});

// Load Data
//----------

// Load Ingredients
router.get('/ingredients/amount', handleSession, checkUserPermission, function (req, res) {
    let data = [];
    // load amount units
    pool.query({ sql: "SELECT * FROM category_unit WHERE unit = ?" }, 1, function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                // success
                for(myRes of result) {
                    data.push({ id: myRes.id, name: myRes.name });
                }
                res.json(data);
            }
        }
    });
});

// Load Categories
router.get('/categories', handleSession, checkUserPermission, function (req, res) {
    let data = [];
    pool.query({ sql: "SELECT * FROM category_category"}, function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                // success
                for(var i=0; i<result.length;i++) {
                   data.push({ id: result[i].id, name: result[i].name });
                }
                res.json(data);
            }
        }
    });
});

// Load SubCategory
router.get('/categories/:id', handleSession, checkUserPermission, function (req, res) {
    let data = [];
    pool.query({ sql: "SELECT * FROM category_subcategory WHERE category = ?"}, req.params.id,function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                // success
                for(let i=0; i<result.length;i++) {
                    data.push({ id: result[i].id, name: result[i].subname, category: result[i].category });
                }
                res.json(data);
            }
        }
    });
});


// need authentication + need permission + need admin
// TODO - add Categories/SubCategories/Metrics

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

router.post('/dish', upload.single('data'), handleSession, checkUserPermission, function (req, res) {
    let val;
    (async () => {
        val = await dbHandler.createDish(
            req.body.name,
            req.body.duration,
            req.body.shortDescription,
            req.file.filename,
            req.body.description,
            req.session.username,
            req.body.category,
            req.body.subCategory,
            JSON.parse(req.body.ingredients)
        );
        res.send(val);
    })();
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