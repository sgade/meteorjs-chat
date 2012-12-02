if ( Meteor.isServer )
{
	Meteor.startup(function() {
	  	// code to run on server at startup
	    Meteor.publish("messages", function() {
	    	return Messages.find({});
	    });

	    Messages.allow({
	    	insert: function(userID, doc) {
	    		if ( doc.username != "" && doc.message != "" )
	    			return true;
	    		return false;
		    },
		    update: function(userId, docs, fields, modifier) {
		      return false;
		    },
		    remove: function(userID, docs) {
		      return false;
		    },
		});

		Messages.insert({
			'time': new Date().getTime(),
			'username': '',
			'message': 'Server started.',
		})
	});
}
