

let API_KEY
let ENDPOINT
//获取元素
let userInput = document.getElementById('textInput')
let sendButton = document.getElementById('sendButton')
let chatBox = document.getElementById('chatBox')



// 进入网站执行
//初始化prompt
//添加api
window.onload = function () {
  //从缓存中获取api
  let savedKey = localStorage.getItem("apiKey");
  let savedWebsite = localStorage.getItem("apiWebsite");
  if (savedKey) {
    // 将localStorage中的值赋给一个变量，不要let，let为重新声明，这样会导致不是全局变量
    API_KEY = savedKey;
    // console.log("key:", API_KEY);
  } else {
    console.log("存储中没有读取到合法的值！");
  }
  if (savedWebsite) {
    ENDPOINT = savedWebsite;
  } else {
    console.log("存储中没有读取到合法的值！");
  }

  fetch('../prompt/search.txt') 
    .then(response => response.text()) // 将响应转换为文本
    .then(data => {
      // 将文件内容赋值给变量
      let prompt = data
      addMessage("user", prompt)
      // console.log("网站已加载，初始化成功")
    })
    .catch(error => console.error('Prompt加载:', error)); // 处理错误
  // 这里放置你的代码
  // let prompt = ""
  // addMessage("user", prompt)
  // console.log("网站已加载，执行初始化代码")

};

// 在页面B接收页面A的消息
window.addEventListener('message', function (event) {
  if (event.origin !== 'https://home.videolist.cn') return; // 检查来源
  let searchText = event.data
  // console.log('接收的消息：' + searchText); 
  sendMessage(searchText)
});

// 发送消息
// 按钮点击
sendButton.onclick = function () {
  sendMessage(userInput.value.trim());
};
// 监听输入框的回车事件
userInput.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    // 处理回车事件
    sendMessage(userInput.value.trim())
  }
});

// 历史消息
let messages = [];
// 等待
let waiting = false;


// 发送消息
function sendMessage(aMessage) {
  // 等待
  if (waiting) {
    alert('极点AI正在思考中')
    return;
  }
  waiting = true;
  // 获取到用户的输入
  // console.log(aMessage);
  let message = aMessage
  // let message = userInput.value.trim();
  // 判断用户输入是否为空
  if (message === undefined || message === null || message === '') {
    alert('请输入内容');
    waiting = false;
    return;
  }
  // 将用户输入显示在聊天框中
  displayUserMessage(message);
  userInput.value = ''
  // 创建ChatGPT的回复，并获取到显示回复的容器
  let htmlSpanElement = displayGPTMessageAndGetContainer();
  // 发送消息到GPT
  addMessage("user", message)


  let body = JSON.stringify({ model: "gpt-3.5-turbo", messages: messages, stream: true })
  ssePost(
    // 请求地址
    ENDPOINT,
    // 请求头
    { "Content-Type": "application/json", Authorization: "Bearer " + API_KEY },
    // params，这里没有参数
    {},
    // body
    body,
    // 收到事件时的回调。这里将事件的data显示在htmlSpanElement中
    (event) => { let content = getContent(event.data); if (content) htmlSpanElement.innerHTML += content },
    // 结束时的回调。1.将消息添加到历史消息中 2.将等待状态设置为false
    () => { addMessage("assistant", htmlSpanElement.innerHTML); waiting = false },
    // 发生错误时的回调
    (error) => { console.log(error) }
  );
}


// 匹配回复内容的正则表达式
let contentPattern = /"content":"(.*?)"}/;

/**
 * 获取回复内容
 * @param data 数据
 * @returns 回复内容
 */
function getContent(data) {
  let match = data.match(contentPattern);
  if (match) {
    // 检查 match[1] 的值是否为特定字符串
    if (match[1] === '","role":"assistant') {
      return ''; // 返回空字符串
    }
    let content = match[1].replace(/\\n/g, '\n').replace(/\n/g, '<br>')
    return content
  } else {
    return null
  }
}



/**
 * 将消息添加到历史消息中
 * @param role 角色。user或者assistant
 * @param content 消息内容
 */
function addMessage(role, content) {
  messages.push({ role: role, content: content })
}

/**
 * 将用户输入显示在聊天框中
 * @param text 用户的输入
 */
function displayUserMessage(text) {
  let messageDiv = document.createElement('div')
  messageDiv.classList.add('message')

  let senderSpan = document.createElement('span')
  senderSpan.classList.add('sender')
  senderSpan.textContent = 'You: '

  let textSpan = document.createElement('p')
  textSpan.textContent = text;

  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(textSpan);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * 将GPT的回复显示在聊天框中
 * @returns {HTMLSpanElement}
 */

function displayGPTMessageAndGetContainer() {
  let messageDiv = document.createElement('div')
  messageDiv.classList.add('message')

  let senderSpan = document.createElement('span')
  senderSpan.classList.add('sender')
  senderSpan.textContent = '极点AI: '

  let textSpan = document.createElement('p')
  messageDiv.appendChild(senderSpan)
  messageDiv.appendChild(textSpan)

  chatBox.appendChild(messageDiv)
  chatBox.scrollTop = chatBox.scrollHeight
  return textSpan
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 发送POST请求并处理sse事件
 * @param url 请求地址
 * @param headers 请求头
 * @param params 请求参数
 * @param body 请求体
 * @param onEvent 收到事件时的回调
 * @param onEnd 结束时的回调
 * @param onError 发生错误时的回调
 */

function ssePost(url, headers, params, body, onEvent, onEnd, onError) {
  // 拼接url
  if (Object.keys(params).length > 0) {
    url += '?' + objectToQueryString(params);
  }
  // 发送请求
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  }).then(async response => {
    // 判断响应状态码
    if (!response.ok) {
      onError(new Error('网络错误！'))
      return;
    }
    // 异步处理响应流
    const reader = response.body.getReader()
    // 响应缓冲区
    let buffer = ''
    // 响应的前一个字符，用于判断一个事件是否结束
    let before = ''
    // 循环读取响应流，直到响应流结束
    while (true) {
      // 读取响应流
      const { done, value } = await reader.read()
      // 响应流结束
      if (done) {
        break;
      }
      // 将响应流转换为文本
      const text = new TextDecoder().decode(value);
      // 遍历文本
      for (const element of text) {
        // 判断是否为事件结束。连续两个'\n'表示一个事件结束
        if (element === '\n' && before === '\n') {
          // 将事件中的字段分割出来。例如：event: message \n data: hello world \n id: 123 \n\n
          let eventAndData = buffer.substring(0, buffer.length - 1).split('\n')
          // 将事件中的字段转换为对象, 例如：{event: message, data: hello world, id: 123}
          let resultObject = {}
          eventAndData.forEach(pair => {
            const colonIndex = pair.indexOf(':')
            if (colonIndex === -1) {
              return;
            }
            resultObject[pair.substring(0, colonIndex)] = pair.substring(colonIndex + 2)
          })
          // 回调
          onEvent(resultObject)
          // 清空缓冲区
          buffer = ''
        } else
        // 不是事件结束，将字符添加到缓冲区
        {
          before = element
          buffer += element
        }
      }
    }
    // 结束时的回调
    onEnd();
  }).catch(error => {
    // 发生错误时的回调
    onError(error)
  })
}