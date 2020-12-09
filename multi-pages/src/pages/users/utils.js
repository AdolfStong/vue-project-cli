/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-30 14:15:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-17 11:56:58
 */
/**
 * 获取今天日期时间戳 00:00:00
 */
export function todayTimestamp() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const today = now.getTime()
  return today
}

/**
 * 获取明天时间戳 00：00：00
 */
export function tomorrowTimestamp() {
  const cur = new Date()
  cur.setDate(cur.getDate() + 1)
  cur.setHours(0, 0, 0, 0)
  const tomorrow = cur.getTime()
  return tomorrow
}

/**
 * 动态获取与今天相距N天的时间戳 00：00：00
 * @day: Number, 今天后的是正数，今天前的是负数
 */
export function getDaysTimestamp(day) {
  if (!Number.isInteger(day)) {
    console.log('参数类型错误')
    return
  }
  const cur = new Date()
  cur.setDate(cur.getDate() + day)
  cur.setHours(0, 0, 0, 0)
  const tomorrow = cur.getTime()
  return tomorrow
}

/**
 * 获取近1小时内时间
 */
export function withinAnHour(key) {
  const now = Date.now()
  const last = Date.now() - 3600 * 1000
  const res = key
    ? { [`${key}`]: { gte: last, lte: now } }
    : { gte: last, lte: now }
  return res
}
/**
 * 获取本周开始时间
 */
export function getWeekStartTimestamp() {
  const now = new Date() // 当前日期
  const nowDayOfWeek = now.getDay() // 今天本周的第几天
  const nowDay = now.getDate() // 当前日
  const nowMonth = now.getMonth() // 当前月
  var day = nowDayOfWeek || 7
  const res = new Date(now.getFullYear(), nowMonth, nowDay + 1 - day).getTime()
  return res
}

/**
 * 获取本月开始时间
 */
export function getMonthStartTimestamp() {
  const now = new Date() // 当前日期
  var nowYear = now.getYear() // 当前年
  nowYear += nowYear < 2000 ? 1900 : 0
  const nowMonth = now.getMonth() // 当前月
  const res = new Date(nowYear, nowMonth, 1).getTime()
  return res
}
