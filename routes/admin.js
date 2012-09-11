exports.admin = function( app ){

	//Admin page of server//
	app.get('/tokenator.admin', function(req, res){

		var tokens = [];
		res.render('index.ejs',{
		  title: 'Tokenator Admininstration',
		  tokens: tokens,
		});
	});

};