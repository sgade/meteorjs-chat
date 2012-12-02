if (Meteor.isClient) {
  Meteor.subscribe("messages");

  Template.chat.time = function() {
    var time = new Date().getTime();
    return getTimeStampFromTime(time);
  };
  Template.chat.username = function() {
    return Session.get("username");
  };
  Template.chat.messages = function() {
    var sort = { sort: { time: -1 } };
    return Messages.find({}, sort);
  };

  Template.chat.events({
    'click .confirm': function() {
      if ( !Template.chat.username() )
      {
        var username = $(".input-username").val();
        Session.set("username", username);
      }
      else
      {
        var username = Session.get("username");
        var message = $(".input-message").val();
        Messages.insert({
          'time': new Date().getTime(),
          'username': username,
          'message': message,
        });
      }

      $(".input input").val("");
    },
    'keyup .input input': function() {
      var input = $(".input input").val();
      $(".confirm").attr('disabled', ( input == "" ) );

      if ( event.which == 13 ) // enter
      {
        $(".confirm").click();
      }
    },
  });

  Template.message.time = function() {
    return getTimeStampFromTime(this.time);
  };
}
