async function join() {
    // 정규 표현식을 이용한 아이디 형식 제한 영문 소문자, 대문자, 숫자, 4-30자
    const id_regExp = /^[a-zA-Z0-9]([a-zA-Z0-9]*)(@)([a-zA-Z0-9]*)(\.)([a-zA-Z]*){4,40}$/;
    // 정규 표현식을 이용한 패스워드 형식 제한 영문 소문자, 대문자, 숫자,!@#$%^ 8-20자
    const pwd_regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

    const input_id = document.getElementById("input-id-join").value
    const input_name = document.getElementById("input-username-join").value
    const input_pwd = document.getElementById("input-password-join").value
    const input_pwd_confirm = document.getElementById("input-password-confirm").value

    if (input_id == ""){
        return alert("아이디를 입력해 주세요")
    } else if (!id_regExp.test(input_id)){
        return alert("아이디는 이메일 형식입니다.")
    } else if(input_name == "") {
        return alert("이름을 입력해 주세요")
    } else if(input_pwd == ""){
        return alert("패스워드를 입력해 주세요")
    } else if(!pwd_regExp.test(input_pwd)){
        return alert("패스워드는 영문,숫자,특수문자를 포함한 8-20자 입니다")
    } else if(!(input_pwd == input_pwd_confirm)){
        return alert("패스워드를 재입력란을 확인해주세요")
    }
    // 입력받은 데이터 가져오기
    const joinData = {
        email: input_id,
        username: input_name,
        password: input_pwd,
        password_confirm: input_pwd_confirm,
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
        window.location.assign(`${frontend_base_url}/templates/login.html`);
    } else {
        if(response.status==400){
            alert('이미 가입되어 있는 정보 입니다. 다른 정보를 입력해주세요.', response.status)
        }
        else{
            alert(response.status)
        }
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
        // window.location.href(`${frontend_base_url}/`);
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
            window.location.assign(`${frontend_base_url}/templates/userprofile.html`);
        } else {
            window.location.assign(`${frontend_base_url}/templates/main.html`);
        }

    } else {
        if(response.status==401){
            alert('아이디 혹은 비밀번호를 확인해주세요!', response.status)
        }else{
            alert('아이디 혹은 비밀번호를 확인해주세요!', response.status)
        }
    }

}
function login_enterkey() {
	if (window.event.keyCode == 13) {
    	login()
    }
}
function join_enterkey() {
	if (window.event.keyCode == 13) {
    	join()
    }
}