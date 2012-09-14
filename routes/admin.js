exports.admin = function( app ){

	//Admin page of server//
	app.get('/tokenator.admin/:page?', function(req, res){
		try{
			var tokens = [];
			app.DB.Token.find({}, {}, 
				{
					sort: [['systemTime','desc']], 
					limit: 1000,
					skip: (req.params.page)? req.params.page : 0,
				},
				function(error, collection){
				if( error ){
					console.error('Error fetching tokens');
					console.dir(error);
					throw error;
				}
				if( collection ) tokens = collection;
				res.render('index.ejs',{
				  title: 'Tokenator Admininstration',
				  tokens: tokens,
				});
			});
		}catch( error ){
			console.error('Error fetching tokens');
			console.dir(error);
			res.redirect('/tokenator.admin');
		}
	});

	//purging records//
	app.get('/tokenator.admin.purge', function(req, res){
		try{
			
			app.DB.Token.remove({}, function(err) { 
				//this works beatifully//
				if( err ){
					console.info('Error purging DB');
					throw err;
				}

			   	console.log('collection removed');
			   	res.redirect('/tokenator.admin');
			});
			
		}catch(error){
			console.error('Error purging tokens');
			console.dir(error);
			res.redirect('/tokenator.admin');
		}
	});

};