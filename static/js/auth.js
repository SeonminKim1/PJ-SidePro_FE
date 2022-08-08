window.onload = ()=>{
    const payload = JSON.parse(localStorage.getItem("payload"));

    if (payload == null){
        window.location.replace(`${frontend_base_url}/templates/user/login.html`);
    }
    // 아직 access 토큰의 인가 유효시간이 남은 경우
    if (payload.exp > (Date.now() / 1000)){
        
    } else {
        // 인증 시간이 지났기 때문에 다시 refreshToken으로 다시 요청을 해야 한다.
        // refresh 토큰으로 access 토큰 얻어오는 코드 작성
        const requestRefreshToken = async (url) => {
              const response = await fetch(url, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  method: "POST",
                  body: JSON.stringify({
                      "refresh": localStorage.getItem("refresh")
                  })}
              );
              return response.json();
        };

        // 위애서 작성한 함수에 url넣어 작동시켜 refresh 받은 accessToken을 localStorage에 저장
        requestRefreshToken(`${backend_base_url}/user/api/token/refresh/`).then((data)=>{
            // 새롭게 발급 받은 accessToken을 localStorage에 저장
            const accessToken = data.access;
            localStorage.setItem("access", accessToken);
        });
    }

};
