var login_username;

document.addEventListener("DOMContentLoaded", () => {
    console.log("chat.js - DOMContentLoaded")
    get_loginuser_info()
});

// 현재 Login 한 user 정보 조회
async function get_loginuser_info(){
    console.log("chat.js - get_loginuser_info")
    payload = JSON.parse(localStorage.getItem("payload"))
    // console.log('payload:',(payload), typeof(payload))
    user_id = payload["user_id"]
    console.log('user_id: ', user_id)
    const response = await fetch(`${backend_base_url}/chat/user/?user_id=${user_id}`,{
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
} 

// 필터링
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

