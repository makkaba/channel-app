/*
namespace object CP

순수 자바스크립트 코드로 바꿔야 함.
*/

$(function() {
	var socket = io('http://ws.justpick.me');
	var CP = {};
	var userId =localStorage.getItem("userId");
	CP.$textArea = $('#ChannelPlugin_textArea');


	//익명 유저 아이디가 없으면 새로 생성한다.
	if(!userId){
		userId = generateId(13);
		localStorage.setItem("userId", userId);
		console.log("userId:",userId);
	}

	//소켓에 유저 아이디를 알린다.
	socket.emit('register', {userId: userId});

	$('#ChannelPlugin_sendBtn').on('click', function(){
		if(CP.$textArea.val() == ''){
			return;
		}
		var messageData = {
			message: CP.$textArea.val(),
			sender: userId
		};

		socket.emit('message', messageData);
		addMessageElement(messageData);
		CP.$textArea.val('');
	});
	socket.on('load', function(pastMessages){
		console.log('log message', pastMessages);

		Object.values(pastMessages).forEach(function(pastMessage){
			console.log('msg:', pastMessage);
			addMessageElement(pastMessage);
		});
	});
	
	socket.on('message', function(data){
		console.log('메시지 도착:',data);
		if(data.sender == userId){
			return;
		}
		addMessageElement(data);
	});
	socket.on('user joined', function(data){
		console.log('새로운 유저!', data);
	});

 	//관리자 로그인 확인
	firebase.auth().getRedirectResult().then(function (result) {
      if (!result.user) {
        console.log('관리자 로그인 안됨');
      } else {
      	//로그인 성공하여 리다이렉트 후 
        console.log('관리자 로그인 성공', result.user.displayName, result.user.email);
        $('#ChannelPlugin_ggLogin').hide();
      }
  }).catch(function (error) {
    console.log(error);
  });
 	
  $('#ChannelPlugin_ggLogin').on('click', ()=> {
  	firebase.auth().signInWithRedirect(provider);
  });

  function addMessageElement(data){
  	var $messageLayout = document.getElementById('ChannelPlugin_messageList');
  	var $message = document.createElement("li");
  	var $messageContext = document.createElement("div");
  	$message.className ="bubbleWrap ";
  	
  	$messageContext.className = "bubble ";
  	if(data.sender == userId){
  		$message.className += "my ";
  		$messageContext.className += "my ";
  	}
  	
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