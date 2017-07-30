/*
namespace object CP

순수 자바스크립트 코드로 바꿔야 함.
*/

$(function() {
	var socket = io('http://ws.justpick.me');
	var CP = {};
	CP.$textArea = $('#ChannelPlugin_textArea');



	$('#ChannelPlugin_sendBtn').on('click', function(){
		//var userName = Math.random().toString(36).substring(7);
		//console.log("userName:", userName);
		//socket.emit('add user', userName);

		if(CP.$textArea.val() == ''){
			return;
		}
		socket.emit('message', {
			message: CP.$textArea.val(),
			userName: ''
		});
		CP.$textArea.val('');
	});
	
	socket.on('message', function(data){
		console.log('메시지 도착:',data);

		addMessageElement(data);
	});
	socket.on('user joined', function(data){
	console.log('user join!', data);
	});

 
	//리다이렉트로 로그인처리
	firebase.auth().getRedirectResult().then(function (result) {
      if (!result.user) {
        // User not logged in, start login.
        console.log('need to sign in');
      } else {
        // user logged in, go to home page.
        console.log('sign in!', result.user.displayName, result.user.email);
        $('#ChannelPlugin_ggLogin').hide();
      }
  }).catch(function (error) {
    // Handle Errors here.
    console.log(error);
    // ...
  });
 	
  $('#ChannelPlugin_ggLogin').on('click', ()=> {
  	firebase.auth().signInWithRedirect(provider);
  });

  function addMessageElement(data){
  	var $message = document.createElement("li");
  	var $messageContext = document.createElement("div");
  	$messageContext.className="bubble";
  	$messageContext.innerHTML = data.message;

  	$message.appendChild($messageContext);
		//추가한다
		var $messageLayout = document.getElementById('ChannelPlugin_messageWrap');
		$messageLayout.appendChild($message);

  };

});