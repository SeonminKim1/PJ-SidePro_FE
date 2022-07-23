window.onload = project_list()

async function project_list(url){
    if (url == null){
        url = `${backend_base_url}/project/?page_size=5`
    }
    const response = await fetch(url, {
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
                <img class="img-card-thumnail-mypage" src="/static/img/project_thumnail.jpeg">
                <div class="box-text-card-project">
                    <span class="card-text text-title-card-project">${element.title}</span>
                    <span class="card-text text-indroduce-card-project">프로젝트 한줄소개! 나의 첫번째 프로젝트를
                        소개합니다!</span>
                    <span class="card-text text-stack-card-project">${element.skills}</span>
                </div>
                <div class="wrap-writer-mypage">
                    <span class="text-writer-mypage">${element.user}</span>
                    <button class="btn-chat-mypage">커피챗 신청하기 ☕️</button>
                    <div id="bookmark_${element.id}"> 
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
            bookmark_btn.innerHTML = `<button type="button" onclick="bookmark('${element.id}','${url}')">♥</button>`
        } else {
            bookmark_btn.innerHTML = `<button type="button" onclick="bookmark('${element.id}','${url}')">♡</button>`
        }
        bookmark_div.append(bookmark_btn)
            
        });
        

        // 이전버튼 생성할 div 선택
        const previous_div = document.querySelector(".previous")
        previous_div.innerHTML ='' // div 내부 초기화
        // 다음버튼 생성할 div 선택
        const next_div = document.querySelector(".next")
        next_div.innerHTML ='' // div 내부 초기화
        // 이전 버튼 생성
        if (response_json['previous'] != null){
            const previous_btn = document.createElement('span')
            previous_btn.classNAme = 'previous_btn';
            previous_btn.innerHTML= `
            <button type="button" onclick='project_list("${response_json['previous']}")'>이전</button>`;
            previous_div.append(previous_btn)
        }
        // 다음 버튼 생성
        if (response_json['next'] != null){
            const next_btn = document.createElement('span')
            next_btn.classNAme = 'next_btn';
            next_btn.innerHTML= `
            <button type="button" onclick='project_list("${response_json['next']}")'>다음</button>`;
            next_div.append(next_btn)
        }
    }
}

function bookmark(project_id, url) {
    fetch(`${backend_base_url}/project/${project_id}/bookmark/`,{
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
    })
    project_list(url)
}