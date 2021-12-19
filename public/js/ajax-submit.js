$(document).ready(function(){

  getMessages()
  $('.messageContainer').on('submit', function(evt){
      evt.preventDefault();
      var $container = $(this).closest('.formContainer');
      var action = $(this).attr('action');
      $.ajax({
          url: action,
          type: 'POST',
        data: $(this).serialize(),
          success: function(data){
              if(data.success){
                getMessages()
                $container.html('<h3>Thanks!</h3>');
              } else {
                  $container.html('There was a problem.');
              }
          },
          error: function(){
              $container.html('There was a problem.');
          }
      });
  });
});

$('.btn-like').on('click', function(e) {
      $.ajax({
        url: `/like/${this.attr('id')}`,
        success: function(data){
          if(data.success){
              getMessages()
              $container.html('<h3>Thanks!</h3>');
          } else {
            $container.html('There was a problem.');
          }
            },
            error: function(){
              $container.html('There was a problem.');
                  }
              });

  })
