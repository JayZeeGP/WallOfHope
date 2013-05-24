//Create a chat module to use.
(function () {
  window.Chat = {
    socket : null,

    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      //Send message on button click or enter
      $('#send').click(function() {
        Chat.send();
      });

      //Process any incoming messages
      this.socket.on('new', this.add);
      this.socket.on('changeUserNo', this.changeNumberOfUsers);
    },

    //Adds a new message to the chat.
    add : function(data) {
      var msg = $('<div class="sticky" id="sticky-'+data.color+'">')
        .append('<div class="sticky-text" id="sticky-text-yellow">Before I die I want to... ' + data.msg)
        .append('</div><a href="https://twitter.com/share" class="twitter-hashtag-button" data-text="#BeforeIDieIWantTo '+data.msg+' via @TheWallOfHope" data-lang="en" target="_blank">Tweet</a></div>');

      $('#stickies')
        .prepend(msg)
        .animate({scrollTop: $('#stickies').prop('scrollHeight')}, 0);
        $.getScript("http://platform.twitter.com/widgets.js");
    },

    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      if($('#message').val()){
        this.socket.emit('msg', {
          msg: $('#message').val(),
          color: $('input:radio[name=color]:checked').val()
        });

        $('#message').val('');
        $('#message').focus();
      }
    },

    //Changes the number of users
    changeNumberOfUsers : function(number) {
      $('#counter').html("There are "+number+" motivators online");
    }
  };
}());