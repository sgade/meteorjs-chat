if (Meteor.isClient) {
	var mySound;
    var lastSoundPlayed = 0;
		var oldScroll = 0;
    function scrollMessagesToBottom() {
			var selector = $(".messages");
			
			var newScroll = selector[0].scrollHeight;
			      
      selector.scrollTop(oldScroll);
			selector.animate({scrollTop: newScroll});
			oldScroll = newScroll;
    }
	
	function playMessageReceivedSound() {
		if ( lastSoundPlayed + 500 < new Date().getTime() ) {
            if ( mySound !== undefined )
            {
                lastSoundPlayed = new Date().getTime();
                mySound.play();
            }
		}
	}
}