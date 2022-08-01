window.onload = project_list()

document.addEventListener("DOMContentLoaded", () => {
    console.log("main.js - DOMContentLoaded")
    localStorage.setItem("update_mode", 0)
    recommend_lsit()
});

async function recommend_lsit(){
    console.log('recommend_list')
    const response = await fetch(`${backend_base_url}/recommend/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method : "GET",
    })
    response_json = await response.json()
    response_json_result = response_json['results']
    response_json_score = response_json['scores']
    console.log('===', response_json)
    
    const recommend_box = document.querySelector(".container-card-section")
    recommend_box.innerHTML = ``
    if(response.status == 200){
        for(let i=0; i<response_json_result.length; i++){
            element = response_json_result[i]
            const recommend_card = document.createElement('div')
            recommend_card.className = "wrap-card-project-suggest"
            recommend_card.innerHTML = `
            <div class="box-card-content-project">
                <img class="img-card-thumnail-mypage" src="${element.thumnail_img_path}" onclick="project_detail('${element.id}')">
                <div class="box-text-card-project">
                    <span class="card-text text-title-card-project" onclick="project_detail(${element.id})">${element.title}</span>
                    <span class="card-text text-indroduce-card-project" onclick="project_detail(${element.id})">${element.description}</span>
                    <div class="card-text text-skill-card-project" id="box-text-card-suggest-project_${element.id}"></div>
                </div>
                <div class="project-information">
                    <div id="count">조회 ${element.count}</div>
                    <div id="comment">댓글 ${element.comment.length}</div>
                    <div id="bookmark-suggest_${element.id}"></div>
                </div>
                <div class="wrap-writer-mypage">
                    <span class="text-writer-mypage">${element.user}</span>
                    <button class="btn-chat-mypage btn-chat-mypage_suggest_${element.user}" onclick='CreateRoomNode("${element.user}")'>커피챗 신청하기 ☕️</button>
                </div>
            </div>
            `
            recommend_box.append(recommend_card)

            // 게시글에 기술 스택 달기
            skills_list = element['skills']
            const skills_div = document.getElementById("box-text-card-suggest-project_"+ element["id"])
            skills_list.forEach(skill => {
                const skill_card = document.createElement('div')
                skill_card.innerText = skill
                skills_div.append(skill_card)
            });

            // 북마크 버튼
            const payload = JSON.parse(localStorage.getItem("payload"));
            const bookmark_div = document.querySelector("#bookmark-suggest_"+ element.id);
            bookmark_div.innerHTML = ``
            const bookmark_btn = document.createElement('div');
            bookmark_btn.className = 'bookmark_btn';

            if (element.bookmark.includes(payload.user_id)){
                bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main-recommend btn-bookmark-main-recommend_${element.id}" onclick="bookmark_recommend('${element.id}')">⭐️</button>
                <span class="btn-bookmark-main-reommend-count_${element.id}">${element.bookmark_count}</span>`
            } else {
                bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main-recommend btn-bookmark-main-recommend_${element.id}" onclick="bookmark_recommend('${element.id}')">☆</button>
                <span class="btn-bookmark-main-reommend-count_${element.id}">${element.bookmark_count}</span>`
            }
            bookmark_div.append(bookmark_btn)
                
        }
    }
}

async function project_list(url, filter){
    if (url == null){
        url = `${backend_base_url}/project/?page_size=6`
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
                <div class="box-text-card-project">
                    <span class="card-text text-title-card-project" onclick="project_detail(${element.id})">${element.title}</span>
                    <span class="card-text text-indroduce-card-project" onclick="project_detail(${element.id})">${element.description}</span>
                    <div class="card-text text-skill-card-project" id="box-text-card-project_${element.id}"></div>
                </div>
                <div class="project-information">
                        <div id="count"><i class="fa-solid fa-eye"></i> ${element.count}</div>
                        <div id="comment"><i class="fa-solid fa-comment-dots"></i> ${element.comment_count}</div>
                        <div id="bookmark_${element.id}"></div>
                    </div>
                <div class="wrap-writer-mypage">
                    <span class="text-writer-mypage">${element.user}</span>
                    <button class="btn-chat-mypage btn-chat-mypage_${element.user}" onclick='CreateRoomNode("${element.user}")'>커피챗 신청하기 ☕️</button>
                    
                </div>
            </div>
            `
            
        list_box.append(project_card)

        // 게시글에 기술 스택 달기
        skills_list = element['skills']
        const skills_div = document.querySelector("#box-text-card-project_"+ element["id"])
        skills_list.forEach(skill => {
            const skill_card = document.createElement('div')
            skill_card.innerText = skill
            skills_div.append(skill_card)
        });

        // 북마크 버튼
        const payload = JSON.parse(localStorage.getItem("payload"));
        const bookmark_div = document.querySelector("#bookmark_"+ element.id);
        bookmark_div.innerHTML = ``
        const bookmark_btn = document.createElement('div');
        bookmark_btn.className = 'bookmark_btn';

        if (element.bookmark.includes(payload.user_id)){
            bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main btn-bookmark-main_${element.id}" onclick="bookmark('${element.id}','${url}', '${filter}')">⭐️</button>
            <span class="btn-bookmark-main-count_${element.id}">${element.bookmark_count}</span>`
        } else {
            bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main btn-bookmark-main_${element.id}" onclick="bookmark('${element.id}','${url}', '${filter}')">☆</button>
            <span class="btn-bookmark-main-count_${element.id}">${element.bookmark_count}</span>`
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
    bookmark_div = document.querySelector(".btn-bookmark-main_"+ project_id)
    bookmark_span = document.querySelector(".btn-bookmark-main-count_"+ project_id)
    if (bookmark_div.innerText == '⭐️'){
        bookmark_div.innerText = '☆'
        bookmark_span.innerText = String(parseInt(bookmark_span.innerText) - 1)
    } else {
        bookmark_div.innerText = '⭐️'
        bookmark_span.innerText = String(parseInt(bookmark_span.innerText) + 1)
    }
}

// 북마크 등록/해제
function bookmark_recommend(project_id) {
    fetch(`${backend_base_url}/project/${project_id}/bookmark/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
    }).then(response => {
        if(response.status == 200) {
            node = document.querySelector('.btn-bookmark-main-recommend_'+project_id)
            node_count = document.querySelector('.btn-bookmark-main-reommend-count_' + project_id)
            if(node.innerHTML=='⭐️'){ // bookmark on 일 때 누름
                node.innerHTML = '☆'// `<i class="fa-regular fa-star"></i>`
                node_count.innerText = String(parseInt(node_count.innerText) - 1)
            }else{ // bookmark off 일 때 누름
                node.innerHTML = '⭐️' // `<i class="fa-solid fa-star"></i>`
                node_count.innerText = String(parseInt(node_count.innerText) + 1)
            }

            // 하단 프로젝트 목록
            node2 = document.querySelector('.btn-bookmark-main_'+ project_id)
            node2_count = document.querySelector('.btn-bookmark-main-count_' + project_id)
            if(node2!=null){
                if(node2.innerHTML=='⭐️'){ // bookmark on 일 때 누름
                    node2.innerHTML = '☆'
                    node2_count.innerText = String(parseInt(node2_count.innerText) - 1)
    
                }else{ // bookmark off 일 때 누름
                    node2.innerHTML = '⭐️'
                    node2_count.innerText = String(parseInt(node2_count.innerText) + 1)
                }
            }
        }
    });

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

