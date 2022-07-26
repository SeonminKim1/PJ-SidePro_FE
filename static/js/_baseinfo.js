var login_username;
var sidepro_skill_list = new Array(); // sidepro_skill_list
var skill_tag_list = new Array(); // 검색 추가한 skills tag list
var skill_tag_list_text = new Array();
var skills_object = {};

const filter_div_tag = document.querySelector('.box-search-tag') // tag 추가될 div
const filter_input_tag = document.querySelector(".input-search-main") // input 창
const filter_datalist_tag = document.getElementById("search-list") // Datalist Tag 

document.addEventListener("DOMContentLoaded", () => {
    console.log("_baseinfo.js - DOMContentLoaded")
    GetBaseInfo()
    // set_filtering_initalize()
});

// 현재 Login 한 user 정보 조회
// skills 목록 조회
async function GetBaseInfo() {
    console.log("_baseinfo.js - GetBaseInfo")
    payload = JSON.parse(localStorage.getItem("payload"))
    // console.log('payload:',(payload), typeof(payload))
    user_id = payload["user_id"]
    console.log('user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/user/main/init/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })
    response_json = await response.json()
    login_username = response_json['login_username'] // JS 내 변수로 지정
    skills = response_json['skills']
    SetSkillsFilteringInitalize(skills)
   
}

// 필터링 Skill들(option) 목록(datalist)에 추가 
function SetSkillsFilteringInitalize(skills) {
    console.log("_baseinfo.js - SetSkillsFilteringInitalize")

    for (let i = 0; i < skills.length; i++) {
        skills_id = skills[i]['id']
        skill_name = skills[i]['name']
        // skill option 만들기
        var SkillOptionTag = document.createElement('option')
        SkillOptionTag.value = skill_name
        SkillOptionTag.className = "skill-list"
        
        filter_datalist_tag.append(SkillOptionTag)

        // sidepro 에서 제공하는 skill list
        sidepro_skill_list.push(skill_name)

        // skills => object initialize
        skills_object[skill_name] = skills_id
    }
}

// input 창 event
function DrawSkillTag() {
    console.log("_baseinfo.js - DrawSkillTag")

    // enter
    if (window.event.keyCode == 13) {
        check_value = filter_input_tag.value // input value 값
        // sidepro list에 들어 있지 않으면~
        if(!sidepro_skill_list.includes(check_value)){
            alert('검색 보기 중 하나를 선택해 주세요!')
        }else{ // skill 검색 필터에 추가 하기
            console.log('====', skill_tag_list, '===', check_value)
            if(skill_tag_list_text.includes(check_value)){
                alert('이미 추가된 기술 입니다')
            }else{
                var SkillsTag = document.createElement('div')
                SkillsTag.className = "skills-tag"
                SkillsTag.innerText = check_value;
                filter_div_tag.appendChild(SkillsTag)
                filter_input_tag.value = '' // input 초기화
                // 추가된 <span> tag 저장
                skill_tag_list_text.push(check_value)
                skill_tag_list.push(SkillsTag)
            }
        }
    // backspace
    // input ''인 상태 & 태그 x 일 때 delete 누르면 아무것도 x
    }else if (window.event.keyCode == 8 & (filter_input_tag.value=='')){
        check_value = filter_input_tag.value
        if(skill_tag_list.length == 0 & check_value ==''){}
        // input ''인 상태 & 태그 o 일 때 delete 누르면 태그 삭제 
        else if(skill_tag_list.length != 0 & check_value == ''){
            // tag 삭제
            skill_tag_list_text.pop()
            remove_tag = skill_tag_list.pop()
            filter_div_tag.removeChild(remove_tag)
        }
    }
}