if (Meteor.isClient) {

    Session.set("currentThread", MAIN_THREAD_NAME);

    var Router = Backbone.Router.extend({
        routes: {
            "": "main",
            ":thread": "thread"
        },
        main: function () {
		    Session.set("currentThread", MAIN_THREAD_NAME);
        },
        thread: function (threadName) {
            Meteor.call("createThread", threadName);
            Session.set("currentThread", threadName);
        }
    });

    ThreadRouter = new Router;

    Meteor.startup(function () {
        Backbone.history.start({
            pushState: true
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
            if (!Meteor.status().connected) Meteor.reconnect();
        },
    });

    /* **************************************************
     * Template: Messages
     * **************************************************
     * */
    Template.chat.messages = function () {
        return Messages.find({
            thread: {
                name: Session.get("currentThread")
            }
        }).fetch();
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
        },
        
        'keyup #input-thread': function(event) {
            if ( event.which == 13 ) // Enter
                $("#button-confirm-thread").click();
        },
        'click #button-confirm-thread': function(event) {
			var threadName = $("#input-thread").val();
            if ( threadName != "" )
            {
                ThreadRouter.navigate(threadName);
                $("#input-thread").val("");
            }
		},
    });
    // render
    Template.chat.rendered = function () {
        scrollMessagesToBottom();
    };
    
    /* **************************************************
     * Template: Message
     * **************************************************
     * */
    Template.message.username = function () {
        return this.user.username;
    };
    Template.message.text = function () {
        return this.text;
    };
    Template.message.byServer = function () {
        return this.user.username == null;
    };
    Template.message.time = function () {
        return getTimeStampFromTime(this.time);
    };
    
    /* **************************************************
     * Template: Threads
     * **************************************************
     * */
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
                if ( searchThread.name === message.thread.name )
                    contains = true;
            })
            if ( !contains )
                threads.push(message.thread)
        })

        return threads;
    };

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
	
	Template.thread.events({
		'click .thread-link': function() {
			var threadName = $(event.target).attr("data-thread-name");
			ThreadRouter.navigate(threadName);
            
            return false;
		}
	});
}
