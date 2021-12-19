function getMessages() {
  let messageContainer = $("#messages")
  messageContainer.html('')
  var messageTemplate = Handlebars.compile(
				$('#messageTemplate').html());

    $.ajax('/data/messages', {
					success: function(data){
            console.log('data: ', data)
						messageContainer.append(messageTemplate(data))
            likeHandler()
					}
				});

}

// for the like function
function likeHandler() {
    $('.like-button').click(function(e) {
      console.log($(this).attr('id'))
        $.ajax({
        type: 'PUT',
        url: `/like/${$(this).attr('id')}`,
        success: function(data){
          if(data.success){
              getMessages()
          } else {
            console.log('there was a problem')
          }
            },
            error: function(){
              console.log('there was a problem')
        }
    })
  })
}
