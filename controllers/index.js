var mongoose = require('mongoose');
// require('../models/user');
var user= mongoose.model('User');
module.exports = function(app){
	app.get('/', function(req, res){ 
	  res.render('index',{user:req.user});
	});


}