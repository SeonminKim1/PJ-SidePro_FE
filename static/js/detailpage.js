const Editor = toastui.Editor;
var project_id; // project_id
var login_username; // login한 user name

// 댓글 정보 입력창
const comment_write_input = document.getElementById('comment-write-input')
const comment_view = document.getElementById('comment-content')

document.addEventListener('DOMContentLoaded', function () {
    console.log("detailpage.js - DOMContentLoaded")
    
    localStorage.setItem('project_id', 4);
    project_id = localStorage.getItem('project_id');
    GetLoginUserInfo()
    DetailPageViewer(project_id);
});

// 현재 Login 한 user 정보 조회
async function GetLoginUserInfo(){
    console.log("deatilpage.js - get_loginuser_info")
    payload = JSON.parse(localStorage.getItem("payload"))
    console.log('user_id: ', payload["user_id"])
    const response = await fetch(`${backend_base_url}/user/userinfo/`,{
        headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })    
    response_json = await response.json()
    login_username = response_json['login_username'] // JS 내 변수로 지정
} 

// 1. 상세 페이지 내용 조회
async function DetailPageViewer(project_id) {
    console.log("detailpage.js - DetailPageViewer")

    // 1.1 게시물 내용 API로 DB값 조회 (id= n인 게시물 테스트용)
    const response = await fetch(`${backend_base_url}/project/${project_id}`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })
    response_json = await response.json()

    // 2. 제목 & 북마크 여부 & Date 추가
    AddTitleBookmark(response_json) 

    // 3. 기술스택 & GitURL
    AddSkillsGiturl(response_json) 

    // 4. 게시글 조회, 수정, 삭제
    AddArticleViewUpdateDelete(response_json) 

    // 5. 댓글 추가, 조회, 수정, 삭제
    // AddCommentCrud(response_json) 

}

// 2. 제목 & 북마크 여부 & Date
function AddTitleBookmark(response_json){
    console.log("detailpage.js - AddTitleBookmark")
    // 2.1 제목
    const title_box = document.getElementById('title-box')
    title_box.innerText = response_json['title']

    // 2.2 북마크 여부
    const payload = JSON.parse(localStorage.getItem("payload"));
    const bookmark_btn = document.getElementById("bookmark-btn");
    var bookmark_list = response_json["bookmark"];
    if (bookmark_list.includes(payload.user_id)){
        bookmark_btn.innerText = "★"
    } else {
        bookmark_btn.innerText = "☆"
    }

    // 2.3 작성일
    const create_data_box = document.getElementById('create-date')
    create_data_box.innerText = StringToDatetime(response_json['created_date'], 2)
}

// 2.2 북마크 여부
async function bookmark(node) {
    console.log("detailpage.js - bookmark")
    response = await fetch(`${backend_base_url}/project/${project_id}/bookmark/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
    })
    response_json = await response.json()
    if(response.status == 200) {
        if(node.innerText=='★'){ // bookmark on 일 때 누름
            node.innerText = '☆'
        }else{ // bookmark off 일 때 누름
            node.innerText = '★'
        }
        alert(response_json['msg'], response.status)
    } else {
        alert('게시글 삭제 실패: ', response.status)
    }
}

// 3. 기술스택 & GitURL
function AddSkillsGiturl(response_json){
    console.log("detailpage.js - AddSkillsGiturl")
    // 3.1 skills
    const skill_box = document.getElementById('skills-div')
    skills = response_json['skills']
    for(let i = 0; i<skills.length; i++){
        SkillTag = document.createElement('span')
        SkillTag.innerText = skills[i];
        SkillTag.style.marginRight = "5px";
        SkillTag.style.color = "cyan";
        skill_box.append(SkillTag)
    }

    // 3.2 writer, gitlink
    const writer_span = document.getElementById('writer-span')
    const gitlink_span = document.getElementById('gitlink-span')
    writer_span.innerText = response_json['user']
    gitlink_span.innerText = response_json['github_url']
}

// 4. 게시글 조회, 수정, 삭제
function AddArticleViewUpdateDelete(response_json){
    console.log("detailpage.js - AddArticleViewUpdateDelete")
    // 4.1 게시글 조회 (Viewer Editor)
    const viewer = Editor.factory({
        el: document.querySelector('#viewer'),
        viewer: true,
        height: '500px',
        initialValue: response_json["content"]
    });

    // 게시글 수정, 삭제
    const project_update_btn = document.getElementById('project-update-btn')
    const project_delete_btn = document.getElementById('project-delete-btn')

    // 4.2 게시글 수정
    project_update_btn.addEventListener('click', function(){
        updateArticle( // insertproject.js
            response_json["id"], // project_id
            response_json['title'],
            response_json['created_date'],
            response_json['skills'],
            response_json['thumnail_img_path'],
            response_json['content'],
        )
    })

    // 4.3 게시글 삭제
    project_delete_btn.addEventListener('click', function(){deleteArticle()})
}

// 4.2 게시글 수정
function updateArticle(){
    console.log("detailpage.js - updateArticle")
    UpdateContentsByDefaultValue()
    window.location.replace(`${frontend_base_url}/templates/main.html`);
}

// 4.3 게시글 삭제
async function deleteArticle(){
    console.log("detailpage.js - deleteArticle")

    const response = await fetch(`${backend_base_url}/project/${project_id}/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'DELETE',
    })
    response_json = response.json()
    if(response.status == 200) {
        alert(response_json['success'], response.status)
        window.location.replace(`${frontend_base_url}/templates/main.html`);
    } else {
        alert('게시글 삭제 실패: ', response.status)
    }
}


// 5. 댓글 추가, 조회, 수정, 삭제
function AddCommentCrud(response_json){
    console.log("detailpage.js - AddCommentCrud")

    const comment_user_span = document.getElementById('comment-login-user') // 댓글 유저 창
    const comment_write_btn = document.getElementById('comment-write-btn') // 댓글 추가 창

    comment_user_span.innerText = login_username // login user 이름 넣기

    // 5.1, 5.3, 5.4 댓글 추가, 수정, 삭제
    comment_write_btn.addEventListener('click', function(){insertUpdateDeleteComment()}) // button event 달기

    // 5.2 댓글 조회
    viewComment(response_json['comment'])
}

// 5.1 댓글 추가, 5.3 수정, 5.4 삭제
async function insertUpdateDeleteComment(){
    console.log("detailpage.js - insertUpdateDeleteComment")

    comment_text = comment_write_input.value; // 댓글 등록 - input text 내용
    const commentdata = { 'comment':comment_text}

    response = await fetch(`${backend_base_url}/project/${project_id}/comment/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
        body: JSON.stringify(commentdata),
    })
    response_json = await response.json()

    // 정상적으로 등록됬다면 HTML 수정
    if(response.status == 200) {
        comment_write_input.value = ''

        var newCommentDiv;
        var comment_id, comment_user, comment_text, comment_create_date;  
        
        // response에서 comment 정보 얻기
        comment_id = response_json['data'].id
        comment_user = response_json['data'].user
        comment_text = response_json['data'].comment
        comment_create_date = StringToDatetime(response_json['data'].created_date, 1)   

        // comment html 추가
        newCommentDiv = document.createElement('div')
        newCommentDiv.className = 'comment-content-box_' + comment_id
        if(comment_user == login_username){ // login user면 댓글 수정 삭제 활성화
            newCommentDiv.innerHTML = ` 
                <span id="comment-writer-name">${comment_user}</span>
                <span id="comment-writer-text_${comment_id}">${comment_text}</span>
                <span id="comment-writer-content_${comment_id}">${comment_create_date}</span>
                <button id="comment-update-btn_${comment_id}" onclick='updateComment(this)'>수정</button>
                <button id="comment-delete-btn_${comment_id}" onclick='deleteComment(this)'>삭제</button>
                `
        }else{ // login user가 아니면 댓글 수정 삭제 비활성화
            newCommentDiv.innerHTML = `
                <span id="comment-writer-name">${comment_user}</span>
                <span id="comment-writer-text_${comment_id}">${comment_text}</span>
                <span id="comment-writer-content_${comment_id}">${comment_create_date}</span>
                `
        }
        comment_view.append(newCommentDiv)

        alert(response_json['msg'], response.status)
    } else {
        alert('댓글 등록 실패', response.status)
    }
}

// 5.2 댓글 조회
async function viewComment(comments){
    console.log("detailpage.js - viewComment")

    var newCommentDiv;
    var comment_id, comment_user, comment_text, comment_create_date;
    // comment html 추가  
    for(let i=0; i<comments.length; i++){
        comment_id = comments[i].id
        comment_user = comments[i].user
        comment_text = comments[i].comment
        comment_create_date = StringToDatetime(comments[i].created_date, 1) // _base.js에 시간 바꿔줌 
        
        newCommentDiv = document.createElement('div')
        newCommentDiv.className = 'comment-content-box_' + comment_id

        if(comment_user == login_username){ // login user면 댓글 수정 삭제 활성화
            newCommentDiv.innerHTML = ` 
                <span id="comment-writer-name">${comment_user}</span>
                <span id="comment-writer-text_${comment_id}">${comment_text}</span>
                <span id="comment-writer-content_${comment_id}">${comment_create_date}</span>
                <button id="comment-update-btn_${comment_id}" onclick='updateComment(this)'>수정</button>
                <button id="comment-delete-btn_${comment_id}" onclick='deleteComment(this)'>삭제</button>
                `
        }else{ // login user가 아니면 댓글 수정 삭제 비활성화
            newCommentDiv.innerHTML = `
                <span id="comment-writer-name">${comment_user}</span>
                <span id="comment-writer-text_${comment_id}">${comment_text}</span>
                <span id="comment-writer-content_${comment_id}">${comment_create_date}</span>
                `
        }
        comment_view.append(newCommentDiv)
    }
}

// 5.3 댓글 수정
async function updateComment(update_btn_node){ 
    console.log("detailpage.js - updateComment")

    var update_comment_id = (update_btn_node.id).split('_')[1] // 댓글 id number (ex. 24)
    
    // 5.3.1 댓글 텍스트 노드, 날짜, 수정버튼, 삭제버튼 => 제거
    const update_text_node = document.getElementById('comment-writer-text_' + update_comment_id)
    const update_create_node = document.getElementById('comment-writer-content_' + update_comment_id)
    // const update_btn_node = document.getElementById('comment-update-btn_' + update_comment_id)
    const update_delete_node = document.getElementById('comment-delete-btn_' + update_comment_id)
    
    // 부모노드
    parent_node = update_btn_node.parentNode

    // node들 삭제
    parent_node.removeChild(update_text_node)
    parent_node.removeChild(update_create_node)
    parent_node.removeChild(update_btn_node)
    parent_node.removeChild(update_delete_node)

    // 5.3.2 댓글 입력 input 노드, 날짜, 완료 버튼, 취소 버튼 => 생성 
    new_input_span_node = document.createElement('input')
    new_input_span_node.id = 'comment-input-text_' + update_comment_id
    new_input_span_node.type = 'text'
    new_input_span_node.value = update_text_node.innerText;

    // 5.3.3 (수정)완료 버튼 노드 생성 => 완료시 HTML 수정내용으로 그려주기
    new_ok_span_node = document.createElement('button')
    new_ok_span_node.id = 'comment-ok-btn_' + update_comment_id
    new_ok_span_node.innerText = '완료'
    new_ok_span_node.addEventListener('click', async function(){
        const update_commentdata = { 'comment' : new_input_span_node.value }
        response = await fetch(`${backend_base_url}/project/${project_id}/comment/${update_comment_id}/`,{
            headers: {
                Accept: "application/json",
                'content-type': "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'PUT',
            body : JSON.stringify(update_commentdata)
        })
        response_json = await response.json()
        // 정상적으로 반환하면 
        // 댓글 입력 input 노드, 날짜, 완료 버튼, 취소 버튼 => 삭제
        // 댓글 텍스트 노드, 날짜, 수정버튼, 삭제버튼 => 재생성
        if(response.status == 200) {
            // 댓글 입력 input 노드, 날짜, 완료 버튼, 취소 버튼 => 삭제
            parent_node.removeChild(new_input_span_node)
            parent_node.removeChild(update_create_node)
            parent_node.removeChild(new_ok_span_node)
            parent_node.removeChild(new_cancel_span_node)

            // 댓글 텍스트 노드, 날짜, 수정버튼, 삭제버튼 => 재생성
            var comment_id, comment_text, comment_create_date;  
            
            // response에서 comment 정보 얻기
            comment_id = response_json['data'].id
            comment_text = response_json['data'].comment
            comment_create_date = StringToDatetime(response_json['data'].created_date, 1)

            // update comment html 추가
            update_text_span_node = document.createElement('span')
            update_text_span_node.id = 'comment-writer-text_' + update_comment_id
            update_text_span_node.innerText = comment_text

            update_content_span_node = document.createElement('span')
            update_content_span_node.id = 'comment-writer-content_' + update_comment_id
            update_content_span_node.innerText = comment_create_date      

            // update button 추가
            update_button_node = document.createElement('button')
            update_button_node.id = 'comment-update-btn_' + update_comment_id
            update_button_node.innerText = "수정"
            update_button_node.addEventListener('click', function(){
                updateComment(update_button_node);
            });

            // delete button 추가
            delete_button_node = document.createElement('button')
            delete_button_node.id = 'comment-delete-btn_' + update_comment_id
            delete_button_node.innerText = "삭제"
            delete_button_node.addEventListener('click', function(){
                deleteComment(update_button_node);
            });
      
            parent_node.appendChild(update_text_span_node)
            parent_node.appendChild(update_content_span_node)
            parent_node.appendChild(update_button_node)
            parent_node.appendChild(delete_button_node)

            // 최종 수정 성공 alert창
            alert(response_json['msg'], response.status) 
        }else{
            alert('댓글 업데이트 실패했습니다.', response.status)
        }
    })
    
    // 5.3.3 (수정)취소 버튼 노드 생성 => 완료시 HTML 원래대로 그려주기
    new_cancel_span_node = document.createElement('button')
    new_cancel_span_node.id = 'comment-cancel-btn_' + update_comment_id
    new_cancel_span_node.innerText = '취소'
    new_cancel_span_node.addEventListener('click', function(){
        // 추가됬던 input 노드들 삭제
        parent_node.removeChild(new_input_span_node)
        parent_node.removeChild(update_create_node)
        parent_node.removeChild(new_ok_span_node)
        parent_node.removeChild(new_cancel_span_node)
        
        // 원래 node 재생성
        parent_node.appendChild(update_text_node)
        parent_node.appendChild(update_create_node)
        parent_node.appendChild(update_btn_node)
        parent_node.appendChild(update_delete_node)
    })

    // node들 추가
    parent_node.appendChild(new_input_span_node)
    parent_node.appendChild(update_create_node)
    parent_node.appendChild(new_ok_span_node)
    parent_node.appendChild(new_cancel_span_node)
}    

// 5.4 댓글 삭제
async function deleteComment(node){
    console.log("detailpage.js - deleteComment")
    if(!confirm('정말 삭제하시겠습니까?')){
    }else{
        // delete
        delete_comment_id = (node.id).split('_')[1] // 댓글 id number (ex. 24)
        response = await fetch(`${backend_base_url}/project/${project_id}/comment/${delete_comment_id}/`,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'DELETE',
        })
        response_json = await response.json()
        if(response.status == 200) {
            node.parentNode.parentNode.removeChild(node.parentNode);
            alert(response_json['success'], response.status)

        }else{
            alert('댓글 삭제 실패했습니다.', response.status)
        }        
    }
}