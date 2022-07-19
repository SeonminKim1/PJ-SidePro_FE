document.addEventListener("DOMContentLoaded", () => {
    console.log("chat.js - DOMContentLoaded")
    get_loginuser_info()
});

var login_username;
const asideChat = document.getElementById("chat-list"); 
const asideChatText = document.getElementById("chat-box"); 
const asideChatRoom = document.getElementById("chat-room"); 	
const modal = document.getElementById("user-modal");

async function get_loginuser_info(){
    console.log("chat.js - get_loginuser_info")
    payload = JSON.parse(localStorage.getItem("payload"))
    // console.log('payload:',(payload), typeof(payload))
    user_id = payload["user_id"]
    console.log('user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/chat/user/?user_id=${user_id}`,{
        headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })    
    response_json = await response.json()
    console.log(response_json)
    login_username = response_json['login_username']
}

// Chat List Open
function activeChatList() { 	
    if(asideChat.style.display == '') {
        asideChat.style.display = 'block'; 	
        Get_chat_userlist()	
    } 
}

// Chat List Close 
function DisableChatList() { 
    if(asideChat.style.display == 'block') {
        asideChat.style.display = '';
        modal.style.display = '';
    }
}

// Get Chat Userlist
async function Get_chat_userlist() {
    console.log("chat.js - loadChattingRoomPageByUser")
    payload = JSON.parse(localStorage.getItem("payload"))
    // console.log('payload:',(payload), typeof(payload))
    user_id = payload["user_id"]
    console.log('user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/chat/rooms/?user_id=${user_id}`,{
        headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })    
    response_json = await response.json()
    console.log(response_json)
    if(response.status == 200) {
        alert('채팅 창 목록 수신 SUCCESS: ', response.status, response_json)
        Add_chat_userlist_html(response_json)
    } else {
        alert('채팅 창 목록 수신 ERROR: ', response.status)
    }
}

// Add Chat Userlist HTML
function Add_chat_userlist_html(response_json){
    console.log("chat.js - Add_userlist_html")
    
    for(let i=0; i<response_json.length; i++){
        
        const newUserDiv = document.createElement('div')
        var roomname = response_json[i].name
        var last_message = response_json[i].lasted_message

        var user1_username = response_json[i].user1.username
        var user2_username = response_json[i].user2.username;
        
        var profile_img, github_url
        if(user1_username==login_username){
            profile_img = response_json[i].user2.userprofile.profile_image
            github_url = response_json[i].user2.userprofile.github_url    
        }
        else{
            profile_img = response_json[i].user1.userprofile.profile_image;
            github_url = response_json[i].user1.userprofile.github_url;
            [user1_username, user2_username] = [user2_username, user1_username];
        }

        // 1. ROOM - User 목록 추가
        newUserDiv.className = "wrap-profile-chat-list wrap-profile-chat-list_" + i;
        newUserDiv.innerHTML = `
            <div><img src=${profile_img} class="img-profile"></div>
            <div class="box-text-chatlist box-text-chatlist_${i}">
                <div class="box-text-user box-text-user_${i}">
                    <span class="text-profile-name text-profile-name_${i}"
                        onclick="modalOpen('${profile_img}', '${user2_username}', '${github_url}')">${user2_username}</span>
                    <button onclick="activeChatRoom('${roomname}', '${user1_username}', '${user2_username}')">
                    
                    채팅 열기</button>
                </div>
                <div>
                    <span class="text-profile-desc text-profile-desc_${i}">${last_message}</span>
                </div>
            </div>
        `
        asideChat.append(newUserDiv)
    }
}

// =======================================

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

// =======================================

// Chat Room Open
async function activeChatRoom(roomname, user1_username, user2_username) { 	
    if(asideChatRoom.style.display == '') {
        asideChatRoom.style.display = 'block'; 	

        // SOCKET 상태별 Event 설정
        Set_chatroom_socket_event(roomname, user1_username, user2_username)	

        // ROOM 생성 및 상태 Update
        Create_room_and_Set_room_status(roomname, user1_username, user2_username)

        // ROOM의 Chat DB 내역 조회 및 출력
        Get_room_chatlist(roomname, user1_username, user2_username)
    } 
}

// Chat Room Close
function DisableChatRoom() { 
    if(asideChatRoom.style.display == 'block') {
        asideChatRoom.style.display = '';
        modal.style.display = '';
    }
}

function Set_chatroom_socket_event(roomname, user1_username, user2_username){
    console.log("chat.js - Set_chatroom_socket_event")

    // Set Socket URL
    const url = 'ws://'+ backend_base_ip_port + '/ws/chat/'+ roomname + '/'
    const chatSocket = new WebSocket(url); // url, protocol

    // Socket Open, Close
    chatSocket.onopen = function(e){console.log('Chat Socket is Connected');}
    chatSocket.onclose = function(e) { console.error('Chat Socket is Closed');};

    // 메시지 수신
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const newChatDiv = document.createElement('div')
        newChatDiv.className = "wrap-chat-partner"
        newChatDiv.innerHTML = `
                <div class="box-text-profile-chat">
                    <span id="chat-partner" class="text-chat-name">${data.username}</span>
                </div>
                <div id="box-chat-partner" class="box-text-chat">
                    <span id="chat-partner-desc" class="text-chat-desc">${data.message}</span>
                    <span class="text-chat-date">${data.dt}</span>
                </div>
                `
        asideChatText.append(newChatDiv)
    };

    // 메시지 보내기
    document.querySelector('.btn-chat').onclick = async function(e) {
        const messageInputDom = document.querySelector('.input-chat');
        const message = messageInputDom.value;

        // get now datetime
        var chat_time = new Date();
        var dt = chat_time.getFullYear()+'-'+(chat_time.getMonth()+1)+'-'+chat_time.getDate() + ' ' + 
                 chat_time.getHours() + ":" + chat_time.getMinutes() + ":" + chat_time.getSeconds();
        
        // Send Message
        chatSocket.send(JSON.stringify({
            'username': user1_username,
            'dt': dt,
            'message': message,
        }));
        messageInputDom.value = '';

        // Fetch - Chat DB Update
        const formdata = new FormData()
        formdata.append("user1", user1_username) // @TODO
        formdata.append("user2", user2_username) // @TODO
        formdata.append("roomname", roomname)
        formdata.append("send_time", dt)
        formdata.append("message", message)

        const response = await fetch(`${backend_base_url}/chat/messages/`, {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'POST',
            body: formdata,
        })
        response_json = await response.json()
    
        // Chat 정상적으로 저장
        if(response.status==201) {
            alert('Chat 생성 SUCCESS: ', response.status, response.message)        
        } else {
            alert('Chat 생성 ERROR: ', response.status)
        }
    }
}

async function Create_room_and_Set_room_status(roomname, user1_username, user2_username){
    console.log("chat.js - Create_room_and_Set_room_status")
    // Room 조회 및 생성 & 룸 상태 업데이트 (start)
    const formdata = new FormData()
    formdata.append("user1", user1_username) // @TODO
    formdata.append("user2", user2_username) // @TODO
    const response = await fetch(`${backend_base_url}/chat/rooms/${roomname}/`, {
        headers:{
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'POST',
        body: formdata,
    })
    response_json = await response.json()

    // ROOM 정상적으로 생성 및 STATUS => start
    if(response.status == 200 | response.status==201) {
        alert('룸 생성 및 활성화 SUCCESS: ', response.status, response.message)        
    } else {
        alert('룸 생성 및 활성화 ERROR: ', response.status)
    }
}

// 2-2-5. ROOM에 해당하는 Chat DB 가져오기
async function Get_room_chatlist(roomname, user1_username, user2_username){
    console.log("chat.js - Get_room_chatlist")
    // Room 조회 및 생성 & 룸 상태 업데이트 (start)
    const response = await fetch(`${backend_base_url}/chat/rooms/${roomname}/messages/`, {
        headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    })
    response_json = await response.json() // object , not promise
    msgs = response_json.chatmessages

    // 채팅방 HTML 대화 출력하기
    for (let i=0; i<msgs.length; i++){
        var chat_time = new Date(msgs[i].send_time);
        var dt = chat_time.getFullYear()+'-'+(chat_time.getMonth()+1)+'-'+chat_time.getDate() + ' ' +
                 chat_time.getHours() + ":" + chat_time.getMinutes() + ":" + chat_time.getSeconds();

        const chatDiv = document.createElement('div')
        chatDiv.className = "wrap-chat-partner"
        chatDiv.innerHTML = `
            <div class="box-text-profile-chat">
                <span id="chat-partner" class="text-chat-name">${msgs[i].send_user}</span>
            </div>
            <div id="box-chat-partner" class="box-text-chat">
                <span id="chat-partner-desc" class="text-chat-desc">${msgs[i].message}</span>
                <span class="text-chat-date">${dt}</span>
            </div>
            `
        asideChatText.append(chatDiv)
    }
    
    if(response.status == 200) {
        alert('채팅 룸 내용 수신 SUCCESS: ', response.status)
    } else {
        alert('채팅 룸 내용 수신 ERROR: ', response.status)
    }
}