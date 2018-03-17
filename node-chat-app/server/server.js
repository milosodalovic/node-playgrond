const path = require('path');
const http = require('http');
const express    = require( 'express' );

const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app    = express();
var server = http.Server(app);

var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('new connection request');

    socket.emit('newMessage', generateMessage("Admin","Welcome to the chat app"));
    socket.broadcast.emit('newMessage', generateMessage("Admin","A new user has joined"));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from,message.text));
        callback('This is from a server.');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('client closed connection');
    });

});


app.use(express.static(publicPath));

server.listen( port, () => {
    console.log( `Server is started and listens on port ${port}` );
} );
