async function project_list(){
    const response = await fetch(`${backend_base_url}/project/`, {
        headers: {
            Accept: "application/json",
            'content-type': "application/json",
            // "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method : "GET",
    })

    response_json = await response.json()

    const list_box = document.querySelector("#project_list")

    if (response.status == 200) {

        response_json.forEach(element => {
            console.log(element)

            const project_card = document.createElement('div')
            project_card.className = "project_card" + element.id
            project_card.innerHTML = `<p>게시물 번호 : ${element.id}</p>
                                      <p>제목 : ${element.title}</p>
                                      <p>조회수 : ${element.count}</p>
                                      <p>스킬 : ${element.skills}</p>
                                      <p>작성자 : ${element.user}</p>
                                      <p>등록 일자 : ${element.updated_date}</p>
                                      `

            list_box.append(project_card)

        });
    }
}
project_list()