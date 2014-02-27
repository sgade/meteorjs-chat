if (Meteor.isClient) {
    // Set the users' current thread
    Session.set("currentThread", MAIN_THREAD_NAME);

    // set the routes (that define the current thread)
    var Router = Backbone.Router.extend({
        routes: {
            "": "main",
            ":thread": "thread"
        },
        main: function () {
		    this.navigate(MAIN_THREAD_NAME);
        },
        thread: function (threadName) {
            Meteor.call("createThread", threadName);
            Session.set("currentThread", threadName);
						Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.currentThread': threadName, 'profile.lastPing': new Date().getTime()}});
        }
    });
    
    ThreadRouter = new Router;

    Meteor.startup(function () {
        Backbone.history.start({
            pushState: true
        });
        
		Meteor.autosubscribe(function() {
			Meteor.subscribe("allUserData");
			Messages.find().observe({
				added: function(item) {
					if (Meteor.user() != null) {
						//scrollMessagesToBottom();
						if (item.thread.name == Session.get("currentThread")){
							if (item.user != Meteor.user()._id &&
					      	item.time + 3000 > new Date().getTime()) {
										playMessageReceivedSound();
							}
						}
					}
				},
			});
		});
        
		soundManager.setup({
		  url: '/swf/',
		  flashVersion: 9,
		  onready: function() {
			  mySound = soundManager.createSound({
			    id: 'notification',
			    url: '/sounds/notify.mp3',
			    autoLoad: true,
				volume: 50
			  });
		  }
		});
    });


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
    Meteor.autosubscribe(function () {
        Meteor.subscribe("messages");
    });

    /* **************************************************
     * Template: General UI
     * **************************************************
     * */
    Template.ui.connectionStatus = function () {
        return Meteor.status().status;
    };
    // events
    Template.ui.events({
        'click .connection-status': function () {
            if (!Meteor.status().connected)
                Meteor.reconnect();
        },
    });

    /* **************************************************
     * Template: Messages
     * **************************************************
     * */
    Template.chat.noMessages = function() {
        return ( Template.chat.messages().length == 0 );
    };
    Template.chat.messages = function () {
        return Messages.find({
            thread: {
                name: Session.get("currentThread")
            }
        }, {limit: 200}).fetch();
    };

    // events
    Template.chat.events({
        'keyup #input-chat': function (event) {
            if ( event.which == 13 ) // Enter
                $("#button-sendMessage").click();
        },
        'click #button-sendMessage': function () {
            var text = $("#input-chat").val();
            if (text != "") {
                msg(text, Session.get("currentThread"));
                $("#input-chat").val("");
            }
        }
    });

    
    /* **************************************************
     * Template: Message
     * **************************************************
     * */
    Template.message.username = function () {
        //return this.user.username;
        return getUsernameById(this.user);
    };
    Template.message.text = function () {
        return this.text;
    };
    Template.message.isByServer = function () {
        return ( this.user == SERVER_USERID );
    };
    Template.message.time = function () {
        return getTimeStampFromTime(this.time);
    };
    /* **************************************************
     * Template: Chat
     * **************************************************
     * */
    Template.chat.rendered = function () {
        scrollMessagesToBottom();
    };
    
    /* **************************************************
     * Template: Threads
     * **************************************************
     * */
    Template.threads.noMessages = function() {
        return Template.chat.noMessages();
    };
    Template.threads.threads = function () {
        var threads = [];
        var messages = Messages.find({}, {
            fields: {
                thread: 1
            }
        });
        messages.forEach(function (message) {
            var contains = false;
            _.each(threads, function (searchThread) {
                if (searchThread.name === message.thread.name)
                    contains = true;
            });
            if ( !contains )
                threads.push(message.thread)
        })

        return threads;
    };
    
    Template.threads.onlineUsersString = function() {
        var text = getOnlineUsersCount();
        
        if ( text == 1 )
            text += " user";
        else
            text += " users";
        
		return text;
	}
	
	Template.threads.events({
		'keyup #input-thread': function(event) {
			if ( event.which == 13 ) // Enter
		    	$("#button-confirm-thread").click();
		},
		'click #button-confirm-thread': function(event) {
			var threadName = $("#input-thread").val();
		    if ( threadName !== "" )
		    {
		        $("#input-thread").val("");
		    	ThreadRouter.navigate(threadName);
		    }
		}
	});

    /* **************************************************
     * Template: Thread
     * **************************************************
     * */
    Template.thread.isCurrentThread = function (thread) {
        return Session.equals("currentThread", thread);
    };
	
	Template.thread.formatName = function (name) {
		return decodeURIComponent(name);
	};
    
    Template.thread.url = function(name) {
        // causes reload:
        /* return Meteor.absoluteUrl(name, {
            'secure': true
        }); */
        
        return "#";
    };
        
    Template.thread.onlineUsersCount = function(name) {
        return getOnlineUsersCountThread(name);
    };
	
	Template.thread.events({
		'click .thread-link': function() {
			var threadName = $(event.target).attr("data-thread-name");
			ThreadRouter.navigate(threadName);
  		}
	});
	
	Meteor.setInterval(function () {
        if ( Meteor.user() != null ) {
            Meteor.users.update({
                _id: Meteor.user()._id
            }, {
                $set: {
                    'profile.lastPing': new Date().getTime()
                }
            });
        }
	}, 10000);
}
