if (Meteor.isClient) {
    function scrollMessagesToBottom() {
        var selector = $(".messages");
        selector.scrollTop(selector[0].scrollHeight);
    }
	

}