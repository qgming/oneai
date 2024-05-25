let stext = document.getElementById('searchText')
let simg = document.getElementById('searchImg')
let url = "https://quark.sm.cn/s?q="
// https://quark.sm.cn/s?q=
// https://www.baidu.com/s?wd=
simg.onclick = search

// 搜索
function search() {
  window.open(url + stext.value)
}

// 键盘搜索
stext.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
      search()
  }
})