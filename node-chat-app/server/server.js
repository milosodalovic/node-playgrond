const path = require('path');
const http = require('http');
const express    = require( 'express' );

const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app    = express();
var server = http.Server(app);

var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('new connection request');

    socket.emit('newMessage', {from: "Admin", text: "Welcome to the chat app"});
    socket.broadcast.emit('newMessage', {from: "Admin", text: "A new user has joined"});

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });

    });

    socket.on('disconnect', () => {
        console.log('client closed connection');
    });

});


app.use(express.static(publicPath));

server.listen( port, () => {
    console.log( `Server is started and listens on port ${port}` );
} );
