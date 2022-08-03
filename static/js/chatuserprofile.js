
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
        textProfilePortfolioModal.innerHTML = `<a href="${github_url}">${github_url} </a>`

        const userprofilebtnModal = document.querySelector(".box-btn-modal");
        userprofilebtnModal.innerHTML = `<button class="btn-profile-modal" onclick="toUserPage(${user_id})">${user_id}유저 페이지 보기</button>`
    }   
}

// Profile Modal Close
function modalClose() { 
    if(modal.style.display == 'block') {
        modal.style.display = '';        
    }
}

function toUserPage(user_id) {
    localStorage.setItem("AnotherUser_id", user_id)
    window.location.replace(`${frontend_base_url}/templates/userpage.html`);
}

