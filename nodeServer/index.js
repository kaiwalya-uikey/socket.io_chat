// Node server which will handle socket io connections
const io = require('socket.io')(8000) // socket.io module jo humne install kiya hai and 8000 is port

const users = {};  // jitne users connected hai unke liye

io.on('connection', socket =>{  // io.on ek instance hai jo ki listen karta hai events ko koi bhi join karega to 
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ //jab bhi koi particular connection ke saath kuch hoga to us connection
        //  ke saath kya karna that is handled by socket.on
        //    console.log("new billioniare ", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);// jab bhi koi user join karega to monty joined baaki sabko msg bhej do
    });

    // broadcasting msg
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})// jo msg send kar raha hai wo sabko bhej do
    });

     
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]); // agar koi banda chat chodke jaa raha hai to disconnect kaa msg sabko bhej do
        delete users[socket.id];// users list se bhi usko nikaal do jo left hua hai chat
    });


})