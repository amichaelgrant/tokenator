var crypto = require('crypto');
var moment = require('moment');

var Option = function(){
	return ({
		key : 0,		//token value
		token : 0,		//token value
		validity : 0,	//Validity period of timed token: milli-sec
		device : 0,		//device unique identifier, e.g ip, mac, imei
		deviceTime : 0,	//time of acquirng device: milli-sec
		status: 0, 		//status of token. 0 - unused, 1 - used
		tokenType:0,	//timed or not
		ip:0,			//Ip of server acquiring the token for client

		//extra stuff
		startTime: 0,	//time token was created   milli-sec
		endTime: 0,		//time the token lived in system: milli-sec
	});
};

var STATUS = {
	TIMED:{
		TOKEN_VALID: 		'0',	//valid token, within given time frame
		TOKEN_EXPIRED: 		'1',	//Expired timed token
		RETRANSMIT_OCCURED: '2',	//Http retransmission occuring
		TOKEN_NON_EXISTENT: '3',	//non existent token for given device
	},
	BAD:'ERROR'				//General http request failure
};

var CONFIG = {
	DEFAULT_TOKEN_VALIDITY: 60*60*1000, //this is one(1) hour in milli-sec
};

//general is date function//
var isDate = function(val) {
	if(!val) return false;
    var d = new Date().setTime( val );
    console.log( 'Val of -->' + d.toString() );
    var ret = !isNaN(d.valueOf());
    return ret;
}

exports.routes = function( app ){

	app.all('*', function( req, res, next){
		try{
			console.dir( req.route );
			next();
		}catch( err ){
			console.dir( req.route );
			next();
		}
	});

	//Index page of server//
	app.get('/', function(req, res){
		console.log('You have reached the token machine.');
	  	res.send('You have reached the token machine');
	});

	//Get a token from the server//
	//Generate a fresh token from the tokenator machine
	//below are the required parameters
	//time_validity=ValidityTime&device_id=DeviceIdentification&device_time=TimeOnDevice
	app.get('/tokenator/timedtoken/get_token', function(req, res){
		try{
			//accepted parameters
			var option = Option();
			if( !option ) throw new Error('Option object could not be created.');
			option.validity = req.query['time_validity'];
			option.device = req.query['device_id'];
			option.deviceTime = req.query['device_time'];
			option.ip = req.ip;
			console.log('get query -->');
			console.dir(req.query);

			option.startTime = new Date().getTime(); //milli-sec time
			option.status = 0;	// new and unused token
			console.log( option.startTime );
			//Error checking for the fields
			//if validity is not specified set to default
			//option.validity = option.validity || CONFIG.DEFAULT_TOKEN_VALIDITY;
			console.log('validity -->' + option.validity );
			if( !option.validity ) throw new Error('Validity time not specified!');
			//if not a number
			if( isNaN(option.validity) == true ) throw new Error('Invalid validity time');
			if( option.validity < 0 ) throw new Error('validity time must be positive');
			
			//set device time to current time if not given
			//option.deviceTime = option.deviceTime || new Date().getTime();
			if( !isDate(option.deviceTime) ) throw new Error('Invalid device time');

			//check for device id
			if(!option.device) throw new Error('Invalid Device Id: ');

			//Once all validation is passed//
			//check for availability of token first before attempting to create a 
			//new one


			////////////////////////////////////////////////////
			/////////////////////////////////////////////////////

			//generating an MD5 with  some random variable parameters
			//'' + time-in-milii-sec + something else
			var data = '' + option.deviceTime + new Date().getTime() + Math.random();
			var token = crypto.createHash('md5').update(data).digest("hex");
			token = new Buffer(token || '').toString('base64');
			token = token.substring(0,30);
			
			//ensure the token is really generated and string cast it
			if( !token ) throw error;
			token = token.toString();

			//make sure the token and key values are set before going to redis-server//
			option.token = option.key = token;
			console.log('<-- option --->');
			console.dir(option);
			//Now save the token and the other parameters in the blazing fast
			//Redis server
			app.client.HMSET(token, option, function(error, responseObject){
				if( error ){
					console.log('Get token error');
					throw error;
				}
				
				console.log('Token generated..' + responseObject);
				console.dir(option);
				res.send(token);
				return;
			});

		}catch( error ){
			//Catch all per request errors
			console.log('Get Token error');
			console.dir(error);
			res.send(STATUS.BAD);
			return;
		}
		
	});

	//Timed Tokens
	//Check a token validity//
	//token=Token&device_id=DeviceId&device_time=TimeOnDevice
	app.get('/tokenator/timedtoken/check_token', function(req, res){
		try{
			console.log('Checking ...Token....');
			console.dir(req.query);

			var option = Option();
			if(!option ) throw new Error('Option object could not be created');
			option.device = req.query['device_id'];
			option.deviceTime = req.query['device_time'];
			//option.ip = req.ip;
			var token = req.query.token;
			option.token = token;
			//option.key = token;
			console.log('Here is the token -->' + token);

			//Error checking for the optioin variables;
			//checking token var
			if( !token ) throw new Error('Token not specified');
			//device Id 
			if(!option.device) throw new Error('Device not specified');
			//deviceTime
			if( !isDate( option.deviceTime) ) throw new Error('Device Time not specified');


			console.log('great! params fetched!');
			app.client.HGETALL(token, function(error, tokenObject){
				if(error){
					console.log('Token check error happened, redis returned error');
					throw error;
				}


				//If there was no error then start processing
				console.log('tokenObejct------------------------>');
				console.dir(tokenObject);
				//if token not found
				var status = STATUS.BAD;
				if(!tokenObject || tokenObject == null ){
					res.send(STATUS.TIMED.TOKEN_NON_EXISTENT); //non existent token for device
					//return;
				}else{
					//if Token Found
					
					//c-retransmitted token
					//deviceId && deviceTime must already exist in db for a
					//retransmitt to occured
					
					console.log( '\ntokenObject.deviceTime-->' + parseInt(tokenObject.deviceTime) );
					console.log( '\ntokenObject.validity-->' + parseInt(tokenObject.validity) );
					var vt = parseInt(tokenObject.validity) + parseInt(tokenObject.deviceTime);
					console.log( '\ntokenObject.validity + tokenObject.deviceTime-->' + vt);
					var diff = parseInt(vt) - parseInt(option.deviceTime);

					console.log( '\noption.deviceTime -->' + parseInt(option.deviceTime) );
					console.log( '\noption.deviceTime and (tokenObject.validity + tokenObject.deviceTime) Diff-->' + diff );

					//console.log( 'tkO.device --%s == opD.device --%s' , tokenObject.device, option.device );

					//testing for retransmitts
					if( tokenObject.device == option.device
						&& (parseInt(tokenObject.deviceTime) - parseInt(option.deviceTime) == 0)
						&& parseInt( tokenObject.status) == 1){
						
						console.log('Retransmission occured');
						status = STATUS.TIMED.RETRANSMIT_OCCURED;
						//return;
					//valid tokens
					}else if(  
						( (parseInt(tokenObject.validity) + parseInt(tokenObject.deviceTime)) > parseInt(option.deviceTime))
						//checking lower bound of time
						&& ( parseInt(tokenObject.deviceTime) < parseInt(option.deviceTime) ) 

						//(parseInt(option.deviceTime) > parseInt(tokenObject.deviceTime)) 
						//&& ( parseInt(option.deviceTime) < (parseInt(tokenObject.deviceTime) + parseInt(tokenObject.validity)) )
						
					){

						//a-validity is intact
						status = STATUS.TIMED.TOKEN_VALID;   //this is a valid token

						//update before sending result back to server so//
						//we are sure this has been used already//
						tokenObject.status = '1';
						console.log('before update-->');
						console.dir(tokenObject);
						app.client.HMSET(token, tokenObject, function(error, responseObject){
							if( error ){
								console.log('Update token error');
								throw error;
							}
							console.log('Update response object');
							console.dir(responseObject);
							console.dir(tokenObject);
							console.log('Update response object ends');

							//send status to client
							console.log( 'status -->' + status );
							res.send( status );//tokenObject );
						});
						//return;
					//b-expired token
					}else if( 
						(parseInt(tokenObject.validity) + parseInt(tokenObject.deviceTime)) <= parseInt(option.deviceTime) ||
						(parseInt(tokenObject.deviceTime)) >= parseInt(option.deviceTime) 
						){

						status = STATUS.TIMED.TOKEN_EXPIRED;
						//return;
					}else{
						console.log('Going back to agent caller with check response');
						status = STATUS.BAD;
					}
					//end of token found

					console.log( 'status -->' + status );
					res.send( status );//tokenObject );
					
				}
				
			});
	
		}catch( error ){
			console.log('Token check error.');
			console.dir(error);
			res.send(STATUS.BAD);
		}
	});


}