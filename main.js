/*
namespace object CP

순수 자바스크립트 코드로 바꿔야 함.
*/

$(function() {
	var socket = io('http://ws.justpick.me');
	var CP = {};
	var userId;
	CP.$textArea = $('#ChannelPlugin_textArea');


	//이미 익명 유저아이디가 생성되어 있으면 그대로 사용한다.
	if(!localStorage.getItem("userId")){
		userId = generateId(13);
		console.log("userId:",userId);
		localStorage.setItem("userId", userId);
	}else{
		userId = localStorage.getItem("userId");
	}

	//소켓에 유저 아이디를 알린다.
	socket.emit('register', {userId});

	$('#ChannelPlugin_sendBtn').on('click', function(){
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
		console.log('새로운 유저!', data);
	});

 
	//리다이렉트로 관리자 로그인처리
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
    console.log(error);
  });
 	
  $('#ChannelPlugin_ggLogin').on('click', ()=> {
  	firebase.auth().signInWithRedirect(provider);
  });

  function addMessageElement(data){
  	var $messageLayout = document.getElementById('ChannelPlugin_messageWrap');
  	var $message = document.createElement("li");
  	var $messageContext = document.createElement("div");
  	$messageContext.className = "bubble";
  	$messageContext.innerHTML = data.message;
  	$message.appendChild($messageContext);
		$messageLayout.appendChild($message);
  };
  function generateId(size){
  	var result = "";
    var pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var length = pool.length + 1;
    for(var i = 0; i < size; i++) {
        result += pool.charAt(Math.floor(Math.random() * (length)));
    }
    return result;
  }

});