
var LocalStrategy = require('passport-local').Strategy;
var mongoose=require("mongoose");
var User=mongoose.model('User');
module.exports=function(passport){
	passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user, error) {
    if (err)
     return done(err);
    if (!user){
      //req.flash('error','sorry incorrect username ');
      return done(null, false, { messages: 'Incorrect username.' });
    }
    user.comparePassword(password, function(err, isMatch, error) {
      if (isMatch) {
        return done(null, user);
      } else {
        //req.flash('error','sorry incorrect password ');
        return done(null, false, { messages: 'Incorrect password.' });
      }
    });
  });

}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

}