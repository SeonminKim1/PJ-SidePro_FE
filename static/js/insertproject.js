const Editor = toastui.Editor;

const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '600px',
    initialEditType: 'markdown',
    previewStyle: 'vertical'
});

// 이미지 Append
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

seeHtml = function () {
    alert(editor.getHTML());
}
seeMd = function () {
    alert(editor.getMarkdown());
}

// 게시글 등록
insert_project = function () {
    image_data = new FormData()
    image_data.append("file", document.querySelector("#thumnail_img_path").files[0])
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
                console.log(skill_tag_list[i].innerText)
                select_skills_value.push(skill_tag_list[i].innerText)
            }

            // Skills ID List
            select_skills_id = [] // [2, 4, 12]
            for(let i=0; i<select_skills_value.length; i++){
                select_skills_id.push(parseInt(skills_object[select_skills_value[i]]))
            }

            const formdata = new FormData()
            formdata.append("title",document.querySelector("#title").value,)

            // Skills Append
            for(let j=0; j<select_skills_id.length; j++){
                formdata.append("skills",select_skills_id[j])
            }
            formdata.append("thumnail_img_path", json["url"])
            formdata.append("content", editor.getMarkdown(),)    
            formdata.append("github_url",document.querySelector("#git_hub_url").value,)    

            fetch(`${backend_base_url}/project/`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access")
                },
                method: 'POST',
                body: formdata
            }).then(response => {
                    console.log(response)
                    return response.json()
                }).then(json => {
                    console.log(json)
                    localStorage.setItem("project_id", json['id'])
                    alert("게시글 작성 성공!")
                    window.location.replace("/templates/detail_project.html/")
                })
        })
}


// 이미지 미리보기
function thumnail_image_preview(input) {
    const base_div = document.querySelector("#thumnail_img_preview")
    base_div.innerHTML = `<img src="" id="result_thumnail_file" class="base-img">`

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
