/* **************************************************
 * General functions
 * **************************************************
 * */

var MAIN_THREAD_NAME = "main";
 
// Returns "digit" numbers ( 0->00, 9->09, 10->10, ...)
function makeDigit(string) {
  if ( string < 10 || string.length < 2 )
    string = "0" + string;
  return string;
}
// Returns the time stamp of the time in 
function getTimeStampFromTime(time) {
    var date = new Date(time);
    var string = "";

    var currDate = new Date();
    // if it is not the same day, we include the date of course
    if ( date.getYear() != currDate.getYear() && date.getMonth() != currDate.getMonth() && date.getDay() != currDate.getDay() )
    {
        string += makeDigit(date.getDate());
        string += "." + makeDigit(date.getMonth());
        string += "." + date.getYear();
        // append space so the time is neatly aligned
        string += " ";
    }

    string += makeDigit(date.getHours());
    string += ":" + makeDigit(date.getMinutes());
    string += ":" + makeDigit(date.getSeconds());

    return string;
}

/* **************************************************
 * Collections
 * **************************************************
 * */
// Messages
var Messages = new Meteor.Collection("messages");
var SERVER_USERID = "_";

function getUserById(id) {
    var users = Meteor.users.find({}).fetch();
    for ( var i = 0; i < users.length; i++ ) {
        if ( users[i]._id == id )
            return users[i];
    }
    
    return null;
}
function getUsernameById(id) {
    var user = getUserById(id);
    if ( user != null )
        return user.username;
    return null;
}

/* **************************************************
 * Stubs
 * **************************************************
 * */
function msg(text, thread)
{
  var message = {
    'time': new Date().getTime(), // time
    'user': Meteor.user()._id, // user id
    'text': text, // text
    'thread': { name: thread } // thread object
  };
  Messages.insert(message);
}
