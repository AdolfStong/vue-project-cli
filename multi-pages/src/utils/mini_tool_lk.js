/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-25 19:15:30
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-06 13:28:25
 */
export function formatDate(date1, ymd = true) {
  if (!date1 || date1 === '0') return '-'
  var date = new Date(+date1)
  var YY = date.getFullYear() + '-'
  var MM =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return ymd ? YY + MM + DD + ' ' + hh + mm + ss : hh + mm + ss
}

export const formatTime = function(millisecondsLk) {
  if (millisecondsLk < 0) {
    return '已超时'
  }
  const secondSub = (millisecondsLk / 1000) | 0 // 秒
  var days = Math.floor(secondSub / (24 * 3600)) // 天
  var leave1 = secondSub % (24 * 3600) // 除天后-剩余秒
  var hours = Math.floor(leave1 / 3600) // 时
  var leave2 = leave1 % 3600 // 除时后-剩余秒
  var minutes = Math.floor(leave2 / 60) // 分
  var leave3 = leave2 % 60 // 除分后-剩余秒
  var seconds = ~~leave3 // 秒
  return (
    (days ? days + 'T' : '') +
    (hours < 10 ? '0' + hours : hours) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ':' +
    (seconds < 10 ? '0' + seconds : seconds)
  )
}

// 模块间跳转-兼容dev test 多出来的 ai-app-vue-toss-dev
export function assertdt(lope) {
  const origin = window.location.origin
  if (origin.includes('dev')) {
    lope = '/ai-app-vue-boss-dev' + lope
  } else if (origin.includes('test')) {
    lope = '/ai-app-vue-boss-test' + lope
  }
  return origin + lope
}

// 节流 throttle(抢购按钮):狂触发该函数,每2秒执行1次(水龙头嘀嗒)
export function throttle(fnsuc, rate, fnerr) {
  console.count('节流')
  let start = new Date()
  return function(b1) {
    if (new Date() - start > rate) {
      start = new Date()
      b1 === undefined ? fnsuc.call(this) : fnsuc.call(this, b1) // @click事件没传值undefined
    } else {
      fnerr.call(this)
    }
  }
}

// 防抖 debounce(实时搜索):狂触发该函数,只执行1次(最后那次,2秒后)
export function debounce(fn, delay) {
  console.count('防抖')
  let timer = null
  return function() {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}
