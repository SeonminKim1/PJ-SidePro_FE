const asideChat = document.getElementById("chat-container"); 	

// Chat List Open
function activeChatList() { 	
    if(asideChat.style.display == 'none') {
        asideChat.style.display = 'block'; 	
        
    } else {
        asideChat.style.display = 'none'; 	
    } 
}

// Chat List Close
function DisableChatList() { 
    if(asideChat.style.display == 'block') {
        asideChat.style.display = 'none'
    }
}