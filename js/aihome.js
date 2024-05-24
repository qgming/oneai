let time = document.getElementById('time')
let day = document.getElementById('day')


// 时间本地更新
function getTime() {
  let nowtime = new Date()
  let year = nowtime.getFullYear(),
      month = nowtime.getMonth() + 1,
      date = nowtime.getDate(),
      hour = nowtime.getHours(),
      minute = nowtime.getMinutes(),
      second = nowtime.getSeconds()
  month = month < 10 ? '0' + month : month
  date = date < 10 ? '0' + date : date
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  time.innerHTML = `<li class="num">${hour}</li>  
  <li class="nonum">:</li>
  <li class="num">${minute}</li>
  <li class="nomum">:</li>
  <li class="num">${second}</li>`
  day.innerText = year + '/' + month + "/" + date
}

timeer = setInterval(getTime, 1000)