const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./lib/router.js');
const config = require('./config');
const app = express();

// Use EJS as View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

// Bodyparser for JSON and File Upload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Session stuff
app.use(session({
   secret: 'adfiSHDFuhas7',
   resave: false,
   saveUninitialized: true
}));

// Set static paths
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

// Set routes
app.use('/', routes);

// Start server
app.listen(config.port,function () {
    console.log('Server started at Port ' + config.port);
});