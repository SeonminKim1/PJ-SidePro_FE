var login_username;

document.addEventListener("DOMContentLoaded", () => {
    console.log("chat.js - DOMContentLoaded")
    get_loginuser_info()
});

// 현재 Login 한 user 정보 조회
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
    login_username = response_json['login_username'] // JS 내 변수로 지정
}