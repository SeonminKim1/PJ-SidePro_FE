
// Chatting Room Open
async function activeChatRoom(roomname, user1_username, user2_username) { 	
    if(asideChatRoom.style.display == '') {
        asideChatRoom.style.display = 'block'; 	

        // SOCKET 상태별 Event 설정
        SetChattingRoomSocketEvent(roomname, user1_username, user2_username)	

        // Room 생성(DB 추가) 및 상태 Update
        CreateRoomSetStatus(roomname, user1_username, user2_username)

        // ROOM의 Chat DB 내역 조회 및 출력
        GetRoomChattingList(roomname, user2_username)

        // 채팅방 닫기(X) Event 등록
        AddDeactiveChatRoomEvent(roomname)
    } 
}

// SOCKET 상태별(open, close, receive, send) Event 설정
function SetChattingRoomSocketEvent(roomname, user1_username, user2_username){

    // Set Socket URL
    const url = 'ws://'+ backend_base_ip_port + '/ws/chat/'+ roomname + '/'
    chatSocket = new WebSocket(url); // url, protocol

    // Socket Open, Close
    chatSocket.onopen = function(e){console.log('Chat Socket is Connected');}
    chatSocket.onclose = function(e){console.error('Chat Socket is Closed');};

    // 메시지 수신 - by Redis
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const newChatDiv = document.createElement('div')
        if(data.username == login_username){
            newChatDiv.className = "wrap-chat-user"
            newChatDiv.innerHTML = `
            <div class="wrap-chat-bubble wrap-bubble-user">
                <div class="box-text-profile-chat chat-user">
                    <span id="chat-user" class="text-chat-name-user">${data.username}</span>
                </div>
                <div id="box-chat-user" class="box-text-chat">
                    <span id="chat-user-desc" class="text-chat-desc">${data.message}</span>
                    <p class="text-chat-date">${data.dt}</p>
                </div>
            </div>`
        }else{
            newChatDiv.className = "wrap-chat-partner"
            newChatDiv.innerHTML = `
            <div class="wrap-chat-bubble">
                <div class="box-text-profile-chat">
                    <span id="chat-partner" class="text-chat-name">${data.username}</span>
                </div>
                <div id="box-chat-partner" class="box-text-chat">
                    <span id="chat-partner-desc" class="text-chat-desc">${data.message}</span>
                    <p class="text-chat-date">${data.dt}</p>
                </div>
            </div>`
        }
        asideChatText.append(newChatDiv)
    };
    

    // 메시지 보내기
    // 엔터키
    document.querySelector('.input-chat').onkeyup = function(e){
        if (window.event.keyCode == 13) {
            sendmessage(e)
        }
    }
    // 클릭
    document.querySelector('.btn-chat').onclick =  function(e) {
        sendmessage(e)
    }
    async function sendmessage(e) {
        const message = messageInputDom.value;
        if (message == ""){
            return alert("메세지를 입력해주세요!")
        }
        // get now datetime
        var chat_time = new Date();
        var dt = StringToDatetime(chat_time, 'DATETIME')
        
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
        
        // 스크롤 아래로 이동
        document.querySelector("#chat-box").scrollTop = document.querySelector("#chat-box").scrollHeight;

        // Chat 정상적으로 저장
        if(response.status==201) {
            //alert('Chat 생성 SUCCESS: ', response.status, response.message)        
        } else {
            alert('Chat 생성 ERROR: ', response.status)
        }
    }
}

// Chatting Room 오픈시 Room 생성(DB 추가) 및 상태(Status) Update
async function CreateRoomSetStatus(roomname, user1_username, user2_username){
    const formdata = new FormData()
    formdata.append("user1", user1_username)
    formdata.append("user2", user2_username)
    formdata.append('room_status', ROOM_STATUS_RUNNING)
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
        //alert('룸 생성 및 활성화 SUCCESS: ', response.status, response.message)        
    } else {
        alert('룸 생성 및 활성화 ERROR: ', response.status)
    }
}

// ROOM에 해당하는 Chat DB 가져오기
async function GetRoomChattingList(roomname, user2_username){
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

    // 채팅방 대화 바꿔주기
    document.querySelector('.text-title-chat').innerHTML = user2_username + '님과의 채팅방 ✨'
    // 채팅방 HTML 대화 출력하기
    for (let i=0; i<msgs.length; i++){
        var chat_time = new Date(msgs[i].send_time);

        var dt = StringToDatetime(chat_time, 'DATETIME')

        const chatDiv = document.createElement('div')
        if(msgs[i].send_user == login_username){
            chatDiv.className = "wrap-chat-user"
            chatDiv.innerHTML = `
            <div class="wrap-chat-bubble wrap-bubble-user">
                <div class="box-text-profile-chat box-chat-user">
                    <span id="chat-user" class="text-chat-name-user">${msgs[i].send_user}</span>
                </div>
                <div id="box-chat-user" class="box-text-chat">
                    <span id="chat-user-desc" class="text-chat-desc">${msgs[i].message}</span>
                    <p class="text-chat-date">${dt}</p>
                </div>
            </div>`
                    
        }else{
            chatDiv.className = "wrap-chat-partner"
            chatDiv.innerHTML = `
            <div class="wrap-chat-bubble">
                <div class="box-text-profile-chat">
                    <span id="chat-partner" class="text-chat-name">${msgs[i].send_user}</span>
                </div>
                <div id="box-chat-partner" class="box-text-chat">
                    <span id="chat-partner-desc" class="text-chat-desc">${msgs[i].message}</span>
                    <p class="text-chat-date">${dt}</p>
                </div>
            </div>
                `
        }
        asideChatText.append(chatDiv)
        
        // 스크롤 아래로 이동
        document.querySelector("#chat-box").scrollTop = document.querySelector("#chat-box").scrollHeight;
    }
    
    if(response.status == 200) {
        //alert('채팅 룸 내용 수신 SUCCESS: ', response.status)
    } else {
        alert('채팅 룸 내용 수신 ERROR: ', response.status)
    }
}

// 채팅방 닫기(X) Event 등록
function AddDeactiveChatRoomEvent(roomname){
    document.querySelector('.btn-chat-room-close').onclick = async (e) => {
        if(asideChatRoom.style.display == 'block') {
            asideChatRoom.style.display = '';
            GetRoomList()
            modal.style.display = '';
            chatSocket.close();
                
            const formdata = new FormData()
            formdata.append('room_status', ROOM_STATUS_STOP)
            const response = await fetch(`${backend_base_url}/chat/rooms/${roomname}/status/`, {
                headers:{
                    "Authorization": "Bearer " + localStorage.getItem("access"),
                },
                method: 'PUT',
                body: formdata,
            })
            response_json = await response.json()
        
            // ROOM 정상적으로 생성 및 STATUS => start
            if(response.status == 200) {
                //alert('룸 비활성화 SUCCESS: ', response.status)
                asideChatText.innerHTML='' // 해당 패널 초기화
            } else {
                alert('룸 비활성화 ERROR: ', response.status)
            }
        }
    };

}