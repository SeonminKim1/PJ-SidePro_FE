// For All
var is_local = true
if (is_local == true) {
    var backend_base_url = "http://127.0.0.1:8000"
    var backend_base_ip_port = "127.0.0.1:8001"
    var frontend_base_url = "http://127.0.0.1:5500"
} else {
    var backend_base_url = "http://3.37.194.222:8000"
    var backend_base_ip_port = "3.37.194.222:8001"
    // const frontend_base_url = "http://www.sidepro.shop"
    var frontend_base_url = "http://sidepro.shop.s3-website.ap-northeast-2.amazonaws.com"
}

const ROOM_STATUS_RUNNING = 'running'
const ROOM_STATUS_PENDING = 'pending'
const ROOM_STATUS_STOP = 'stop'

// String => Datetime or Date 형으로
function StringToDatetime(string_time, type) { // StringToDatetime("2022-07-25T16:54:19.064558", 2)
    time = new Date(string_time);
    function pad(n) { return n < 10 ? "0" + n : n }
    if (type == 'DATETIME') { // 2022-07-25 01:42:29
        return time.getFullYear() + "-" + pad(time.getMonth() + 1) + "-" + pad(time.getDate()) + " " +
            pad(time.getHours()) + ":" + pad(time.getMinutes()) + ":" + pad(time.getSeconds())
    } else if (type == 'DATE') { // 2022-07-15
        return time.getFullYear() + "-" + pad(time.getMonth() + 1) + "-" + pad(time.getDate())
    }
}

const PROFILE_BASE_IMAGE = "https://s3.ap-northeast-2.amazonaws.com/sidepro.shop/static/img/profile_base.png"
const PROJECT_BASE_IMAGE = "https://s3.ap-northeast-2.amazonaws.com/sidepro.shop/static/img/project_thumnail.jpeg"