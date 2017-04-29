if (Meteor.isServer) {
    function _msg_user() {
        return SERVER_USERID;
    }
    
    Meteor.methods({
        createThread(threadName) {
            if (Messages.find({
                thread: {
                    name: threadName
                }
            }).count() <= 0)
                Messages.insert({
                    'time': new Date().getTime(),
                    'user': SERVER_USERID,
                    'text': 'Thread was created.',
                    'thread': {
                        name: threadName
                    }
                });
        }
    });
}