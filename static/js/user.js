async function join() {

    // 입력받은 데이터 가져오기
    const joinData = {
        email: document.getElementById("input-id-join").value,
        username: document.getElementById("input-username-join").value,
        password: document.getElementById("input-password-join").value,
        password_confirm: document.getElementById("input-password-confirm").value,
    }

    // 입력받은 데이터를 BE서버에 회원가입 url로 request 요청
    const response = await fetch(`${backend_base_url}/user/join/`, {
        // headers를 통해 json 데이터임을 알려줘야 415 오류가 발생하지않는다.
        headers: {
            Accept: "application/json",
            'Content-type': "application/json"
        },
        method: "POST",
        body: JSON.stringify(joinData)
    })

    // response 받은 내용을 json 화
    respose_json = await response.json()

    // 정상적인 통신이 되었을 경우 = 회원가입 완료 > 로그인페이지로
    if (response.status == 201) {
        alert("회원가입 완료!")
        window.location.replace(`${frontend_base_url}/templates/login.html`);
    } else {
        alert(response.status)
    }


}

async function login() {
    const loginData = {
        email: document.getElementById("input-id-login").value,
        password: document.getElementById("input-password-login").value,
    }

    const response = await fetch(`${backend_base_url}/user/api/token/`, {
        headers: {
            Accept: "application/json",
            'Content-type': "application/json"
        },
        method: "POST",
        body: JSON.stringify(loginData)
    })

    response_json = await response.json()

    if (response.status == 200) {
        // 로컬스토리지에 jwt access 토큰과 refresh 토큰 저장
        localStorage.setItem("access", response_json.access)
        localStorage.setItem("refresh", response_json.refresh)

        // 파싱하는 부분 복사해서 사용하기! 
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        // window.location.replace(`${frontend_base_url}/`);
        alert("환영합니다!")
        payload = JSON.parse(localStorage.getItem("payload"))
        user_id = payload["user_id"]
        const response = await fetch(`${backend_base_url}/user/profile`,{
            headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'GET'
        })
        response_json = await response.json()

        if (response_json['userprofile'] == null) {
            window.location.replace(`${frontend_base_url}/templates/userprofile.html`);
        } else {
            window.location.replace(`${frontend_base_url}/templates/main.html`);
        }
        
    } else {
        alert(response.status)
    }

}

