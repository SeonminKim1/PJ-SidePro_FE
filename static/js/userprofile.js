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
                console.log(json)
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
                formdata.append("description", XSSCheck_str(document.querySelector('#description').value));
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
                    method: 'POST',
                    body: formdata
                })
                window.location.assign(`${frontend_base_url}/templates/main.html`);
            })
    } else {
        // 이미지가 없는 경우
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
        formdata.append("description", XSSCheck_str(document.querySelector('#description').value));
        formdata.append("profile_image", PROFILE_BASE_IMAGE);
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
            method: 'POST',
            body: formdata
        })
        window.location.assign(`${frontend_base_url}/templates/main.html`);
    }

}

// 이미지 미리보기
function profile_image_preview(input) {
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

