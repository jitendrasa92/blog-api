var logger = require("../utils/logger");
var mongoose = require("mongoose");
const userName = '';
const password = '';
const hostName = 'localhost';
const port = '27017';
const dbName = 'blog';

//var uri = `mongodb://${userName}:${password}@${hostName}:${port}/${dbName}`;
var uri = `mongodb://${hostName}:${port}/${dbName}`;
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => { logger.log('info', `Succesfully Connected to the Mongodb Database  at URL :${uri}`) })
  .catch((e) => { console.log(e) });