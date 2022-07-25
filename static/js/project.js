window.onload = project_list()

async function project_list(url,filter){
    if (url == null){
        url = `${backend_base_url}/project/?page_size=9`
    }
    if (filter == null){
        filter = ""
    } else {
        filter = '&filter=' + filter
    }
    const response = await fetch(url + filter, {
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
            console.log(element)

            const project_card = document.createElement('div')
            project_card.className = "wrap-card-project"
            project_card.innerHTML = `
            <!-- 카드 -->
            <div class="box-card-content-project">
                <img class="img-card-thumnail-mypage" src="/static/img/project_thumnail.jpeg" onclick="project_detail('${element.id}')">
                <div class="box-text-card-project">
                    <span class="card-text text-title-card-project" onclick="project_detail(${element.id})">${element.title}</span>
                    <span class="card-text text-indroduce-card-project" onclick="project_detail(${element.id})">프로젝트 한줄소개! 나의 첫번째 프로젝트를
                        소개합니다!</span>
                    <span class="card-text text-stack-card-project">${element.skills}</span>
                </div>
                <div class="wrap-writer-mypage">
                    <span class="text-writer-mypage">${element.user}</span>
                    <button class="btn-chat-mypage">커피챗 신청하기 ☕️</button>
                    <span id="bookmark_${element.id}"></span>
                </div>
            </div>
            `
        list_box.append(project_card)

        // 북마크 버튼
        const payload = JSON.parse(localStorage.getItem("payload"));
        const bookmark_div = document.querySelector("#bookmark_"+ element.id);
        bookmark_div.innerHTML = ``
        const bookmark_btn = document.createElement('div');
        bookmark_btn.className = 'bookmark_btn';

        if (element.bookmark.includes(payload.user_id)){
            bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main" onclick="bookmark('${element.id}','${url}', '${filter}')">⭐️</button>`
        } else {
            bookmark_btn.innerHTML = `<button type="button" class="btn-bookmark-main" onclick="bookmark('${element.id}','${url}', '${filter}')">☆</button>`
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
    window.location.replace("/templates/detail_project.html")
}