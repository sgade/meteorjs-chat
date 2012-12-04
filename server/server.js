if ( Meteor.isServer )
{
	Meteor.startup(function() {
	  	// code to run on server at startup

	  	Meteor.publish("messages", function() {
	  		return Messages.find({});
	  	});
	  	Meteor.publish("allUserData", function() {
	  		return Meteor.users.find( {}, {
	  			fields: { 'username': 1 },
	  		});
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
	  			if ( doc.time && doc.userId && doc.text )
	  			{
	  				if ( doc.userId != SERVER_USERID )
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
	  	Meteor.users.deny({
	  		update: function() {
	  			return true;
	  		}
	  	})
	});
}
