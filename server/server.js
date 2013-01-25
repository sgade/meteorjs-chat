if (Meteor.isServer) {
    function setOnlineState() {
        Meteor.users.update({}, {
            $set: {
                'profile.online': false
            }
        });
        
        var validLastPing = new Date().getTime() - LASTPING_DELAY;
        Meteor.users.update({
            'profile.lastPing': { 
                $gte: validLastPing
            }
        }, {
           $set: {
               'profile.online': true
           }
        });
    }
    
    Meteor.startup(function () {
        // code to run on server at startup

        // add welcome message
        var message = {
            'time': new Date().getTime(),
            'user': SERVER_USERID,
            'text': 'Server restarted. Have fun.',
            'thread': {
                name: MAIN_THREAD_NAME
            }
        };
        Messages.insert(message);

        Meteor.publish("messages", function () {
            return Messages.find({}, {
                'sort': {
                    'time': 1
                },
                'limit': 200
            });
        });

        Accounts.validateNewUser(function (user) {
            if ( user.username && user.username.length >= 3 && user.username != "SERVER" ) {
                console.log("User " + user.username + " registered.");
                
                // Password length is checked automatically
                return true;
            }
            else
                throw new Meteor.Error(403, "Username must have at least 3 characters.");

            return false;
        });

        Messages.allow({
            insert: function (userId, doc) {
                if ( doc.time && doc.user && doc.text ) {
                    if ( doc.user != SERVER_USERID )
                        return true;
                    else
                        throw new Meteor.Error(403, "Haha. You are not the server.");
                }
                else
                    throw new Meteor.Error(403, "Incomplete message.");

                return false;
            },
            update: function () {
                throw new Meteor.Error(403, "Please do not try to cheat on us. Thanks.");
                return false;
            },
            remove: function () {
                throw new Meteor.Error(403, "Removal not allowed, hacker.");
                return false; // obsolete
            },
        });
		
		Meteor.publish("allUserData", function () {
            return Meteor.users.find( {}, {
                fields: {
                    'username': 1,
                    'profile.online': 1,
                    'profile.currentThread': 1
                }
            });
		});
        
        // clean up online status
        setOnlineState();
    });
    
    Meteor.setInterval(function () {
		setOnlineState();
	}, 10000);
}
