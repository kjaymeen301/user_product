// const routes = 
var express = require('express');
const path = require('path');
const url = require('url');
const http = require("http");
require("dotenv").config();

const bodyParser = require('body-parser');
var session = require('express-session');
const app = express();
var flash = require('express-flash');

// parse application/json
app.use(bodyParser.json())

express.application.prefix = express.Router.prefix = function(path, configure) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: '123456catr',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))

// app.use(flash());
var route = require('./routes');

app.use('/', route);

app.set('port', '4000');
var server = http.createServer(app);
server.listen('4000');