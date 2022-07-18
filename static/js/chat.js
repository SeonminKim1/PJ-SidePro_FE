const asideChat = document.getElementById("chat-container"); 	
const modal = document.getElementById("user-modal");

// Chat List Open
function activeChatList() { 	
    if(asideChat.style.display == '') {
        asideChat.style.display = 'block'; 		
    } 
}

// Chat List Close 
function DisableChatList() { 
    if(asideChat.style.display == 'block') {
        asideChat.style.display = '';
        modal.style.display = '';
    }
}

// Profile Modal Open
function modalOpen() { 	
    if(modal.style.display == '') {
        modal.style.display = 'block'; 		
    } 
}

// Profile Modal Close
function modalClose() { 
    if(modal.style.display == 'block') {
        modal.style.display = '';
    }
}