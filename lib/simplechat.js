function makeDigit(string) {
    if (string < 10 || string.length < 2) string = "0" + string;
    return string;
}

function getTimeStampFromTime(time) {
    var date = new Date(time);
    var string = "";
    var currDate = new Date();
    if(date.getYear() != currDate.getYear() &&
       date.getMonth() != currDate.getMonth() &&
       date.getDay() != currDate.getDay()) {
        string += makeDigit(date.getDate());
        string += "." + makeDigit(date.getMonth());
        string += "." + date.getYear();
    }
    string += " " + makeDigit(date.getHours());
    string += ":" + makeDigit(date.getMinutes());
    string += ":" + makeDigit(date.getSeconds());
    return string;
}

var Messages = new Meteor.Collection("messages");