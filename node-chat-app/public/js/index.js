var socket = io();

function scrollToBottom(){
    //selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');


    //heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    console.log('connected to server');
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');

    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

});

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template,{
        from:message.from,
        url: message.url,
        createdAt:formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
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
