document.addEventListener('DOMContentLoaded', async function () {
    const data = JSON.parse(localStorage.getItem("kakao"));
    document.querySelector('#input-id-join').value = data['email']
});
