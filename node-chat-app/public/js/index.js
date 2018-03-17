var socket = io();

socket.on('connect', () => {
    console.log('connected to server');
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) => {
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My location</a>');
    li.text(`${message.from}: `);
    a.attr('href',`${message.url}`);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#new-message').on('submit', function(e) {
    e.preventDefault();
    const messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    });
});

const sendLocationButton = jQuery('#send-location');
sendLocationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Your browser does not support geolocation.')
    }

    sendLocationButton.attr('disabled','disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        sendLocationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('Unable to fetch location');
        sendLocationButton.removeAttr('disabled').text('Send location');
    })
});
