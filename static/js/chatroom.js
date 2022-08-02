
// 모달, ROOM 관련
const modal = document.getElementById("user-modal"); // 모달 
const asideChat = document.getElementById("chat-list"); // 채팅룸 모달 전체
const asideChatRoomList = document.getElementById("chat-room-list"); // 채팅룸 실제 목록 부분 div

// 채팅방 관련
const asideChatText = document.getElementById("chat-box"); // 채팅방 채팅영역 div
const asideChatRoom = document.getElementById("chat-room"); // 채팅방 전체 div
const messageInputDom = document.querySelector('.input-chat'); // 채팅 input 
const messageSubmitBtn = document.querySelector('.btn-chat'); // 채팅 전송 button
var chatSocket;

// Room 목록 모달창 열기
function activeRoomList() { 	
    if(asideChat.style.display == '') {
        asideChat.style.display = 'block'; 	
        GetRoomList()	
    } 
}

// Room 목록 모달창 닫기
function DisableRoomList() { 
    if(asideChat.style.display == 'block') {
        asideChat.style.display = '';
        modal.style.display = '';
        asideChatRoomList.innerHTML='' // 해당 패널 초기화
    }
}

// Room 목록 조회
async function GetRoomList() {
    console.log("chat.js - GetRoomList")
    payload = JSON.parse(localStorage.getItem("payload"))
    user_id = payload["user_id"]
    console.log('현재 로그인한 user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/chat/rooms/?user_id=${user_id}`,{
        headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })    
    response_json = await response.json()
    console.log('RoomList : ', response_json)
    if(response.status == 200) {
        //alert('Room 수신 SUCCESS: ', response.status)
        AddRoomListHtml(response_json)
    } else {
        alert('Room 목록 수신 ERROR: ', response.status)
    }
}

// Room HTML 추가
function AddRoomListHtml(response_json){
    console.log("chat.js - AddRoomListHtml")
    document.querySelector('.text-title-room').innerHTML = login_username + '님의 채팅 목록 ✨'
    for(let i=0; i<response_json.length; i++){
        // response_json[i] : room
        var roomname = response_json[i].name
        var last_message = response_json[i].lasted_message
        var room_status = response_json[i].status
        var room_status_update_username = response_json[i].status_update_user.username
        var user1_username = response_json[i].user1.username
        var user2_username = response_json[i].user2.username;
        var profile_img, github_url;

        // Backend에선 Room에 참여한 첫번째 유저, 두번째 유저로 저장
        // FE에서 로그인한 유저(user1)과 채팅대상(user2) 설정 (고정)
        if(user1_username == login_username){
            profile_img = response_json[i].user2.userprofile.profile_image
            github_url = response_json[i].user2.userprofile.github_url    
        }else if(user2_username == login_username){
            profile_img = response_json[i].user1.userprofile.profile_image;
            github_url = response_json[i].user1.userprofile.github_url;
            [user1_username, user2_username] = [user2_username, user1_username]; // user2가 login user로 서로 change
        }else{
            alert('인증 토큰이 만료되었습니다. 로그인 페이지로 돌아갑니다')
            window.location.replace(`${frontend_base_url}/templates/login.html`);
        }

        // Room 삭제 여부 - 상대방이 삭제 했으면 대화방 input 비활성화
        if(room_status == ROOM_STATUS_PENDING & room_status_update_username == user2_username){            
            messageInputDom.disabled=true;
            messageSubmitBtn.disabled=true;
        }
        // Room 삭제 여부 - 내가 삭제 했으면 출력 X
        else if(room_status == ROOM_STATUS_PENDING & room_status_update_username == user1_username){
            continue;
        }

        // ROOM 내용 작성
        const newUserDiv = document.createElement('div')
        newUserDiv.className = "wrap-profile-chat-list wrap-profile-chat-list_" + i;
        newUserDiv.innerHTML = `
            <div>
                <img src=${profile_img} class="img-profile">
            </div>
            <div class="box-text-chatlist box-text-chatlist_${i}">
                <div class="box-text-user box-text-user_${i}">
                    <div>
                        <span class="text-profile-name text-profile-name_${i}"
                        onclick="modalOpen('${profile_img}', '${user2_username}', '${github_url}')">${user2_username}</span>
                    </div>
                    <div class="box-btn-chatroom">
                        <button class="btn-open-chatting-room" onclick="activeChatRoom('${roomname}', '${user1_username}', '${user2_username}')">채팅 열기 💬</button>
                        <button onclick="RemoveRoomNode(this, '${roomname}')" class="btn-room-close"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
                <div>
                    <span class="text-profile-desc text-profile-desc_${i}">${last_message}</span>
                </div>
            </div>

`        // ROOM 목록에 ROOM 추가
        asideChatRoomList.append(newUserDiv)
    }
}

// Room 삭제 - 나가기
async function RemoveRoomNode(node, roomname){
    console.log("chat.js - RemoveRoomNode")
    // 채팅방 나가기 여부 confirm 창
    if(!confirm("정말 대화방을 나가시겠습니까? 상대방은 읽기모드로만 전환되며, 대화 재요청시 재활성화 됩니다.")){
    }else{ // 확인 버튼
        const response = await fetch(`${backend_base_url}/chat/rooms/${roomname}/`, {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'DELETE',
        })
        response_json = await response.json()
        if(response.status == 200) {
            room_node = node.parentNode.parentNode.parentNode.parentNode
            room_node.remove()
            alert("대화방을 나갔습니다.")
        } else {
            alert('대화방 나가기 ERROR : ', response.status)
        }
    }
}

// ROOM 생성
async function CreateRoomNode(username){
    console.log('chatRoom.js - CreateRoomNode')
    opponent_username = username
    console.log(login_username, opponent_username)
    if(login_username != username){
        let init_roomname = 'init' // uuidv4() // uuid로 roomname
        // console.log('===roomname입니다', roomname)
        const formdata = new FormData()
        formdata.append("user1", login_username)
        formdata.append("user2", opponent_username)
        formdata.append('room_status', ROOM_STATUS_RUNNING)
        const response = await fetch(`${backend_base_url}/chat/rooms/${init_roomname}/`, {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access"),
            },
            method: 'POST',
            body: formdata,
        })
        response_json = await response.json()
        if(response.status == 201 | response.status==200) {
            // alert('대화방 만들기 성공 : ', response.status, response.message)
            activeRoomList()
            activeChatRoom(response_json['uuid_roomname'], login_username, opponent_username)
        } else {
            alert('대화방 만들기 ERROR : ', response.status, response.message)
        }
    }else{
        alert('자기자신과는 대화할 수 없습니다')
    }
}

