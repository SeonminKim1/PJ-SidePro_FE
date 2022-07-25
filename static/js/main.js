var login_username;
var sidepro_skill_list = new Array(); // sidepro_skill_list
var skill_tag_list = new Array(); // 검색 추가한 skills tag list

const filter_div_tag = document.querySelector('.box-search-tag') // tag 추가될 div
const filter_input_tag = document.querySelector(".input-search-main") // input 창
const filter_datalist_tag = document.getElementById("search-list") // Datalist Tag 

document.addEventListener("DOMContentLoaded", () => {
    console.log("chat.js - DOMContentLoaded")
    GetBaseInfo()
    // set_filtering_initalize()
});

// 현재 Login 한 user 정보 조회
// skills 목록 조회
async function  GetBaseInfo(){
    console.log("chat.js - get_loginuser_info")
    payload = JSON.parse(localStorage.getItem("payload"))
    // console.log('payload:',(payload), typeof(payload))
    user_id = payload["user_id"]
    console.log('user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/user/main/init/`,{
        headers:{
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })    
    response_json = await response.json()
    console.log(response_json)
    login_username = response_json['login_username'] // JS 내 변수로 지정
    skills = response_json['skills']
    SetSkillsFilteringInitalize(skills)
} 

// 필터링 Skill들(option) 목록(datalist)에 추가 
function SetSkillsFilteringInitalize(skills){
    for(let i=0; i<skills.length; i++){
        skill_name = skills[i]['name']
        // skill option 만들기
        var SkillOptionTag = document.createElement('option')
        SkillOptionTag.value = skill_name
        SkillOptionTag.className = "skill-list"
        filter_datalist_tag.append(SkillOptionTag)

        // sidepro 에서 제공하는 skill list
        sidepro_skill_list.push(skill_name)
    }
}

// input 창 event
function DrawSkillTag(){    
    // enter
    if (window.event.keyCode == 13) {
        check_value = filter_input_tag.value // input value 값
        // sidepro list에 들어 있지 않으면~
        if(!sidepro_skill_list.includes(check_value)){
            alert('기술 스택 리스트 중 하나를 선택해 주세요!')
        }else{ // skill 검색 필터에 추가 하기
            var SkillsTag = document.createElement('span')
            SkillsTag.className = "skills-tag"
            SkillsTag.innerText = check_value;
            SkillsTag.style.marginRight = "3px";
            filter_div_tag.appendChild(SkillsTag)
            filter_input_tag.value = '' // input 초기화
            // 추가된 <span> tag 저장
            skill_tag_list.push(SkillsTag)
        }
    // backspace
    // input ''인 상태 & 태그도 x 일 때 delete 누르면 아무것도 x
    }else if (window.event.keyCode == 8 & (filter_input_tag.value=='')){
        check_value = filter_input_tag.value
        if(skill_tag_list.length == 0 & check_value ==''){}
        // input ''인 상태 & 태그는 o 일 때 delete 누르면 태그 삭제 
        else if(skill_tag_list.length != 0 & check_value == ''){
            // tag 삭제
            remove_tag = skill_tag_list.pop()
            filter_div_tag.removeChild(remove_tag)
        }
    }
}

async function getFilterResult() {
    console.log("main.js - getFilterResult")
    const ordering_radio = document.getElementsByName('ordering')
    const price_radio = document.getElementsByName('price')
    const img_shape_radio = document.getElementsByName('img_shape')

    let category_name;
    if(localStorage.getItem('category_name')){
        category_name = localStorage.getItem('category_name')
    }else{
        category_name = `${DEFAULT_CATEGORY}`
    }

    var ordering_value='', price_value='', img_shape_value='';
    ordering_radio.forEach((node) => { if(node.checked){ ordering_value = node.value }}) 
    price_radio.forEach((node) => { if(node.checked){ price_value = node.value }})
    img_shape_radio.forEach((node) => { if(node.checked){ img_shape_value = node.value }})

    console.log(ordering_value + '/' + price_value + '/' + img_shape_value);

    const response = await fetch(
        `${backend_base_url}/product/?category_name=${category_name}&price=${price_value}&image_shape=${img_shape_value}&ordering_value=${ordering_value}`,
        {
        headers:{
            Accept: "application/json",
            'content-type': "application/json"
        },
        method: 'GET',
        // body: JSON.stringify(Data)
    })
    console.log('============================================', response)
    
    response_json = await response.json()
    
    if(response.status == 200) {
        MainProductPutData(response_json)
    } else {
        alert('ERROR: ', response.status)
    }
}


// 필터링
async function getSearchResult() {
    console.log("main.js - getSearchResult")
    search_input = document.querySelector(".item-search")
    search_input_value = search_input.value
    console.log(search_input_value)  

    let category_name;
    if(localStorage.getItem('category_name')){
        category_name = localStorage.getItem('category_name')
    }else{
        category_name = `${DEFAULT_CATEGORY}`
    }

    const response = await fetch(
        `${backend_base_url}/product/${category_name}/${search_input_value}`,
        {
        headers:{
            Accept: "application/json",
            'content-type': "application/json"
        },
        method: 'GET',
        // body: JSON.stringify(Data)
    })
    console.log('============================================', response)
    
    response_json = await response.json()
    
    if(response.status == 200) {
        MainProductPutData(response_json)
    } else {
        alert('ERROR: ', response.status)
    }
}

// 필터링
async function getFilterInitialize() {
    console.log("main.js - getFilterInitialize")
    const ordering_radio = document.getElementsByName('ordering')
    const price_radio = document.getElementsByName('price')
    const img_shape_radio = document.getElementsByName('img_shape')

    ordering_radio.forEach((node) => { if(node.checked){ 
        node.checked=false;

    }}) 
    price_radio.forEach((node) => { if(node.checked){ 
        node.checked=false 
    }})
    img_shape_radio.forEach((node) => { if(node.checked){
        node.checked=false 
    }})

}

