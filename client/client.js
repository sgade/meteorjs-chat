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
    return this.user.username;
  };
  Template.message.text = function() {
    return this.text;
  };
  Template.message.byServer = function() {
	return this.user.username == null;
  };
  Template.message.time = function() {
    return getTimeStampFromTime(this.time);
  };
}
