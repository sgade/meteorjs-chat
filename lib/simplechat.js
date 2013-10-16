/* **************************************************
* General functions
* **************************************************
* */

MAIN_THREAD_NAME = "main";
 
// Returns "digit" numbers ( 0->00, 9->09, 10->10, ...)
makeDigit = function(string) {
	if ( string < 10 || string.length < 2 )
	string = "0" + string;
	return string;
}
// Returns the time stamp of the time in 
getTimeStampFromTime = function(time) {
	var date = new Date(time);
	var string = "";

	var currDate = new Date();
	// if it is not the same day, we include the date of course
	if (date.getYear() != currDate.getYear() ||
	    date.getMonth() != currDate.getMonth() ||
			date.getDay() != currDate.getDay() ) {

		string += makeDigit(date.getDate());
		string += "." + makeDigit( date.getMonth() + 1 );
		string += "." + ( date.getYear() + 1900 );
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
Messages = new Meteor.Collection("messages");
SERVER_USERID = "_";
// delay, for how long a client does not have to have updated it's ping to still be considered online
var LASTPING_DELAY = 12000; // in ms

getUserById = function(id) {
	var users = Meteor.users.find({}).fetch();
	for ( var i = 0; i < users.length; i++ ) {
		if ( users[i]._id == id )
		return users[i];
	}
    
	return null;
}
getUsernameById = function(id) {
	var user = getUserById(id);
	if ( user != null )
	return user.username;
	return null;
}

getValidOnlineDate = function() {
	return new Date().getTime() - LASTPING_DELAY;
}

getOnlineUsersCount = function() {
	var validPingDate = new Date().getTime() - LASTPING_DELAY;
	return Meteor.users.find({
		'profile.lastPing': { $gte: validPingDate },
	}).count();
}

getOnlineUsersCountThread = function(name) {
	var validPingDate = getValidOnlineDate();
	return Meteor.users.find({
		'profile.currentThread': name,
		'profile.lastPing': { $gte: validPingDate }
	}).count();
}


/* **************************************************
* Stubs
* **************************************************
* */
msg = function(text, thread)
{
	var message = {
		'time': new Date().getTime(), // time
		'user': Meteor.userId(), // user id
		'text': text, // text
		thread: { name: thread } // thread object
	};
	Messages.insert(message);
}
