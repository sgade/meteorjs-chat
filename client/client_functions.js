if ( Meteor.isClient )
{
	function scrollMessagesToBottom()
	{
		var scrollHeight = $(".messages")[0].scrollHeight;
		console.log(scrollHeight);
    	$('.messages').stop().animate({
    		scrollTop: scrollHeight,
    	}, 250);
  	}

  	// Override
  	function _msg_user()
  	{
  		return Meteor.userId();
  	}
}
