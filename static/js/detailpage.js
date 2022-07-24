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
    // AddSkillsGiturl(response_json) 

    // 4. 게시글 조회, 수정, 삭제
    // AddArticleViewUpdateDelete(response_json) 

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