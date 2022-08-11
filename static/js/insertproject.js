const Editor = toastui.Editor;
var editor;

var update_mode; // page 이동에 사용되는 변수
var project_id; // page 이동에 사용되는 변수

document.addEventListener('DOMContentLoaded', async function () {
    
    // localStorage.setItem('update_mode', 1);
    project_id = localStorage.getItem('project_id')
    update_mode = localStorage.getItem('update_mode');

    // 수정하기로 왔을 떄
    if(update_mode == 1){
        GetBaseInfo()
        // 게시물 내용 API로 DB값 조회 (id= n인 게시물 테스트용)
        const response = await fetch(`${backend_base_url}/project/${project_id}`,{
            headers: {
                Accept: "application/json",
                'content-type': "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'GET',
        })
        response_json = await response.json()
        
        // title 채우기
        const title_h1_box = document.querySelector('.box-title-h1')
        title_h1_box.innerText = String(title_h1_box.innerText).replace('등록', '수정')
        const title_box = document.querySelector('.title-project-post')
        title_box.value = response_json['title']

        // description 채우기
        const description_box =  document.querySelector('.info-project-post')
        description_box.value = response_json['description']

        // Github URL 채우기
        const gitlink_input =  document.querySelector('.git-project-post')
        gitlink_input.value = response_json['github_url']

        // Skills box 채우기
        const skill_box = document.querySelector('.box-search-tag')
        var skills = response_json['skills']
        for(let i = 0; i<skills.length; i++){
            SkillTag = document.createElement('span')
            SkillTag.innerText = skills[i];
            SkillTag.className="text-stack-project-detail"
            skill_tag_list.push(SkillTag)
            skill_box.append(SkillTag)
        }

        // 썸네일 이미지 채우기
        const base_div = document.querySelector("#thumnail_img_preview")
        base_div.innerHTML = `<img src="" id="result_thumnail_file" class="base-img" height="200" width="200">`  
        document.getElementById('result_thumnail_file').src = response_json["thumnail_img_path"];

        const submit_btn = document.querySelector('.btn-project-submit')
        submit_btn.innerText = '프로젝트 수정 완료'

        // 게시글 조회 (Viewer Editor)
        editor = new Editor({
            el: document.querySelector('#editor'),
            height: '600px',
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            initialValue: response_json["content"]
        });
        
        // 이미지 hook 추가
        editor.addHook("addImageBlobHook", function (blob, callback) {
            // blob 텍스트 
            console.log(blob)
        
            // !!!!! 여기서 이미지를 받아와서 이미지 주소를 받아오고 (ajax 등으로)
            const formdata = new FormData();
            formdata.append("file", blob)
            
            fetch(`${backend_base_url}/project/upload/`, {
                method: "POST",
                body: formdata,
            }).then(response => {
                    console.log(response)
                    return response.json()
                }).then(json => {
                    console.log(json)
                    // callback의 인수로 넣으시면 됩니다. 
                    callback(json["url"], "image")
                })
        });
    // update_mode == 0
    }else{ // 프로젝트 등록하기로 왔을 때 
        editor = new Editor({
            el: document.querySelector('#editor'),
            height: '600px',
            initialEditType: 'markdown',
            previewStyle: 'vertical'
        });

        // 이미지 Append
        editor.addHook("addImageBlobHook", function (blob, callback) {
        
            // !!!!! 여기서 이미지를 받아와서 이미지 주소를 받아오고 (ajax 등으로)
            const formdata = new FormData();
            formdata.append("file", blob)
            
            fetch(`${backend_base_url}/project/upload/`, {
                method: "POST",
                body: formdata,
            }).then(response => {
                    return response.json()
                }).then(json => {
                    // callback의 인수로 넣으시면 됩니다. 
                    callback(json["url"], "image")
                })
        });
    }
});

// 게시글 등록(수정)
insert_project = function () {
    const title = document.querySelector("#title").value
    if (title == ""){
        return alert("제목을 입력해주세요!")
    } else if (title.length > 40){
        return alert("제목은 40자 이하 입니다!")
    }
    const description = document.querySelector("#description").value
    if (description == ""){
        return alert("한줄 소개를 입력해주세요!")
    } else if (description.length > 100){
        return alert("한줄 소개는은 100자 이하 입니다!")
    }
    const github_url = document.querySelector('#git_hub_url').value
    if (!(github_url.includes("http://")) && !(github_url.includes("https://"))) {
        return alert("github 주소를 확인해주세요!")
    }
    const skills = skill_tag_list.length
    if(skills == 0){
        return alert("기술 스택을 입력해주세요!")
    }
    const content = editor.getMarkdown()
    if (content == ""){
        return alert("내용을 입력해주세요")
    }
    
    // 이미지가 있을 경우
    if (document.querySelector("#thumnail_img_path").files[0] != null){
        // image data
        image_data = new FormData()
        image_data.append("file", document.querySelector("#thumnail_img_path").files[0])

        // 이미지 업로드
        fetch(`${backend_base_url}/project/upload/`, {
            //headers: {
            //    'Content-Type': 'multipart/form-data',
            //},
            method: "POST",
            body: image_data,
        }).then(response => {
                return response.json()
            }).then(json => {            
                // Skills Value List
                select_skills_value = [] // [arc, aws, python]
                for (i = 0; i < skill_tag_list.length; i++){
                    select_skills_value.push(skill_tag_list[i].innerText)
                }

                // Skills ID List
                select_skills_id = [] // [2, 4, 12]
                for(let i=0; i<select_skills_value.length; i++){
                    select_skills_id.push(parseInt(skills_object[select_skills_value[i]]))
                }

                // form Data 만들기
                const formdata = new FormData()
                formdata.append("title", XSSCheck(document.querySelector("#title").value),)

                // Skills Append
                for(let j=0; j<select_skills_id.length; j++){
                    formdata.append("skills",select_skills_id[j])
                }
                formdata.append("thumnail_img_path", json["url"])
                formdata.append("content", editor.getMarkdown(),)    
                formdata.append("github_url",document.querySelector("#git_hub_url").value,)    
                formdata.append("description", XSSCheck(document.querySelector("#description").value),)    
                

                // 게시글 update
                if(update_mode==1){
                    fetch(`${backend_base_url}/project/${project_id}/`, {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("access")
                        },
                        method: 'PUT',
                        body: formdata
                    }).then(response => {
                            return response.json()
                        }).then(json => {
                            localStorage.setItem("project_id", json['id'])
                            localStorage.setItem("update_mode", 0)
                            update_mode = 0
                            window.location.assign(`${frontend_base_url}/templates/detail_project.html`);
                        })
                }else{ // 게시글 등록하기 - update mode == 0
                    fetch(`${backend_base_url}/project/`, {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("access")
                        },
                        method: 'POST',
                        body: formdata
                    }).then(response => {
                            return response.json()
                        }).then(json => {
                            localStorage.setItem("project_id", json['id'])
                            localStorage.setItem("update_mode", 0)
                            update_mode = 0
                            window.location.assign(`${frontend_base_url}/templates/detail_project.html`);
                        })
                }
        })
    } else { // 이미지가 없을 경우
        // Skills Value List
        select_skills_value = [] // [arc, aws, python]
        for (i = 0; i < skill_tag_list.length; i++){
            select_skills_value.push(skill_tag_list[i].innerText)
        }

        // Skills ID List
        select_skills_id = [] // [2, 4, 12]
        for(let i=0; i<select_skills_value.length; i++){
            select_skills_id.push(parseInt(skills_object[select_skills_value[i]]))
        }

        // form Data 만들기
        const formdata = new FormData()
        formdata.append("title", XSSCheck(document.querySelector("#title").value),)

        // Skills Append
        for(let j=0; j<select_skills_id.length; j++){
            formdata.append("skills",select_skills_id[j])
        }
        formdata.append("content", editor.getMarkdown(),)    
        formdata.append("github_url",document.querySelector("#git_hub_url").value,)    
        formdata.append("description",XSSCheck(document.querySelector("#description").value),)   

        // 게시글 update
        if(update_mode==1){
            fetch(`${backend_base_url}/project/${project_id}/`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'PUT',
                body: formdata
            }).then(response => {
                    return response.json()
                }).then(json => {
                    localStorage.setItem("project_id", json['id'])
                    localStorage.setItem("update_mode", 0)
                    update_mode = 0
                    window.location.assign(`${frontend_base_url}/templates/detail_project.html`);
                })
        }else{ // 게시글 등록하기 - update mode == 0
            formdata.append("thumnail_img_path", PROJECT_BASE_IMAGE)

            fetch(`${backend_base_url}/project/`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
                body: formdata
            }).then(response => {
                    return response.json()
                }).then(json => {
                    localStorage.setItem("project_id", json['id'])
                    localStorage.setItem("update_mode", 0)
                    update_mode = 0
                    window.location.assign(`${frontend_base_url}/templates/detail_project.html`);
                })
        }
    }
    
}


// 이미지 미리보기
function thumnail_image_preview(input) {
    const base_div = document.querySelector("#thumnail_img_preview")
    base_div.innerHTML = `<img src="" id="result_thumnail_file" class="base-img" height="200" width="200">`

    if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('result_thumnail_file').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
    } else {
    document.getElementById('result_thumnail_file').src = "";
    }
}
