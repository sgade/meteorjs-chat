if (Meteor.isClient) {
	var mySound;
    var lastSoundPlayed = 0;
    function scrollMessagesToBottom() {
        var selector = $(".messages");
        selector.scrollTop(selector[0].scrollHeight);
    }
	
	function playMessageReceivedSound() {
		if(lastSoundPlayed + 500 < new Date().getTime()) {
			lastSoundPlayed = new Date().getTime();
			
			mySound.play();
		}
	}
}