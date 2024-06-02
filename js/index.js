let searchText = document.getElementById('searchText')
let searchImg = document.getElementById('searchImg')
let aiSearch = document.getElementById('aiImg')
let settingImg = document.getElementById('settingImg')
let settingBox = document.getElementById('settingBox')
let url = "https://www.bing.com/search?q="
// let url
// https://quark.sm.cn/s?q=
// https://www.baidu.com/s?wd=
// https://www.bing.com/search?q=

//普通搜索
searchImg.onclick = function search() {
  if (searchText.value === '') {
    alert('请输入搜索内容');
  } else {
    window.open(url + searchText.value);
  }
}

aiSearch.onclick = searchAi
settingImg.onclick = function () {
  noDisplay(settingBox)
}
// settingImg.onclick = noDisplay(settingBox)

// 搜索
function search() {
  if (searchText.value === '') {
    alert('请输入搜索内容');
  } else {
    window.open(url + searchText.value);
  }
}
// AI搜索
function searchAi() {
  // 在页面A中发送消息
  if (searchText.value === '') {
    alert('请输入搜索内容');
  } else {
    console.log('发送的消息：', searchText.value);
    var searchAiWeb = window.open('https://home.videolist.cn//pages/aisearch.html', '_blank');
    // 监听页面B是否加载完成
    searchAiWeb.addEventListener('load', function () {
      // 发送消息
      searchAiWeb.postMessage(searchText.value, 'https://home.videolist.cn/');
    });
  }
}

// 键盘搜索
searchText.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search()
  }
})

function noDisplay(element) {
  // 检查元素的当前display属性
  if (element.style.display === 'none') {
    // 如果display属性是'none'，则设置为'block'来显示元素
    element.style.display = 'flex';
  } else {
    // 如果display属性不是'none'，则设置为'none'来隐藏元素
    element.style.display = 'none';
  }
}

// 设置页面
// 检查浏览器是否支持localStorage
if (typeof (Storage) !== "undefined") {
  // 获取input元素
  // let apiKey = document.getElementById("apiKey");
  let apiKey = document.getElementById("apiKey");
  let apiWebsite = document.getElementById("apiWebsite");
  let searchUrl = document.getElementById('searchUrl')

  // 获取保存按钮元素
  let saveButton = document.getElementById("saveButton");

  // 当保存按钮被点击时，保存input元素的值到localStorage
  saveButton.addEventListener("click", function () {
    localStorage.setItem("apiKey", apiKey.value);
    localStorage.setItem("apiWebsite", apiWebsite.value);
    localStorage.setItem("searchUrl",searchUrl.value)
    // localStorage.setItem("apiKey", apiKey.value);
    alert("保存成功!");
  });

  // 在页面加载时，从localStorage获取值并赋给其他变量
  window.onload = function () {
    let savedKey = localStorage.getItem("apiKey");
    let savedWebsite = localStorage.getItem("apiWebsite");
    let savedUrl = localStorage.getItem("searchUrl");
    if (savedKey) {
      apiKey.value = savedKey;
    }
    if (savedWebsite) {
      apiWebsite.value = savedWebsite;
    }
    if (savedUrl) {
      searchUrl.value = savedUrl;
      url = savedUrl;
    }
  };
} else {
  console.log("浏览器版本过低，不支持本地保存！");
}