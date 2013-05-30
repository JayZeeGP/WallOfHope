//Create a Client module to use.
(function () {
  var canVote = true;
  var voteMinutes = 2;
  window.Client = {
    socket : null,
    
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      //Send message on button click
      $('#send').click(function() {
        Client.send();
      });

      //Process any incoming messages
      this.socket.on('new', this.add);
      this.socket.on('changeUserNo', this.changeNumberOfUsers);
    },

    //Adds a new message to the Board.
    add : function(data) {
      var msg = $('<div class="sticky" id="sticky-'+data.color+'">')
        .append('<div class="sticky-text" id="sticky-text-yellow">Before I die I want to... ' + data.msg)
        .append('<input id="plus" type="button" value="+" onclick="Client.addLife('+ data.id +');" />')
        .append('<input id="minus" type="button" value="-" onclick="Client.takeLife('+ data.id +');" />')        
        .append('</div><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script><a href="https://twitter.com/intent/tweet?text=%23BeforeIDieIWantTo '+data.msg+' via @TheWallOfHope" alt="Tweet" id="twitter"><img src="twitter.png" height="28px" alt="Tweet"/></a></div>');

      $('#stickies')
        .prepend(msg)
        .animate({scrollTop: $('#stickies').prop('scrollHeight')}, 0);
        $.getScript("http://platform.twitter.com/widgets.js");
    },

    //Adds life to a message
    addLife : function(id) {
      if(canVote){
        this.socket.emit('addLife',id);
        canVote = false;
        setTimeout(function(){canVote = true;},60000*voteMinutes);
      }else{
        alert("You can just vote once every "+ voteMinutes +" minutes");
      }
    },

    //Takes life from a message
    takeLife : function(id) {
      if(canVote){
        this.socket.emit('takeLife',id);
        canVote = false;
        setTimeout(function(){canVote = true;},60000*voteMinutes);
      }else{
        alert("You can just vote once every "+ voteMinutes +" minutes");
      }
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