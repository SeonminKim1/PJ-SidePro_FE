window.addEventListener('DOMContentLoaded', function () {
    getMyUserInfo()
});

// 비동기 통신 async 내 정보 출력
async function getMyUserInfo() {

    const response = await fetch(`${backend_base_url}/user/profile/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    response_json = await response.json()

    if (response.status == 200) {

        myuserinfo = response_json

        // 유저프로필 페이지에서 사용자명 출력
        const welcome_profile = document.querySelector('.box-text-title-profile-regist');
        welcome_profile.innerHTML = `
        <span class="text-title-profile-regist">😀 ${myuserinfo.username} 님, SidePro에 오신 것을 환영합니다!</span>
        `
        
        // 프로필 수정페이지에서 DB값 출력
        const profile_img_preview = document.querySelector('#profile_img_preview');
        const github_url = document.querySelector('#github_url');
        const description = document.querySelector('#description');
        profile_img_preview.src = `${myuserinfo['userprofile']['profile_image']}`
        github_url.value = `${myuserinfo['userprofile']['github_url']}`
        description.value = `${myuserinfo['userprofile']['description']}`

        // 셀렉트 옵션을 DB에서 받아온 값으로 selected(지역)
        var region = document.querySelectorAll('#region option');
        for (var i=0; i<region.length; i++) {
            if (region[i].innerText == myuserinfo['userprofile']['region']) {
                $("#region option:eq("+i+")").attr("selected", "selected");
                break;
            }
        }
        // 셀렉트 옵션을 DB에서 받아온 값으로 selected(시간)
        var meet_time = document.querySelectorAll('#meet_time option');
        for (var i=0; i<meet_time.length; i++) {
            if (meet_time[i].innerText == myuserinfo['userprofile']['meet_time']) {
                $("#meet_time option:eq("+i+")").attr("selected", "selected");
                break;
            }
        }


        // 프로필 수정페이지에서 DB값 출력(스킬)
        const user_skills = document.querySelector('.box-search-tag');
        var user_skill_list = myuserinfo['userprofile']['skills']
        
        user_skill_list.forEach(user_skill => {
            const skills_card = document.createElement('div')
            skills_card.className = "skills-tag"
            skills_card.innerText = user_skill
            user_skills.appendChild(skills_card)
            skill_tag_list.push(skills_card)
        });

    }
}


// 유저프로필 정보 등록
function userprofile_upload() {
    const skills = skill_tag_list.length
    if(skills == 0){
        return alert("기술 스택을 입력해주세요!")
    }
    const github_url = document.querySelector('#github_url').value
    if (!(github_url.includes("http://")) && !(github_url.includes("https://"))) {
        return alert("github 주소를 확인해주세요!")
    }
    const region = document.querySelector('#region').value
    if(region == 0){
        return alert("활동 지역을 선택해주세요")
    }
    const meet_time = document.querySelector('#meet_time').value
    if(meet_time == 0){
        return alert("활동 시간을 선택해주세요")
    }
    const description = document.querySelector('#description').value
    if(description == ""){
        return alert("자기소개를 입력해주세요!")
    } else if (description.length > 100){
        return alert("자기소개는 100자 까지만 작성 할 수 있습니다.")
    }
    // 이미지를 있는 경우
    if(document.querySelector("#profile_image_path").files[0] != null){
        image_data = new FormData()
        image_data.append("file", document.querySelector("#profile_image_path").files[0])

        fetch(`${backend_base_url}/user/upload/`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: "POST",
            body: image_data,
        })
            .then(response => {
                return response.json()
            })
            .then(json => {
                // Skills Value List
                select_skills_value = [] // [arc, aws, python]
                for (i = 0; i < skill_tag_list.length; i++) {
                    select_skills_value.push(skill_tag_list[i].innerText)
                }

                // Skills ID List
                select_skills_id = [] // [2, 4, 12]
                for (let i = 0; i < select_skills_value.length; i++) {
                    select_skills_id.push(parseInt(skills_object[select_skills_value[i]]))
                }

                const formdata = new FormData()
                formdata.append("description", document.querySelector('#description').value);
                formdata.append("profile_image", json["url"]);
                formdata.append("github_url", document.querySelector('#github_url').value);

                // Skills Append
                for (let j = 0; j < select_skills_id.length; j++) {
                    formdata.append("skills", select_skills_id[j])
                }

                formdata.append("meet_time", document.querySelector('#meet_time').value);
                formdata.append("region", document.querySelector('#region').value);

                fetch(`${backend_base_url}/user/profile/`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access")
                    },
                    method: 'PUT',
                    body: formdata
                })
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        alert('사용자정보 수정완료')
                    })
                window.location.replace(`${frontend_base_url}/templates/mypage.html`);
            })
    } else {
        // Skills Value List
        select_skills_value = [] // [arc, aws, python]
        for (i = 0; i < skill_tag_list.length; i++) {
            select_skills_value.push(skill_tag_list[i].innerText)
        }

        // Skills ID List
        select_skills_id = [] // [2, 4, 12]
        for (let i = 0; i < select_skills_value.length; i++) {
            select_skills_id.push(parseInt(skills_object[select_skills_value[i]]))
        }

        const formdata = new FormData()
        formdata.append("description", document.querySelector('#description').value);
        formdata.append("github_url", document.querySelector('#github_url').value);

        // Skills Append
        for (let j = 0; j < select_skills_id.length; j++) {
            formdata.append("skills", select_skills_id[j])
        }

        formdata.append("meet_time", document.querySelector('#meet_time').value);
        formdata.append("region", document.querySelector('#region').value);

        fetch(`${backend_base_url}/user/profile/`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body: formdata
        })
            .then(response => {
                return response.json()
            })
            .then(json => {
                alert('사용자정보 수정완료')
            })
        window.location.replace(`${frontend_base_url}/templates/mypage.html`);
    }
}

// 이미지 미리보기
function profile_image_preview(input) {
    // const base_div = document.querySelector("#profile_img_preview")
    // base_div.innerHTML = `<img src="" id="profile_img_preview" class="img-profile-regist">`

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profile_img_preview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('profile_img_preview').src = "/static/img/profile_base.png";
    }
}


async function userWithdrawal() {

    if (!confirm("정말 탈퇴하시겠습니까?")) {
        // 취소 : 반응없음
    } else {
        // 확인 : 
        const response = await fetch(`${backend_base_url}/user/profile/`, {
            headers: {
                Accept: "application/json",
                'content-type': "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: "DELETE",
        });

        response_json = await response.json();
        alert(response_json["msg"]);

        window.location.replace(`${frontend_base_url}/templates/login.html`);
    };
}

