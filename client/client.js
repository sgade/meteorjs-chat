<<<<<<< HEAD
if (Meteor.isClient) {
    Meteor.subscribe("messages");
    
    var messages = Messages.find(
        {"time": {$gt: new Date().getTime()}}
    );
    
    function scroll() {
        $('.history').stop().animate({ scrollTop: $(".history")[0].scrollHeight }, 800);
    }
    
    
    messages.observe({
        added: function () {
            scroll();
        }
    });
    
  
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_ONLY'
    });

    
    Template.chat.time = function () {
        var time = new Date().getTime();
        return getTimeStampFromTime(time);
    };
    Template.chat.username = function () {
        return Session.get("username");
    };
    Template.chat.messages = function () {
        var sort = {
            sort: {
                time: 1
            }
        };
        return messages;
    };

    Template.chat.events({
        'click .confirm': function () {
            
            var username = Meteor.user().username;
            var message = $(".input-message").val();
            Messages.insert({
                'time': new Date().getTime(),
                'username': username,
                'message': message,
            });

            $(".input input").val("");
        },
        'keyup .input input': function () {
            var input = $(".input input").val();
            $(".confirm").attr('disabled', (input === ""));

            if (event.which == 13) { // enter 
                $(".confirm").click();
            }
        },
    });

    Template.message.time = function () {
        return getTimeStampFromTime(this.time);
    };
    
   Template.chat.rendered = function(){
        $(".time").hide();
        $(".message").mouseenter(function() {
            $(this).children(".time").show(10);
        }).mouseleave(function() {
            $(this).children(".time").hide(10);
        });
        
    }
}
=======
if ( Meteor.isClient )
{
  /* **************************************************
   * Account UI Preferences
   * **************************************************
   * */
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });
  /* **************************************************
   * Collection subscriptions
   * **************************************************
   * */
  Meteor.autosubscribe(function() {
    Meteor.subscribe("messages");
  });

  /* **************************************************
   * Template: General UI
   * **************************************************
   * */
  Template.ui.connectionStatus = function() {
    return Meteor.status().status;
  };
  // events
  Template.ui.events({
    'click .connection-status': function() {
      if ( !Meteor.status().connected )
        Meteor.reconnect();
    },
  });

  /* **************************************************
   * Template: Users List
   * **************************************************
   * */
  Template.usersOnline.usersCount = function() {
    return Meteor.users.find({}).count();
  };
  Template.usersOnline.users = function() {
    return Meteor.users.find({}).fetch();
  };

  /* **************************************************
   * Template: Messages, Chat
   * **************************************************
   * */
  Template.chat.messages = function() {
    return Messages.find({}).fetch();
  };
  // events
  Template.chat.events({
    'keyup #input-chat': function(event) {
      if ( event.which == 13 ) // Enter
        $("#button-confirm").click();
    },
    'click #button-confirm': function() {
      var text = $("#input-chat").val();
      if ( text != "" )
      {
        msg(text);
        $("#input-chat").val("");
      }
    },
  });
  // render
  Template.chat.rendered = function() {
    scrollMessagesToBottom();
  };

  /* **************************************************
   * Template: Messages
   * **************************************************
   * */
  Template.message.username = function() {
    return getUserNameById(this.userId);
  };
  Template.message.text = function() {
    return this.text;
  };
  Template.message.time = function() {
    return getTimeStampFromTime(this.time);
  };
}
>>>>>>> "Version 2.0" Complete rewritten. Taken tips from bigteddy.
