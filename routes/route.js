var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var csv = require('fast-csv');

//MongoDB Connection
var mongoose = require('mongoose');
var models = require('../models/models');
var User = models.User,
	Message = models.Message,
	Photo = models.Photo;
	
mongoose.connect('mongodb://localhost/IST');
//end of MongoDB

//Passport
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, '_id name photo', function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: "Incorrect username or Password!"})}
        if (user.password != password) { return done(null, false, {message: "Incorrect username or Password!"})}
        return done(null, user);
    });
  }
));
//End of Passport

//Re-engineering Oct 2016
//Test
var request = require('request');

/*
router.get('/testabc', function(req,res,next){
		console.log(111);
	})
	.post('/testabc', function(req,res,next){
		  //生成multiparty对象，并配置上传目标路径
			var form = new multiparty.Form({uploadDir: './public/files/'});
		  //上传完成后处理
		  form.parse(req, function(err, fields, files) {
				console.log(fields);
				console.log(files);
				//"files/"+files.inputFile[0].path.split('\\').slice(-1)[0],
				var filesTmp = JSON.stringify(files,null,2);
				console.log(1);
				res.json('success');
			});
	});
*/
router.get('/test', function(req,res,next){
	/* Photo.findOneAndUpdate({'url': 'http://static.panoramio.com/photos/large/10000018.jpg'}, {$set:{status: 1}}, function(err, data){
		console.log(data);
	}); */
	res.render('test/cluster',{});
	/* request({
		url: "http://itripsmart-api-8888.herokuapp.com/api/smartplan/v5",
		method: "POST",
		json: true,
		headers: {
			"accept": "application/json",
			"content-type": "application/json",
		},
		body: {
			"routeName":"ROUTE101","startDate":"2015-01-01",
			"daysOfTrip":20,
			"travelPace":1,
			"poiCategoryPreferences":[
			50,
			50,
			20,
			70,
			10
			],
			"travelers":{
			"adults":2,
			"teenage":1,
			"kids":1
			},
			"originAddress":"Seattle",
			"destinationAddress":"San Diego",
			"bypassCities":[
			],
			"hotelPreferences":{
			"stars":[
			]
			},
			"route":{
			},
			"dbgTrace":{
			}
			}
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(body);
		}
	}); */
	//Model Test
	/* User */
	// new User({
				// username: 'test03',
				// password: '123456',
				// name: {first: 'hello',
						// last: 'world'},
				// birthday: '1990-05-31',
				// occupations: ['test'],
				// citizenships: ['test1'],
				// email: 'test03@gmail.com',
				// phone: '000.000.0003',
				// introduction: 'Hello World!',
				// following: [],
				// status: 0,
			// })
	// .save(function(err, user){
		// if(err){
			// return next(err)
		// }
		// res.json(user);
	// });
	// User.update({}, {$set: {photo: 'img/userphoto_default.jpg'}},{multi: true},function(err, tank){
		// res.json(tank);
	// });
	// User.findOne()
		// .populate({
			// path: 'following',
			// populate: {
				// path: 'following'
			// }
		// })
		// .exec(function(err, users){
			// res.json(users.following[0].following.following);
		// });
	/* Photo */
	/* new Photo({
		//?
		creator: '57ffee6cd68927c81b853eb4',
		title: 'first photo',
		url: 'first photo',
		//date: {type: Date, default: Date.now, required: true},
		geo: '21.02121,21.212',
		description: 'this is my first photo',
		tags: [],
		genres: [],
		//totalviews: {type: Number,required: true},
		likes: [],
		// comments: [{
					// madeby: {type: ObjectId, ref: 'User', required: true},
					// date: {type: Date, default: Date.now, required: true},
					// to: {type: ObjectId, ref: 'User'},
					// comment: {type: String, required: true},
					// status: {type: Number, required: true}
					// }]	
				})
		.save(function(err, photo){
			if(err) return next(err);
			res.json(photo);
		}); */
	/* Photo.update({},{$push: {comments: {
										//madeby: '57ffeeca5e0ac1c824aea73f',
										//date: {type: Date, default: Date.now, required: true},
										//to: {type: ObjectId, ref: 'User'},
										comment: 'abcdefty',
										status: 0
										}}},function(err,tank){
											res.json(tank);
										}); */
	// Photo.findOne({})
		// .populate({
			// path: 'comments',
			// populate: {
				// path: 'madeby',
			// }
		// })
		// .exec(function(err,data){
			// res.json(data.comments[1]);
		// });
	//res.render('test/exif');
});
//end of test

//Home Page
router.get('/', function(req, res, next) {
	if(req.isAuthenticated()){
		console.log(req.user)
		res.render('index', {user: req.user});
	}
	else
		res.render('index', {user: ""});
});

//Sign Up    
router.route('/signup')
	.get(function(req,res,next){
		res.render('test/signup');
	})
	.post(function(req,res,next){
		req.body['name'] = {
			first: req.body.first_name,
			last: req.body.last_name
		}
		new User(
			req.body
		).save(function(err, user){
			if(err)
				return next(err);
			else
				res.redirect('/');
		});
	});

//Sign In
router.route('/signin')
	.get(function(req,res,next){
		res.render('test/signin');
	})
	.post(function(req,res,next){
		console.log(req.body);
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
			  // Display message without using flash option
			  // re-render the login form with a message
			  return res.json({ message: info.message});
			}
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
			  return res.json({ message: 'success'});
			});
		})(req, res, next);
	});

//Sign Out
router.get('/signout', function(req, res){
	req.logout();
	res.redirect('/');
});

//Get Profile
router.get('/getprofile', function(req, res, next) {
	if(req.isAuthenticated())
		User.findById(req.user._id, function(err, user){
			if(err) return next(err);
			else res.json(user);
		});
	else
		res.redirect('/');
});

//Update Password
router.route('/updatepassword')
	.get(function(req,res,next){
		res.render('test/updatepassword');
	})
	.post(function(req,res,next){
		if(req.isAuthenticated()){
			User.findOneAndUpdate({_id: req.user._id}, {$set: {password: req.body.password}}, function(err,tank){
				if(err)
					return next(err);
				else{
					res.json({ message: 'success'});
				}
			});
		}else
			res.redirect('/signin');
	});

//Update Profile
router.route('/updateprofile')
	.post(function(req,res,next){
		if(req.isAuthenticated()){
			console.log(req.user._id);
			console.log(req.body);
			User.update({_id: req.user._id}, {$set: req.body}, function(err,tank){
				if(err)
					return next(err);
				else
					res.json({message: 'success'});
			});
		}else
			res.redirect('/signin');
	});

//Photo Upload Photo
router.route("/uploadphoto")
	.post(function(req, res, next){
		if(req.isAuthenticated()){
		  //生成multiparty对象，并配置上传目标路径
			var form = new multiparty.Form({uploadDir: './public/files/'});
		  //上传完成后处理
		  form.parse(req, function(err, fields, files) {
			var filesTmp = JSON.stringify(files,null,2);

			if(err){
			  console.log('parse error: ' + err);
			  res.json({error: 'error!!!!'});
			}else{
				//console.log(fields);
				new Photo({
					creator: req.user._id,
					title: fields['title'][0],
					url: "files/"+files.inputFile[0].path.split('\\').slice(-1)[0],
					//date_created: new Date(),
					geo: fields['geo'][0],
					description: fields['description'][0],
					//tags
					tags: fields['tags'][0].split(','),
					//like: [ObjectId],
					// authority: 0,
					// priority: 0,
					// status: 0
				}).save(function(err,data){
					console.log(data);
					res.json("success");
				});
				
				/*
				console.log('parse files: ' + filesTmp);
				var myarray = files.inputFile[0].path.split('\\');
				console.log(myarray.slice(-1)[0]);
				console.log(fields['title'][0]);
				console.log(fields['geo'][0]);
				console.log(fields['genres'][0].split(','));
				console.log(fields['description'][0]); 
				console.log(req.user.id); 
				
				
				res.json({});
				*/
			  /*
			  var inputFile = files.inputFile[0];
			  var uploadedPath = inputFile.path;
			  var dstPath = './public/files/' + inputFile.originalFilename;
			  //重命名为真实文件名
			  fs.rename(uploadedPath, dstPath, function(err) {
				if(err){
				  console.log('rename error: ' + err);
				} else {
				  console.log('rename ok');
				}
			  });
			  */
			}
			// res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
			// res.write('received upload:\n\n');
			// res.end(util.inspect({fields: fields, files: filesTmp}));
			});
		}else
			res.redirect('/');
		
});
	
//Get Photo Details
router.route('/getphotodetails')
	.get(function(req,res,next){
		Photo.findById(req.query.id)
			.populate('creator', '_id name photo')
			.populate('comments.madeby', '_id name photo')
			.exec(function(err,photo){
				if(err)
					return next(err);
				else{
					Photo.findOneAndUpdate({_id: req.query.id}, {$set:{totalviews: photo.totalviews+1}}, function(err, tank){
						console.log(photo);
						res.json(photo);
					});
				}
			});
	});
	
//Like Photo
router.route('/likephoto')
	.get(function(req,res,next){
		if(req.isAuthenticated())
			Photo.findById(req.query.id,function(err,photo){
				if(photo.likes.indexOf(req.user._id) < 0)
					photo.update({$push:{likes: req.user._id}},function(err,tank){
						res.json({message: 'success'});
					});
				else
					photo.update({$pull:{likes: req.user._id}},function(err,tank){
						res.json({message: 'success'});
					});
			});			
		else
			res.redirect('/signin');
	});

//Make Comment
router.route('/makecomment')
	.get(function(req,res,next){
		res.render('test/makecomment');
	})
	.post(function(req,res,next){
		if(req.isAuthenticated())
			Photo.findOneAndUpdate({_id: req.body.id},{$push: {comments: {madeby: req.user._id, comment: req.body.comment}}}, function(err,tank){
				res.json(tank);
			});
		else
			res.json('signin');
	});

//check uniqueness of username, email & phone
router.route('/checkavaliability')
	.get(function(req,res,next){
		User.find(req.query, function(err,users){
			if(err) return next(err);
			else{
				if(users.length == 0){
					return res.end(res.writeHead(200, 'OK'));
				}else{
					return res.end(res.writeHead(400, 'Existed! Please input another one!'));
				}
			}
		});
	});

//Search
router.get('/search', function(req, res, next){
	//console.log(req.query.search);
	Photo.find({title: { "$regex": req.query.search, "$options": "i" }, status : 0})
		.limit(parseInt(req.query.limit))
		.exec(function (err, data) {
			if(err) return handleError(err);
			res.json(data);
		});
});
//End of Re-engineering Oct 2016

//Paginate Search
router.route('/paginate_search')
	.get(function(req,res,next){
		Photo.find({title: { "$regex": req.query.search, "$options": "i" }, status : 0})
			.limit(parseInt(req.query.perpage))
			.skip(parseInt(req.query.perpage * req.query.page))
			.exec(function(err,data){
				if(err) 
					return handleError(err);
				else
					res.json(data);
			});
	});

//Make Comment
router.route('/islogin')
	.get(function(req,res,next){
		if(req.isAuthenticated())
			res.json(1);
		else
			res.json(0);
	});

//Test upload
router.route("/test_upload")
	.get(function(req, res, next){
		res.render('test/test_upload');
	})
	.post(function(req, res, next){
		console.log(1);
		//生成multiparty对象，并配置上传目标路径
		var form = new multiparty.Form({uploadDir: './public/files/'});
		//上传完成后处理
		form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);

		if(err){
			console.log('parse error: ' + err);
			res.json({error: 'error!!!!'});
		}else{
			console.log(fields);

			/*
			console.log('parse files: ' + filesTmp);
			var myarray = files.inputFile[0].path.split('\\');
			console.log(myarray.slice(-1)[0]);
			console.log(fields['title'][0]);
			console.log(fields['geo'][0]);
			console.log(fields['genres'][0].split(','));
			console.log(fields['description'][0]); 
			console.log(req.user.id); 
			
			
			res.json({});
			*/
			/*
			var inputFile = files.inputFile[0];
			var uploadedPath = inputFile.path;
			var dstPath = './public/files/' + inputFile.originalFilename;
			//重命名为真实文件名
			fs.rename(uploadedPath, dstPath, function(err) {
			if(err){
				console.log('rename error: ' + err);
			} else {
				console.log('rename ok');
			}
			});
			*/
		}
		// res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
		// res.write('received upload:\n\n');
		// res.end(util.inspect({fields: fields, files: filesTmp}));
		});

});	
	
	
module.exports = router;
