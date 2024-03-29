
// Profile Modal Open
function modalOpen(user_id, profile_img, user2_username, github_url) { 	
    if(modal.style.display == '') {
        
        var div = document.getElementById("chat-room-list");
        var divTop = div.getBoundingClientRect().top;
        var divRight = div.getBoundingClientRect().left;

        modal.style.top = divTop + "px"
        modal.style.left = divRight - 350 + "px"

        modal.style.display = 'block'; 	
        const imgProfileModal = document.querySelector(".img-profile-modal"); 	
        imgProfileModal.src = profile_img
        imgProfileModal.style = "width:50px; height:50px;"

        const textProfileNameModal = document.querySelector(".text-profile-name-modal"); 	
        textProfileNameModal.innerHTML = user2_username

        const textProfilePortfolioModal = document.querySelector(".text-profile-portfolio-modal"); 	
        textProfilePortfolioModal.innerHTML = `<a href="${github_url}" target="_blank">${github_url}</a>`

        const userprofilebtnModal = document.querySelector(".box-btn-modal");
        userprofilebtnModal.innerHTML = `<button class="btn-profile-modal" onclick="toUserPage(${user_id})">유저 페이지 보기</button>`
    }   
}

// Profile Modal Close
function modalClose() { 
    if(modal.style.display == 'block') {
        modal.style.display = '';        
    }
}

// 유저 프로필 보기
function toUserPage(user_id) {
    login_user = JSON.parse(localStorage.getItem("payload"))["user_id"]
    if (user_id == login_user){
        window.location.assign(`${frontend_base_url}/templates/mypage.html`);
    } else {
        localStorage.setItem("AnotherUser_id", user_id)
        localStorage.setItem("isAnotherUser", "true")
        window.location.assign(`${frontend_base_url}/templates/userpage.html`);
    }
    
}

