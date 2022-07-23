var slides, slide, currentIdx, slideCount, slideWidth, slideMargin, prevBtn, nextBtn;
var slidesBookmark, slideBookmark, currentIdxBookmark, slideCountBookmark, slideWidthBookmark, slideMarginBookmark, prevBtnBookmark, nextBtnBookmark;

window.addEventListener('DOMContentLoaded', function () {
    getMyUserInfo();
    myProjectList();
    myBookmarkProjectList();
});

// 비동기 통신 async 내 정보 출력
async function getMyUserInfo() {

    const response = await fetch(`${backend_base_url}/user/profile/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
        // body: JSON.stringify(Data)
    })

    response_json = await response.json()

    if (response.status == 200) {

        myuserinfo = response_json

        // 출력할 div선택해서 가져와 준비
        const profile_img = document.querySelector('.box-img-profile-mypage');
        const info_box = document.querySelector('.wrap-text-profile-mypage');
        const desc_box = document.querySelector('.box-text-introduce');

        // innerHTML로 원하는 형태로 데이터 출력
        profile_img.innerHTML = `
        <img class="img-profile-mypage" src="/static/img${myuserinfo['userprofile']['profile_image']}">
        `

        info_box.innerHTML = `
        <span class="text-profile-mypage text-user-name-mypage">${myuserinfo['username']}</span>
        <span class="text-profile-mypage text-user-stack-mypage">${myuserinfo['userprofile']['skills']}</span>
        <span class="text-profile-mypage text-user-github-mypage">${myuserinfo['userprofile']['github_url']}</span>
        <span class="text-profile-mypage text-user-region-mypage">${myuserinfo['userprofile']['region']} ${myuserinfo['userprofile']['meet_time']}</span>
        `

        desc_box.innerHTML = `
        <p class="text-introduce-mypage">
        ${myuserinfo['userprofile']['description']}
        </p>
        `
    }
}


async function myProjectList() {
    const response = await fetch(`${backend_base_url}/user/profile/project/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: "GET",
    })

    response_json = await response.json()

    if (response.status == 200) {

        myprojectlist = response_json
        console.log(myprojectlist)

        const list_box = document.querySelector(".myproject-slides")

        myprojectlist.forEach(myproject => {

            const project_card = document.createElement('div')
            project_card.className = "wrap-card-project"
            project_card.innerHTML = `
            <div class="box-card-content-project">
                <img class="img-card-thumnail-mypage" src="/static/img${myproject.thumnail_img_path}">
                <div class="box-text-card-project">
                    <span class="card-text text-title-card-project">${myproject.title}</span>
                    <span class="card-text text-indroduce-card-project">${myproject.content}</span>
                    <span class="card-text text-stack-card-project">${myproject.skills}</span>
                </div>
            </div>
            `

            list_box.prepend(project_card)
        });

        if (myprojectlist.length > 3) {
            slides = document.querySelector('.myproject-slides');
            slide = document.querySelectorAll('.myproject-slides .wrap-card-project');
            currentIdx = 0;
            slideCount = slide.length;
            slideWidth = 300;
            slideMargin = 20;
            prevBtn = document.querySelector('.prev');
            nextBtn = document.querySelector('.next');
            makeClone();

            function makeClone() {
                for (var i = 0; i < slideCount; i++) {
                    var cloneSlide = slide[i].cloneNode(true);
                    cloneSlide.classList.add('clone');
                    slides.appendChild(cloneSlide);
                }
                for (var i = slideCount - 1; i >= 0; i--) {
                    var cloneSlide = slide[i].cloneNode(true);
                    cloneSlide.classList.add('clone');
                    slides.prepend(cloneSlide);
                }
                updateWidth();
                setInitialPos();
                setTimeout(function () {
                    slides.classList.add('animated');
                }, 100);
            }

            function updateWidth() {
                var currentSlides = document.querySelectorAll('.myproject-slides .wrap-card-project');
                var newSlideCount = currentSlides.length;

                var newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + 'px';
                slides.style.width = newWidth;
            }

            function setInitialPos() {
                var initialTranslateValue = -(slideWidth + slideMargin) * slideCount;
                slides.style.transform = 'translateX(' + initialTranslateValue + 'px)';
            }

            prevBtnBookmark.style.display = 'inline-block'
            nextBtnBookmark.style.display = 'inline-block'

            nextBtn.addEventListener('click', function () {
                moveSlide(currentIdx + 1);
            })
            prevBtn.addEventListener('click', function () {
                moveSlide(currentIdx - 1);
            })

            function moveSlide(num) {
                slides.style.left = -num * (slideWidth + slideMargin) + 'px';
                currentIdx = num;
                console.log(currentIdx, slideCount)

                if (currentIdx == slideCount || currentIdx == -slideCount) {
                    setTimeout(function () {
                        slides.classList.remove('animated');
                        slides.style.left = '0px';
                        currentIdx = 0;
                    }, 500);
                    setTimeout(function () {
                        slides.classList.add('animated');
                    }, 600);
                }
            }
        }
    }
}


async function myBookmarkProjectList() {
    const response = await fetch(`${backend_base_url}/user/profile/project/bookmark/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: "GET",
    })

    response_json = await response.json()

    if (response.status == 200) {

        mybookmarkprojectlist = response_json
        console.log(mybookmarkprojectlist)

        const list_box = document.querySelector(".mybookmarkproject-slides")

        mybookmarkprojectlist.forEach(mybookmarkproject => {

            const project_card = document.createElement('div')
            project_card.className = "wrap-card-project"
            project_card.innerHTML = `
            <div class="box-card-content-project">
                <img class="img-card-thumnail-mypage" src="/static/img${mybookmarkproject.thumnail_img_path}">
                <div class="box-text-card-project">
                    <span class="card-text text-title-card-project">${mybookmarkproject.title}</span>
                    <span class="card-text text-indroduce-card-project">${mybookmarkproject.content}</span>
                    <span class="card-text text-stack-card-project">${mybookmarkproject.skills}</span>
                </div>
                <div class="wrap-writer-mypage">
                    <span class="text-writer-mypage">${mybookmarkproject.user}</span>
                    <button class="btn-chat-mypage" onclick="">커피챗 신청하기 ☕️</button>
                </div>
            </div>
            `

            list_box.prepend(project_card)

        });

        if (mybookmarkprojectlist.length > 3) {

            slidesBookmark = document.querySelector('.mybookmarkproject-slides');
            slideBookmark = document.querySelectorAll('.mybookmarkproject-slides .wrap-card-project');
            currentIdxBookmark = 0;
            slideCountBookmark = slideBookmark.length;
            slideWidthBookmark = 300;
            slideMarginBookmark = 20;
            prevBtnBookmark = document.querySelector('.prev-bookmark');
            nextBtnBookmark = document.querySelector('.next-bookmark');
            makeClone();

            function makeClone() {
                for (var i = 0; i < slideCountBookmark; i++) {
                    var cloneSlide = slideBookmark[i].cloneNode(true);
                    cloneSlide.classList.add('clone');
                    slidesBookmark.appendChild(cloneSlide);
                }
                for (var i = slideCountBookmark - 1; i >= 0; i--) {
                    var cloneSlide = slideBookmark[i].cloneNode(true);
                    cloneSlide.classList.add('clone');
                    slidesBookmark.prepend(cloneSlide);
                }
                updateWidth();
                setInitialPos();
                setTimeout(function () {
                    slidesBookmark.classList.add('animated');
                }, 100);
            }

            function updateWidth() {
                var currentSlidesBookmark = document.querySelectorAll('.mybookmarkproject-slides .wrap-card-project');
                var newSlideCountBookmark = currentSlidesBookmark.length;

                var newWidthBookmark = (slideWidthBookmark + slideMarginBookmark) * newSlideCountBookmark - slideMarginBookmark + 'px';
                slidesBookmark.style.width = newWidthBookmark;
            }

            function setInitialPos() {
                var initialTranslateValueBookmark = -(slideWidthBookmark + slideMarginBookmark) * slideCountBookmark;
                slidesBookmark.style.transform = 'translateX(' + initialTranslateValueBookmark + 'px)';
            }

            prevBtnBookmark.style.display = 'inline-block'
            nextBtnBookmark.style.display = 'inline-block'

            nextBtnBookmark.addEventListener('click', function () {
                moveSlide(currentIdxBookmark + 1);
            })
            prevBtnBookmark.addEventListener('click', function () {
                moveSlide(currentIdxBookmark - 1);
            })

            function moveSlide(num) {
                slidesBookmark.style.left = -num * (slideWidthBookmark + slideMarginBookmark) + 'px';
                currentIdxBookmark = num;
                console.log(currentIdxBookmark, slideCountBookmark)

                if (currentIdxBookmark == slideCountBookmark || currentIdxBookmark == -slideCountBookmark) {
                    setTimeout(function () {
                        slidesBookmark.classList.remove('animated');
                        slidesBookmark.style.left = '0px';
                        currentIdxBookmark = 0;
                    }, 300);
                    setTimeout(function () {
                        slidesBookmark.classList.add('animated');
                    }, 400);
                }
            }
        }
    }
}


async function userWithdrawal() {

    if (!confirm("정말 탈퇴하시겠습니까?")) {
        // 취소 : 반응없음
    } else {
        // 확인 : 
        const response = await fetch(`${backend_base_url}/user/profile/`, {
            headers: {
                Accept: "application/json",
                'content-type': "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access")
            },
            method: "DELETE",
        });

        response_json = await response.json();
        alert(response_json["msg"]);

        window.location.replace(`${frontend_base_url}/templates/login.html`);
    };
}


function toUserProfile() {
    window.location.replace(`${frontend_base_url}/templates/userprofile.html`);
}

