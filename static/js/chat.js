const asideChat = document.getElementById("chat-list"); 
const asideChatRoom = document.getElementById("chat-room"); 	
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


// Chat Room Open
function activeChatRoom() { 	
    if(asideChatRoom.style.display == '') {
        asideChatRoom.style.display = 'block'; 		
    } 
}

// Chat Room Close
function DisableChatRoom() { 
    if(asideChatRoom.style.display == 'block') {
        asideChatRoom.style.display = '';
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