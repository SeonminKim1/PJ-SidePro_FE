const asideChat = document.getElementById("chat-container"); 	

// Chat List Open
function activeChatList() { 	
    if(asideChat.style.display == '') {
        asideChat.style.display = 'block'; 		
    } 
}

// Chat List Close 
function DisableChatList() { 
    if(asideChat.style.display == 'block') {
        asideChat.style.display = ''
    }
}