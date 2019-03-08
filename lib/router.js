const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const multer  = require('multer');
// const upload = multer({ dest: 'public/uploads/' });
const path = require('path');
const mysql = require('mysql');
// const bcrypt = require('bcrypt');
const config = require('../config');
const router = express.Router();

//const pool  = mysql.createPool(config.mysql);

// Authentication Middleware
function requiresLogin(req, res, next) {
    return next();
//    if(req.session.username && req.session.id) {
//        return next();
//    } else {
//        return res.render('login', { session: undefined, privileges: undefined });
//    }
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

// Routes
router.get('/', requiresLogin, function (req, res) {
    // Course.find({ 'users.name' : req.session.username }, function (err, data) {
        // if (err) {
            // res.sendStatus(500);
        // }
        res.render('index', { username: 'myUser', privileges: 'admin' });
    // });
});

router.post('/login', function(req, res) {
    // if(req.body.username && req.body.password != undefined) {
    //     pool.query({sql: "SELECT * FROM users WHERE name = ?"}, req.body.username, function (err, result, fields) {
    //         if (err) {
    //             throw err;
    //         } else {
    //             if(result.length > 0){
    //                 bcrypt.compare(req.body.password, result[0].password, function(err, passCheck){
    //                     if (passCheck){
    //                         req.session.username = req.body.username;
    //                         req.session.privileges = result[0].role;
    //                         res.redirect('/');
    //                     }
    //                 })
    //             }
    //         }
    //     });
    // }
});

router.post('/logout', requiresLogin, function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.post('/course/:id', requiresLogin, function(req, res) {
    // Course.find({ '_id' : req.params.id , 'users.name' : req.session.username }, function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     res.send(data);
    // });
});

router.delete('/course/:id/topic/:topicId', requiresLogin, function(req, res) {
    // Course.update({ _id: req.params.id },
    //     { "$pull": { "topics": { "_id": req.params.topicId } }},
    //     { safe: true, multi:true }, function(err, obj) {
    //         if(err) {
    //             throw err;
    //         }
    //         res.send().status(200);
    //     });
});

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