// 1. 채팅창 목록(Room) 조회
const asideChat = document.getElementById("chat-container"); 	
const modal = document.getElementById("user-modal");

// Chat List Open
function activeChatList() { 	
    if(asideChat.style.display == '') {
        asideChat.style.display = 'block'; 	
        loadChattingRoomPageByUser()	
    } 
}

// Chat List Close 
function DisableChatList() { 
    if(asideChat.style.display == 'block') {
        asideChat.style.display = '';
        modal.style.display = '';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("chat.js - DOMContentLoaded")
});

async function loadChattingRoomPageByUser() {
    console.log("chat.js - loadChattingRoomPageByUser")
    payload = JSON.parse(localStorage.getItem("payload"))
    // console.log('payload:',(payload), typeof(payload))
    user_id = payload["user_id"]
    // console.log('user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/chat/rooms/?user_id=${user_id}`,{
        headers:{
            Accept: "application/json",
            'content-type': "application/json"
        },
        method: 'GET',
    })    
    response_json = await response.json()
    console.log(response_json)
    if(response.status == 200) {
        alert('채팅 창 목록 수신 SUCCESS: ', response.status, response_json)
        Add_userlist_html(response_json)
    } else {
        alert('채팅 창 목록 수신 ERROR: ', response.status)
    }
}

function Add_userlist_html(response_json){
    console.log("chat.js - Add_userlist_html")
    const chat_container = document.getElementById('chat-container');
    for(let i=0; i<response_json.length; i++){
        const newUserDiv = document.createElement('div')
        profile_img = response_json[i].user2.userprofile.profile_image
        last_message = response_json[i].lasted_message
        user2_username = response_json[i].user2.username
        github_url = response_json[i].user2.userprofile.github_url

        // 1. ROOM - User 목록 추가
        newUserDiv.className = "wrap-profile-chat wrap-profile-chat_" + i;
        newUserDiv.innerHTML = `
            <div><img src=${profile_img} class="img-profile"></div>
            <div class="box-text-profile-chat box-text-profile-chat_${i}">
                <span class="text-profile-name text-profile-name_${i}"
                    onclick="modalOpen('${profile_img}', '${user2_username}', '${github_url}')">${user2_username}</span>
                <span class="text-profile-desc text-profile-desc_${i}">${last_message}</span>
            </div>
        `
        chat_container.append(newUserDiv)
        // Userlist db클릭시 채팅방 open event
        // Add_dbclick_event_on_userlist(newUserDiv)
    }
}


// Profile Modal Open
function modalOpen(profile_img, user2_username, github_url) { 	
    console.log('==modal open===', profile_img, user2_username, github_url)

    if(modal.style.display == '') {
        modal.style.display = 'block'; 	
        const imgProfileModal = document.querySelector(".img-profile-modal"); 	
        imgProfileModal.src = profile_img

        const textProfileNameModal = document.querySelector(".text-profile-name-modal"); 	
        textProfileNameModal.innerHTML = user2_username

        const textProfilePortfolioModal = document.querySelector(".text-profile-portfolio-modal"); 	
        textProfilePortfolioModal.innerHTML = github_url
    } 
}

// Profile Modal Close
function modalClose() { 
    if(modal.style.display == 'block') {
        modal.style.display = '';
    }
}

