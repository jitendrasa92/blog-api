var express = require("express");
var path = require('path');
require("./app/config/database");
var config = require("./app/config/config");
var webservices = require("./app/routers/router");
var adminWebservices = require("./app/routers/adminRouter");
var logger = require("./app/utils/logger");
var cookieParser = require('cookie-parser');
var cors = require('cors');

//console.log(config);
const { port, host } = config;

var app = express();

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(fileUpload());
//app.use(logger('dev'));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/app/public', express.static('app/public'));


app.use('/webservices', webservices);
app.use('/admin', adminWebservices);
app.listen(port, () => {
    logger.log('info', `Server started at http://${host}:${port}`);
})


module.exports = app;