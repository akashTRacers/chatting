var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express=require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/chat");
require('./models/user');
require('./models/list');
require('./models/room');
require('./models/message');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'shsh' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
var List=mongoose.model('List');
var User=mongoose.model('User');
var Room=mongoose.model('Room');
var Message=mongoose.model('Message');

require('./config/passport')(passport);

require('./controllers/index.js')(app);
require('./controllers/user.js')(app);
require('./controllers/chat.js')(app);
var users={};
require('./sockets/chatting.js')(io,users);








 http.listen(3000, function(){
  console.log('listening on *:3000');
});