/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-24 17:30:50
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-03 16:15:22
 */
/**
 * Created by 1 on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}
/**
 * 通过班级的当前课程计算当前开课周数及节次
 **/
export function calculateWD(currentLesson) {
  let w = -1
  let d = -1
  const wReg = /U(.+?)Lesson/g // 匹配 U开头 L结尾的字符串
  let wRes = null
  do {
    wRes = wReg.exec(currentLesson)
    if (wRes) {
      w = wRes[1]
      break
    }
  } while (wRes)

  const dReg = /Lesson(.+?)/g // 匹配 Lesson 开头的数字
  let dRes = null
  do {
    dRes = dReg.exec(currentLesson)
    if (dRes) {
      d = dRes[1]
      break
    }
  } while (dRes)
  if (w < 0 || d < 0) {
    return ''
  }
  return 'W' + w + 'D' + d
}

/**
 * @description 校验设置密码
 * @static 至少包含大小写字母、数字、特殊字符大于8个字符
 * @example var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
 */

export function validatePwd(pwd = '') {
  return /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/.test(
    pwd
  )
}
