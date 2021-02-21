const express = require('express');
const session = require('express-session');
const memoryStore = new session.MemoryStore();
const Keycloak = require('keycloak-connect');

const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config');

const router = require('./lib/router');

// setup keycloak
const keycloak = new Keycloak({store: memoryStore}, config.env.keycloak);

// reference express app
const app = express();

// setup express session
app.use(session({
    secret: config.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// configure webserver
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, config.env.webContentDir)));

// Use EJS as View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

// reverse proxy configuration
app.set('trust proxy', '127.0.0.1');

// setup static path
app.use('/node_modules', express.static('node_modules'));

// setup keycloak protected url's
// TODO

// setup public router
app.use('/', router);

// start server
app.listen(config.env.port,function () {
    console.log('Server started at Port ' + config.env.port);
});