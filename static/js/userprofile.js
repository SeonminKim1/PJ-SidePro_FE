
// 유저프로필 정보 등록
function userprofile_upload() {

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
            console.log(response)
            return response.json()
        })
        .then(json => {
            console.log(json)
            // Skills Value List
            select_skills_value = [] // [arc, aws, python]
            for (i = 0; i < skill_tag_list.length; i++) {
                console.log(skill_tag_list[i].innerText)
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
                method: 'POST',
                body: formdata
            })
                .then(response => {
                    console.log(response)
                    return response.json()
                })
                .then(json => {
                    console.log(json)
                    alert('유저프로필 등록완료')
                })
            window.location.replace(`${frontend_base_url}/templates/main.html`);
        })
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
        document.getElementById('profile_img_preview').src = "/static/img/profile-kim.png";
    }
}

// // 라디오 버튼 중 선택된 항목의 value 가져오기
// categoryNodeList = document.getElementsByName('painting-category');
// shapeNodeList = document.getElementsByName('painting-shape');
// categoryNodeList.forEach((node) => {
//     if (node.checked) {
//         formdata.append("category", node.value)
//         console.log(node.value)
//     }
// });
// shapeNodeList.forEach((node) => {
//     if (node.checked) {
//         formdata.append("img_shape", node.value)
//         console.log(node.value)
//     }
// });


