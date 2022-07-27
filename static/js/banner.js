// 배너
let interval;
let activeIndex = 1;

$(document).ready(function(){
    interval = setInterval(changeActiveIndex,2500);
    $('.list-btn-item').on('click',function(){
      // list button의 색상 변경
    const index = $(this).index();
    activeIndex = index;
    changeActiveIndex();
    clearInterval(interval);
    // animation 재설정을 위해 animation을 잠시 제거
    $('.box-banner-main').css('animation','none');
       // animation 재설정
    $('.box-banner-main').animate({marginLeft:`${-100*index}%`},1,function(){
        //1초의 시간 여유(해당 이미지로 이동하는 animation을 위한 시간)를 두고 다시 animation을 설정
        setTimeout(function(){
            $('.box-banner-main').css('animation',`animation${index+1} 10s infinite`)
            
            interval = setInterval(changeActiveIndex,2500);
        }, 1000)
    })
})
})
function changeActiveIndex(){
    if(activeIndex>3) {
        activeIndex%=4;
    }
    changeActiveBtn();
    activeIndex+=1;
}
function changeActiveBtn(){
    $('.list-btn-item').removeClass('active');
    $(`.box-list-btn-main span:eq(${activeIndex})`).addClass('active');
}

