var login_username;

document.addEventListener("DOMContentLoaded", () => {
    GetBaseInfo()
});

// 현재 Login 한 user 정보 조회
// skills 목록 조회
async function GetBaseInfo() {
    payload = JSON.parse(localStorage.getItem("payload"))
    user_id = payload["user_id"]
    const response = await fetch(`${backend_base_url}/user/main/init/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })
    response_json = await response.json()
    login_username = response_json['login_username'] // JS 내 변수로 지정
}
