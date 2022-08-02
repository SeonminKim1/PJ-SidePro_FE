
// Profile Modal Open
function modalOpen(profile_img, user2_username, github_url) { 	
    if(modal.style.display == '') {
        
        var div = document.getElementById("div_id");
        var divTop = div.getBoundingClientRect().top;
        var absoluteTop = window.pageYOffset + div.getBoundingClientRect().top;
        

        modal.style.left = "100px"

        modal.style.display = 'block'; 	
        const imgProfileModal = document.querySelector(".img-profile-modal"); 	
        imgProfileModal.src = profile_img

        const textProfileNameModal = document.querySelector(".text-profile-name-modal"); 	
        textProfileNameModal.innerHTML = user2_username

        const textProfilePortfolioModal = document.querySelector(".text-profile-portfolio-modal"); 	
        textProfilePortfolioModal.innerHTML = github_url
    } 
}

// Profile Modal Close
function modalClose() { 
    if(modal.style.display == 'block') {
        modal.style.display = '';        
    }
}
