var mongoose = require('mongoose');
var User=mongoose.model('User');
var passport = require('passport');
module.exports = function(app){
	  

	app.get('/signup',function(req,res){
	  if(!req.user)
	    res.render('signup',{user:req.user});
	  else
	    res.redirect('/');
	});


	app.get('/login',function(req,res){
	  if(!req.user)
	    res.render('login',{user:req.user});
	  else
	    res.redirect('/');
	});

	app.post('/login', function(req, res, next) {
	  passport.authenticate('local', function(err,user, info) {
	    if (err)
	     return next(err); 
	    if (!user) {
	      req.flash('info','sorry information is not correct'); 
	      return res.redirect('/')
	    }
	    req.logIn(user, function(err, info) {
	      if (err) 
	        return next(err);
	      // console.log(JSON.stringify(req.user));
	      req.flash('info','Hey '+ user.username +' Logged In Successfully!!');
	      return res.redirect('/'); 
	    });
	  })(req, res, next);
	});
	app.post('/signup', function(req, res) {
	  var user = new User();
	  user.username=req.body.username;
	  user.email=req.body.email;
	  user.password=req.body.password;
	  user.save(function(err,docs) {
	    req.logIn(user, function(err,success) {
	      console.log(req.user);
	      req.flash('success','Hello '+ user.username +' Welcome to CareForYou!!');
	      return res.redirect('/');
	    });
	  });
	});


	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
}