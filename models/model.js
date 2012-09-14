
// var Option = function(){
// 	return ({
// 		key : 0,		//token value
// 		token : 0,		//token value
// 		validity : 0,	//Validity period of timed token: milli-sec
// 		device : 0,		//device unique identifier, e.g ip, mac, imei
// 		deviceTime : 0,	//time of acquirng device: milli-sec
// 		status: 0, 		//status of token. 0 - unused, 1 - used
// 		tokenType:0,	//timed or not
// 		ip:0,			//Ip of server acquiring the token for client

// 		//extra stuff
// 		startTime: 0,	//time token was created   milli-sec
// 		endTime: 0,		//time the token lived in system: milli-sec
// 	});
// };

exports.model = function( app ){
	var mongoose = require('mongoose');
	var db = mongoose.createConnection('mongodb://localhost/tokenator');
	mongoose.set('debug', true);
	var ObjectId = mongoose.Types.ObjectId;
		
	app.DB = {};
	app.DB.ObjectId = ObjectId;

	db.on('error', function(){
		console.error('Error establishing connection to mongodb');
		throw new Error('MongoDb connection error');
		process.exit(-1);
	});

	db.once('open', function () {
	 	console.info('Connection to mongodb established');
	 	//service field definition
	 	var tokenSchema = new mongoose.Schema({
	 		key: 		{type:String, default: ''},
	 		token: 		{type:String, default: '',  index: true },
	 		validity: 	{type:Number, default: 0},
	 		device: 	{type:String, default: '' , index: true },
	 		deviceTime: {type:Number, default: 0},
	 		status: 	{type:Number, default: 0},
	 		tokenType: 	{type:Number, default: 0},
	 		ip: 		{type:String, default: ''},

	 		timePool: 	{type:String, default: ''},

	 		stackTime: 	{type:Number, default: new Date().getTime()},
	 		systemTime: {type:Number, default: new Date().getTime()},
	 	});
	 	app.DB.Token = db.model('Token', tokenSchema);
	 	
	 		
	});

}