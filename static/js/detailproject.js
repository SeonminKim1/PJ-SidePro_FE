const Editor = toastui.Editor;
var project_id; // project_id
var login_username; // login한 user name

// 댓글 정보 입력창
const comment_write_input = document.querySelector('.input-reply-detail')
const comment_view = document.querySelector('.box-comment-detail')

document.addEventListener('DOMContentLoaded', function () {
    project_id = localStorage.getItem('project_id');
    GetLoginUserInfo()
    DetailPageViewer(project_id);
});

// 현재 Login 한 user 정보 조회
async function GetLoginUserInfo(){
    payload = JSON.parse(localStorage.getItem("payload"))
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
    AddCommentCrud(response_json) 

}

// 2. 제목 & 북마크 여부 & Date
function AddTitleBookmark(response_json){

    // 2.0 배경
    const upper_box = document.querySelector('.wrap-thumnail-post-detail')
    upper_box.style.backgroundImage = `url('${response_json['thumnail_img_path']}')`;
    upper_box.style.backgroundSize = "cover";

    // 2.1 제목
    const title_box = document.querySelector('.text-title-project-detail')
    title_box.innerText = response_json['title']

    // 2.2 북마크 여부
    const payload = JSON.parse(localStorage.getItem("payload"));
    const bookmark_btn = document.querySelector(".box-bookmark-project-detail");
    var bookmark_list = response_json["bookmark"];
    if (bookmark_list.includes(payload.user_id)){
        bookmark_btn.innerHTML = '⭐️' // `<i class="fa-solid fa-star"></i>`
    } else {
        bookmark_btn.innerHTML = '★' // `<i class="fa-regular fa-star"></i>`
    }

    // 2.3 작성일
    const create_data_box = document.querySelector('.text-date-project-detail')
    create_data_box.innerText = StringToDatetime(response_json['created_date'], 'DATE')
}

// 2.2 북마크 여부
async function bookmark(node) {
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
        if(node.innerHTML=='⭐️'){ // bookmark on 일 때 누름
            node.innerHTML = '☆'// `<i class="fa-regular fa-star"></i>`
        }else{ // bookmark off 일 때 누름
            node.innerHTML = '⭐️' // `<i class="fa-solid fa-star"></i>`
        }
        alert(response_json['msg'], response.status)
    } else {
        alert('게시글 삭제 실패: ', response.status)
    }
}

// 3. 기술스택 & GitURL
function AddSkillsGiturl(response_json){
    // 3.1 skills
    const skill_box = document.querySelector('.box-title-second-detail')
    skills = response_json['skills']
    for(let i = 0; i<skills.length; i++){
        SkillTag = document.createElement('span')
        SkillTag.innerText = skills[i];
        SkillTag.className="text-stack-project-detail"
        // SkillTag.style.marginRight = "5px";
        // SkillTag.style.color = "cyan";
        skill_box.append(SkillTag)
    }

    // 3.2 writer, gitlink
    const gitlink_span = document.querySelector('.link-github-project-detail')
    const gitlink_a = document.querySelector('.link-github-a-tag')
    gitlink_span.innerText = response_json['github_url']
    gitlink_a.href = response_json['github_url']
}

// 4. 게시글 조회, 수정, 삭제
function AddArticleViewUpdateDelete(response_json){
    // 4.1 게시글 조회 (Viewer Editor)
    const viewer = Editor.factory({
        el: document.querySelector('#viewer'),
        viewer: true,
        height: '500px',
        initialValue: response_json["content"]
    });

    // 게시글 수정, 삭제
    const project_modify_btn = document.querySelector('.btn-modify-detail')
    const project_delete_btn = document.querySelector('.btn-delete-detail')

    // 게시글 본인 작성글이 아니면 수정, 삭제 안보이게
    if(login_username != response_json['user']){
        project_modify_btn.hidden=true;
        project_delete_btn.hidden=true;
    }
    
    // 4.2 게시글 수정
    project_modify_btn.addEventListener('click', function(){
        updateArticle()
    })

    // 4.3 게시글 삭제
    project_delete_btn.addEventListener('click', function(){deleteArticle()})
}

// 4.2 게시글 수정
function updateArticle(){
    localStorage.setItem('project_id', project_id)
    localStorage.setItem('update_mode', 1)
    window.location.replace(`${frontend_base_url}/templates/insert_project.html`);
}

// 4.3 게시글 삭제
async function deleteArticle(){
    if(confirm("게시물을 삭제하시겠습니까?") == true){

        const response = await fetch(`${backend_base_url}/project/${project_id}/`,{
            headers: {
                Accept: "application/json",
                'content-type': "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'DELETE',
        })
        response_json = await response.json()
        if(response.status == 200) {
            alert(response_json['success'], response.status)
            window.location.replace(`${frontend_base_url}/templates/main.html`);
        } else {
            alert('게시글 삭제 실패: ', response.status)
        }
    }
}


// 5. 댓글 추가, 조회, 수정, 삭제
function AddCommentCrud(response_json){

    const comment_user_span = document.querySelector('.user-reply-detail') // 댓글 유저 창
    const comment_write_btn = document.querySelector('.btn-reply-detail') // 댓글 추가 창

    comment_user_span.innerText = login_username // login user 이름 넣기

    // 5.1, 5.3, 5.4 댓글 추가, 수정, 삭제
    comment_write_btn.addEventListener('click', function(){insertUpdateDeleteComment()}) // button event 달기

    // 5.2 댓글 조회
    viewComment(response_json['comment'])
}

// 5.1 댓글 추가, 5.3 수정, 5.4 삭제
async function insertUpdateDeleteComment(){

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
        comment_create_date = StringToDatetime(response_json['data'].created_date, 'DATETIME')   

        // comment html 추가
        newCommentDiv = document.createElement('div')
        newCommentDiv.className = 'box-comment-detail-box_' + comment_id
        if(comment_user == login_username){ // login user면 댓글 수정 삭제 활성화
            newCommentDiv.innerHTML = ` 
                <div class="box-comment-content-detail">
                    <span class = "user-comment-detail">${comment_user}</span>
                    <div class="comment-content-date comment-content-date_${comment_id}">${comment_create_date}</div>
                </div>
                <div class="wrap-comment-content-detail wrap-comment-content-detail_${comment_id}">
                    <div class="comment-content-detail comment-content-detail_${comment_id}">${comment_text}</div>
                    <div class="box-btn-comment-content">
                        <button class="btn-delete-comment-detail btn-delete-comment-detail_${comment_id}" onclick='deleteComment(this)'>삭제</button>
                        <button class="btn-modify-comment-detail btn-modify-comment-detail_${comment_id}" onclick='updateComment(this)'>수정</button>
                    </div>
                </div>
                `
        }else{ // login user가 아니면 댓글 수정 삭제 비활성화
            newCommentDiv.innerHTML = ` 
                <div class="box-comment-content-detail">
                    <span class = "user-comment-detail">${comment_user}</span>
                    <div class="comment-content-date comment-content-date_${comment_id}">${comment_create_date}</div>
                </div>
                <div class="wrap-comment-content-detail">
                    <div class="comment-content-detail comment-content-detail_${comment_id}">${comment_text}</div>
                </div>
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
    var newCommentDiv;
    var comment_id, comment_user, comment_text, comment_create_date;
    // comment html 추가  
    for(let i=0; i<comments.length; i++){
        comment_id = comments[i].id
        comment_user = comments[i].user
        comment_text = comments[i].comment
        comment_create_date = StringToDatetime(comments[i].created_date, 'DATETIME') // _base.js에 시간 바꿔줌 
        
        newCommentDiv = document.createElement('div')
        newCommentDiv.className = 'box-comment-detail-box_' + comment_id

        if(comment_user == login_username){ // login user면 댓글 수정 삭제 활성화
            newCommentDiv.innerHTML = ` 
                <div class="box-comment-content-detail">
                    <span class = "user-comment-detail">${comment_user}</span>
                    <div class="comment-content-date comment-content-date_${comment_id}">${comment_create_date}</div>
                </div>
                <div class="wrap-comment-content-detail wrap-comment-content-detail_${comment_id}">
                    <div class="comment-content-detail comment-content-detail_${comment_id}">${comment_text}</div>
                    <div class="box-btn-comment-content box-btn-comment-content_${comment_id}">
                        <button class="btn-delete-comment-detail btn-delete-comment-detail_${comment_id}" onclick='deleteComment(this)'>삭제</button>
                        <button class="btn-modify-comment-detail btn-modify-comment-detail_${comment_id}" onclick='updateComment(this)'>수정</button>
                    </div>
                </div>
            `
        }else{ // login user가 아니면 댓글 수정 삭제 비활성화
            newCommentDiv.innerHTML = ` 
                <div class="box-comment-content-detail">
                    <span class = "user-comment-detail">${comment_user}</span>
                    <div class="comment-content-date comment-content-date_${comment_id}">${comment_create_date}</div>
                </div>
                <div class="wrap-comment-content-detail wrap-comment-content-detail_${comment_id}">
                    <div class="comment-content-detail comment-content-detail_${comment_id}">${comment_text}</div>
                </div>
            `
        }
        comment_view.append(newCommentDiv)
    }
}

// 5.3 댓글 수정
async function updateComment(update_btn_node){ 

    var update_comment_id = (update_btn_node.className).split('_')[1] // 댓글 id number (ex. 24)
    // 부모노드
    parent_node = update_btn_node.parentNode.parentNode

    // 5.3.1 댓글 텍스트 노드, 날짜, 수정버튼, 삭제버튼 => 제거
    const update_div = document.querySelector('.wrap-comment-content-detail_' + update_comment_id)
    const update_text_node = document.querySelector('.comment-content-detail_' + update_comment_id)
    const update_create_node = document.querySelector('.comment-content-date_' + update_comment_id)
    const update_delete_node = document.querySelector('.btn-delete-comment-detail_' + update_comment_id)

    // node들 다 때기
    prev_update_div = update_div.innerHTML
    update_div.innerHTML = ''

    // 5.3.2 댓글 입력 input 노드, 날짜, 완료 버튼, 취소 버튼 => 생성 
    update_div.innerHTML = `
        <div class="comment-content-detail comment-content-detail_${update_comment_id}">
            <input type="textarea" class = "comment-content-detail-input comment-content-detail-input_${update_comment_id}" value="${update_text_node.innerText}">                   
        </div>
        <div class="box-btn-comment-content box-btn-comment-content_${update_comment_id}">
            <button class="btn-modify-comment-detail btn-ok-comment-detail_${update_comment_id}">완료</button>
            <button class="btn-delete-comment-detail btn-cancel-comment-detail_${update_comment_id}">취소</button>
        </div>
    `
    document.querySelector(".comment-content-detail-input_"+ update_comment_id).focus(); // 댓글 수정하는 쪽으로 커서 이동
    // 5.3.3 (수정)완료 버튼 노드 생성 => 완료시 HTML 수정내용으로 그려주기
    update_ok_btn = document.querySelector('.btn-ok-comment-detail_' + update_comment_id)
    update_ok_btn.addEventListener('click', async function(){
        const update_input_value = document.querySelector('.comment-content-detail-input_'+update_comment_id)
        const update_commentdata = { 'comment' : update_input_value.value }
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
            update_div.innerHTML = ''

            // 댓글 텍스트 노드, 날짜, 수정버튼, 삭제버튼 => 재생성
            var comment_id, comment_text, comment_create_date;  
            
            // response에서 comment 정보 얻기
            comment_id = response_json['data'].id
            comment_text = response_json['data'].comment
            comment_create_date = StringToDatetime(response_json['data'].created_date, 'DATETIME')

            update_div.innerHTML = ` 
                <div class="comment-content-detail comment-content-detail_${comment_id}">${comment_text}</div>
                <div class="box-btn-comment-content box-btn-comment-content_${comment_id}">
                    <button class="btn-delete-comment-detail btn-delete-comment-detail_${comment_id}" onclick='deleteComment(this)'>삭제</button>
                    <button class="btn-modify-comment-detail btn-modify-comment-detail_${comment_id}" onclick='updateComment(this)'>수정</button>
                </div>
            `
            // 최종 수정 성공 alert창
            alert(response_json['msg'], response.status) 
        }else{
            alert('댓글 업데이트 실패했습니다.', response.status)
        }
    })
    
    // 5.3.3 (수정)취소 버튼 노드 생성 => 완료시 HTML 원래대로 그려주기
    update_cancel_btn = document.querySelector('.btn-cancel-comment-detail_' + update_comment_id)
    update_cancel_btn.addEventListener('click', function(){
        // 추가됬던 input 노드들 삭제
        update_div.innerHTML = ''

        // 원래 node 재생성
        update_div.innerHTML = prev_update_div
    })
}    

// 5.4 댓글 삭제
async function deleteComment(node){
    if(!confirm('정말 삭제하시겠습니까?')){
    }else{
        // delete
        delete_comment_id = (node.className).split('_')[1] // 댓글 id number (ex. 24)
        response = await fetch(`${backend_base_url}/project/${project_id}/comment/${delete_comment_id}/`,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: 'DELETE',
        })
        response_json = await response.json()
        if(response.status == 200) {
            node.parentNode.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode.parentNode);
            alert(response_json['success'], response.status)

        }else{
            alert('댓글 삭제 실패했습니다.', response.status)
        }        
    }
}

function comment_enterkey() {
	if (window.event.keyCode == 13) {
    	insertUpdateDeleteComment()
    }
}
function update_comment_enterkey(update_btn_node) {
	if (window.event.keyCode == 13) {
    	updateComment(update_btn_node)
    }
}