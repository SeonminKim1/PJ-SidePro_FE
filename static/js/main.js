window.onload = project_list()

document.addEventListener("DOMContentLoaded", () => {
    console.log("project.js - DOMContentLoaded")
    localStorage.setItem("update_mode", 0)
});

async function project_list(url, filter){
    if (url == null){
        url = `${backend_base_url}/project/?page_size=9`
    } else {
        url = url.replace("&filter=popular", '')
        url = url.replace("&filter=newest", '')
        url = url.replace("&filter=views", '')
        url = url.replace("&filter=", '')
    }
    if (filter == null){
        filter = ""
    }
    const response = await fetch(url + '&filter=' + filter, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method : "GET",
    })

    response_json = await response.json()

    const list_box = document.querySelector("#project_list")
    list_box.innerHTML = ``

    if (response.status == 200) {
        
        response_json["results"].forEach(element => {

            const project_card = document.createElement('div')
            project_card.className = "wrap-card-project"
            project_card.innerHTML = `
            <!-- 카드 -->
            <div class="box-card-content-project">
                <img class="img-card-thumnail-mypage" src="${element.thumnail_img_path}" onclick="project_detail('${element.id}')">
                <div class="box-text-card-project" id="box-text-card-project_${element.id}">
                    <span class="card-text text-title-card-project" onclick="project_detail(${element.id})">${element.title}</span>
                    <span class="card-text text-indroduce-card-project" onclick="project_detail(${element.id})">${element.description}</span>
                    <span id="count">조회수 : ${element.count}</span><br>
                    <span id="count">댓글 : ${element.comment.length}</span>
                    <span id="bookmark_${element.id}"></span>
                </div>
                <div class="wrap-writer-mypage">
                    <span class="text-writer-mypage">${element.user}</span>
                    <button class="btn-chat-mypage btn-chat-mypage_${element.user}" onclick='CreateRoomNode("${element.user}")'>커피챗 신청하기 ☕️</button>
                    
                </div>
            </div>
            `
            // in_card = document.querySelector("#box-text-card-project_" + element.id)
            // for (i = 0; i < element.skills.length; i++){
            //     const skills_span = document.createElement('span')
            //     skills_span.className = "card-text text-stack-card-project"
            //     skills_span.innerText= `${element.skills[i]}`
            //     in_card.append(skills_span)
            // }
            

        list_box.append(project_card)

        // 북마크 버튼
        const payload = JSON.parse(localStorage.getItem("payload"));
        const bookmark_div = document.querySelector("#bookmark_"+ element.id);
        bookmark_div.innerHTML = ``
        const bookmark_btn = document.createElement('div');
        bookmark_btn.className = 'bookmark_btn';

        if (element.bookmark.includes(payload.user_id)){
            bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main" onclick="bookmark('${element.id}','${url}', '${filter}')">⭐️</button>${element.bookmark.length}`
        } else {
            bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main" onclick="bookmark('${element.id}','${url}', '${filter}')">☆</button>${element.bookmark.length}`
        }
        bookmark_div.append(bookmark_btn)
            
        });
        

        // 이전, 다음버튼 생성할 div 선택
        const pagenation_div = document.querySelector(".box-btn-page-main")
        pagenation_div.innerHTML ='' // div 내부 초기화

        // 이전 버튼 생성
        if (response_json['previous'] != null){
            const previous_btn = document.createElement('span')
            previous_btn.classNAme = 'previous_btn';
            previous_btn.innerHTML= `
            <span type="button" onclick="project_list('${response_json['previous']}', '${filter}')" class="btn-page-main previous">←이전 페이지</span>`
            pagenation_div.append(previous_btn)
        }
        // 다음 버튼 생성
        if (response_json['next'] != null){
            const next_btn = document.createElement('span')
            next_btn.classNAme = 'next_btn';
            next_btn.innerHTML= `
            <span type="button" onclick="project_list('${response_json['next']}', '${filter}')" class="btn-page-main next">다음 페이지→</span>`
            pagenation_div.append(next_btn)
        }
    }
}

// 북마크 등록/해제
function bookmark(project_id, url, filter) {
    fetch(`${backend_base_url}/project/${project_id}/bookmark/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
    })
    project_list(url, filter)
}

// 게시물 상세보기
function project_detail(project_id) {
    localStorage.setItem("project_id", project_id)
    localStorage.setItem("update_mode", 0)
    window.location.replace("/templates/detail_project.html")
}

function search_list(){
    skills = document.getElementsByClassName("skills-tag")
    skill_list = ""
    for (i = 0; i < skills.length; i++){
        skill_list = skill_list + "&skills=" + skills[i].innerText
    }
    console.log(skills)
    console.log(skill_list)
    url = `${backend_base_url}/project/?page_size=9` + skill_list
    console.log(url)
    project_list(url)
    
}