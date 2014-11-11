var socket = io();

var form = $('#room form');
var ul = $('#room ul.messages');
var ol = $('#room ol');

form.submit(function () {
    var input = $(this).find(':input');
    var text = input.val();
    input.val('');

    socket.emit('message', text);

    return false;
});

socket
    .on('message', function(login, text) {
        addMessage(login, text, ul);
    })
    .on('participants', function(participants) {
        reDrawParticipants(participants, ol);
    })
;

function reDrawParticipants(participants, ol) {
    var participantsHtml = '';
    for(var i = 0; i < participants.length; i++) {
        participantsHtml += '<li>' + participants[i] + '</li>';
    }
    ol.html(participantsHtml);
}

function addMessage(login, text, ul) {
    var messageTemplate = $("#message-template").html();
    var compiledMessageTemplate = Handlebars.compile(messageTemplate);
    var context = {login: login, text: text};
    var message = compiledMessageTemplate(context);
    ul.prepend(message);
}