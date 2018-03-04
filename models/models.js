var mongoose = require("mongoose");
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

//User
var userSchema = new Schema({
	username: {type: String, minlength: 6, maxlength: 20, unique: [true, 'username exist'], required: true},
	//hash
	password: {type: String, minlength: 6, maxlength: 20, required: true},
	name: {first: {type: String, required: true},
			last: {type: String, required: true}},
	birthday: {type: Date, required: true},
	occupations: {type: String},
	citizenships: {type: String},
	//valify when active
	email: {type: String, unique: true, required: true},
	phone: {type: String, unique: true, required: true},
	//format
	introduction: {type: String},
	photo: {type: String, default: 'img/userphoto_default.jpg', required: true},
	following: [{type: ObjectId, ref: 'User',unique: true}],
	status: {type: Number, default: 0, required: true}
});

//Message
var messageSchema = new Schema({
	from: {type: ObjectId, ref: 'User', required: true},
	to: {type: ObjectId, ref: 'User', required: true},
	date: {type: ObjectId, default: Date.now, required: true},
	message: {type: String},
	status: {type: Number, default: 0, required: true}
});

//Photo
var photoSchema = new Schema({
	creator: {type: ObjectId, ref: 'User', required: true},
	album: [{type: ObjectId, ref: 'Album'}],
	title: {type: String, required: true},
	url: {type: String, required: true},
	date: {type: Date, default: Date.now, required: true},
	geo: {type: String, required: true},
	description: {type: String},
	tags: [{type: String}],
	genres: [{type: String}],
	totalviews: {type: Number, default: 0, required: true},
	likes: [{type: ObjectId, ref: 'User'}],
	comments: [{
				madeby: {type: ObjectId, ref: 'User', required: true},
				date: {type: Date, default: Date.now, required: true},
				to: {type: ObjectId, ref: 'User'},
				comment: {type: String, required: true},
				status: {type: Number, default: 0, required: true}
				}],
	status: {type: Number, default: 0, required: true}
});


//Album necessary?
var albumSchema = new Schema({
	//redundant?
	creator: {type: ObjectId, ref: 'User', required: true},
	photos: [{type: ObjectId, ref: 'Photo'}],
	title: {type: String, required: true},
	date: {type: Date, default: Date.now,required: true},
	description: {type: String},
	//tags: [String],
	//authority: Number,
	//priority: Number,
	status: {type: Number, default: 0, required: true}
});

exports.User = mongoose.model('User', userSchema);
exports.Photo = mongoose.model('Photo', photoSchema);
exports.Message = mongoose.model('Message', messageSchema);

//Test
var test1Schema = new Schema({
	name: String,
	followed: [{type: ObjectId, ref: 'test2'}]
});

var test2Schema = new Schema({
	name: String,
	following: [{type: ObjectId, ref: 'test1'}]
});
//End of Test
exports.Test1 = mongoose.model('test1', test1Schema);
exports.Test2 = mongoose.model('test2', test2Schema);
//end of test