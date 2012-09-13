
/**
 * Module dependencies.
 */
//var LOG_FILE = 'monitor.log';
//var fs = require('fs');
var CONFIG = require('./config.js').CONFIG;

var express = require('express');
var http = require('http')
var path = require('path');

var app = express();
exports = module.exports.app = app;

require('./models/model.js').model(app);

var crypto = require('crypto');
var moment = require('moment');



// //Redis Server
// var redis = require('redis');
// var client = redis.createClient();
// client.on('connect', function(){
//   console.log('Connection to Redis Server Ok');
//   app.client = client;
// });

// //On connection error
// client.on('error', function(error){
//   console.log('Error connecting to Redis Server.');
//   console.dir(error);
//   //terminate app when redis-server not connceted to//

//   throw error;
//   process.exit(-1);
// });

// //On Moniter
// client.monitor(function (err, res) {
//     console.log("Entering monitoring mode.");
// });

// //moniter event fired
// client.on("monitor", function (time, args) {
//     console.log( new Date().toString() );
//     console.time(new Date().toString());
//     console.dir(args);
    
//     //put in file
//     /*fs.appendFile(LOG_FILE, data, function (err) {
//       if (err){
//         console.log('Error writing monitering data');

//         //throw err;
//       }
//       console.log('The monitering data was appended to moniter.log');
//     });
//     */
// });

app.configure(function(){
  app.set('port', process.env.PORT || CONFIG.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('ZWY5OGQwMjZlMzYyNzM1OD'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


require( './routes/routes.js').routes( app );
require( './routes/admin.js').admin( app );

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  console.log('env.PORT -->' + process.env.PORT );
  console.log('config.PORT -->' + CONFIG.PORT );
});
