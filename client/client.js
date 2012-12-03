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