if ( Meteor.isServer )
{
	Meteor.startup(function() {
	  	// code to run on server at startup
        
        // add welcome message
        Messages.remove({});
        var message = {
            'time': new Date().getTime(),
            'user': "SERVER",
            'text': 'Server started. Have fun.'
        };
        Messages.insert(message);

	  	Meteor.publish("messages", function() {
	  		return Messages.find({});
	  	});

	  	Accounts.validateNewUser(function(user) {
	  		if ( user.username && user.username.length >= 3 && user.username != "SERVER" )
	  		{
	  			// Password length is checked automatically
	  			return true;
	  		}
	  		else
	  			throw new Meteor.Error(403, "Username must have at least 3 characters.");

	  		return false;
	  	});

	  	Messages.allow({
	  		insert: function(userId, doc) {
	  			if ( doc.time && doc.user && doc.text )
	  			{
	  				if ( doc.user != SERVER_USERID )
	  					return true;
	  				else
	  					throw new Meteor.Error(403, "Haha. You are not the server.");
	  			}
	  			else
	  				throw new Meteor.Error(403, "Incomplete message.");

	  			return false;
	  		},
	  		update: function() {
	  			return false;
	  		},
	  		remove: function() {
	  			return false;
	  		},
	  	});
	});
}
