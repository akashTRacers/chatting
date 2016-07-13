var mongoose = require('mongoose');
var Message= mongoose.model('Message');
var Room=mongoose.model('Room');
var User=mongoose.model('User');
module.exports = function(app){
	app.get('/chatters',function(req,res,next){
	  if(req.user)
	  {
	    User.find({},{"username":true,"_id":false},function(err,docs){
	      if (err) {
	        return next(err);
	      }
	      console.log(docs);
	      return res.render('chatters',{listUser:docs,user:req.user });
	    });
	  }
	  else
	  {
	    return res.redirect('/');
	  }
	});


	app.param('user1',function(req,res,next,user1){
	    req.user1=user1;
	    return next();
	});

	app.param('user2',function(req,res,next,user2)
	{
	    req.user2=user2;
	    return next();
	});
	app.get('/user1/:user1/user2/:user2',function(req,res,next)
	{
	  var flag=0;
	  Room.find(function(err,docs)
	  {
	    if(err)
	      return next(err);
	    for(var i=0;i<docs.length;i++)
	    {
	      if((docs[i].user1==req.user1 || docs[i].user1==req.user2 )&& (docs[i].user2==req.user1 || docs[i].user2==req.user2))
	      {
	        flag=1;
	        var ur='/chat/'+docs[i]._id+'/';
	        return res.redirect(ur);
	      }
	    }
	    if(!flag)
	    {
	      var room=new Room();
	      room.user1=req.user1;
	      room.user2=req.user2;
	      room.save(function(err,docs)
	      {
	        if (err)
	        {
	          next(err);
	        }
	        var ur='/chat/'+docs._id+'/';
	        return res.redirect(ur);
	      });
	    }    
	  });
	});


	app.param('chat',function(req,res,next,chat){
	  req.chat=chat;
	  return next();
	});


	app.get('/chat/:chat',function(req,res,next)
	{
	  if(req.user){
	    Message.find({"room":req.chat},function(err,messages)
	    {
	      if(err)
	        return next(err);
	      // console.log(JSON.stringify(messages));
	      return res.render('chat',{user:req.user,id:req.chat,message:messages});
	    }).sort({"date":1})
	  }
	  else {
	    return res.redirect('/');
	  }
	})

}