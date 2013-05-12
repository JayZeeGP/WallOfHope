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

      $('#message').keyup(function(evt) {
        if ((evt.keyCode || evt.which) == 13) {
          Chat.send();
          return false;
        }
      });

      //Process any incoming messages
      this.socket.on('new', this.add);
    },

    //Adds a new message to the chat.
    add : function(data) {
      //var name = data.name || 'anonymous';
      //var msg = $('<div class="msg"></div>')
        //.append('<span class="name">' + name + '</span>: ')
        //.append('<span class="text">' + data.msg + '</span>');
        
    	var color = 'yellow'; //Hay que capturar el color y asignarlo aquí
    	
      	var msg = $('<div class="sticky" id="sticky-'+color+'" onClick="showMenu();">')
        .append('<div class="sticky-text">Before I die I want to... ' + data.msg)
        .append('</div></div>');
            
      $('#stickies')
        .append(msg)
        .animate({scrollTop: $('#stickies').prop('scrollHeight')}, 0);
    },

    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      this.socket.emit('msg', {
        //name: $('#name').val(),
        msg: $('#message').val()
      });

      $('#message').val('');
    }
  };
}());