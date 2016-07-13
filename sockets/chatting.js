var mongoose = require('mongoose');
var Message= mongoose.model('Message');
var Room=mongoose.model('Room');
module.exports = function(io,users){
	
io.on('connection', function(socket){ 
  

  socket.on("user",function(_id,name){
    console.log("socket",_id);
   users[socket.id]={id:_id,userName:name};
	});
  


  socket.on('chatMessage', function(_id,from,msg){
    var query=Room.findById(_id);
    query.exec(function(err,room){
      if(err)
        return next(err);
      if(!room) 
        return next(new Error('cant found the given room'));
      var message=new Message();
      message.senderName=from;
      message.message=msg;
      message.room=_id;   
      message.save(function(err,message)
      {
        if (err) {return err;}
        console.log(JSON.stringify(message._id));
      });
    });
  	for(var i in users)
  	{
        if (users[i].id==_id) 
        {
          console.log(i," ",users[i]);
          socket.broadcast.to(i).emit('chatMessage',from, msg);
  			}
  		}  
  });


  socket.on('logout',function(){
    for(var i in users)
      if(users[i].userName==users[socket.id].userName)
      {
        console.log("running");
        socket.broadcast.to(i).emit("sessionEnd");
        // delete users[i];
      }
  });
  
  socket.on('disconnect',function(){
    console.log("disconnect",socket.id);
    delete users[socket.id];
    for(var i in users){
      console.log(i," ",users[i]);
    }
  });
  // socket.on('notifyUser', function(){
  //   io.emit('notifyUser', req.user2); 
  // });
});
}