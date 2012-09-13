var should = require('should');
var assert = require('assert');
var Browser = require('zombie');

var time = '';
var token = '';

/*describe('token', function() {
     describe('with  arguments', function() {
         it('returns an empty object', function() {
            var result = {};
            result.should.eql({});
            assert(result);
        });
    });
});*/

describe('Tokenator Tests::', function() {

	/*describe('option', function() {
	    it('returns an empty object', function(done) {
	    	var options = token.option();
	        //opt.should.exist({});
	        console.dir(options);
	        assert(opt);
	        done();
	    });
	});*/

	/*describe('getToken OK', function(){
		it('Returns a valid token', function(done){
			var getUrl = 'tokenator/timedtoken/get_token?';
			//time_validity=ValidityTime&device_id=DeviceIdentification&device_time=TimeOnDevice
			getUrl += 'time_validity='+ 60*60*1000;
			getUrl += '&device_id='+ 'device-id';
			getUrl += '&device_time='+ new Date().getTime();

			Browser.visit("http://localhost:8888/" + getUrl , function (e, browser) {
			  // The browser argument is an instance of Browser class
			  //assert( typeof(e) === 'error');
			  console.log(browser.text());
			  done();
			});
		});
	});*/

	describe('getToken Failed', function(){
		it('Returns a valid token', function(done){
			var getUrl = 'tokenator/timedtoken/get_token?';
			//time_validity=ValidityTime&device_id=DeviceIdentification&device_time=TimeOnDevice
			getUrl += 'time_validity='+ 60*60*1000;
			getUrl += '&device_id='+ '';
			getUrl += '&device_time='+ new Date().getTime();

			console.log(getUrl);
			Browser.visit("http://localhost:8888/" + getUrl , function (e, browser) {
			  // The browser argument is an instance of Browser class
			  //assert( typeof(e) === 'error');
			  console.log(browser.text());
			  done();
			});
		});
	});

	describe('checkToken OK', function(){
		it('Returns a valid status', function(done){
			var getUrl = 'tokenator/timedtoken/check_token?';
			//time_validity=ValidityTime&device_id=DeviceIdentification&device_time=TimeOnDevice
			getUrl += 'token='+ 'ZDY4ODM2MDY4MWFmNTUx';
			getUrl += '&device_id='+ 'device-id';
			getUrl += '&device_time='+ '1347027458672';//'1347027458698';//new Date().getTime();

			Browser.visit("http://localhost:8888/" + getUrl , function (e, browser) {
			  // The browser argument is an instance of Browser class
			  //assert( typeof(e) === 'error');
			  console.log(browser.text());
			  done();
			});
		});
	});

});