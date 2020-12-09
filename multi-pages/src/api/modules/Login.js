/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 19:46:39
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-19 11:44:30
 */
import axios from '../axiosConfig'
export default {
  /**
   * 根据手机号获取code
   *
   */
  getCodeByPhone(params) {
    return axios.post(`/api/t/v1/teacher/sendCode?mobile=${params.mobile}`)
  },
  /**
   * 验证码登录
   * */
  codeLoginIn(params) {
    return axios.post(`/api/t/v1/teacher/login`, params)
  },
  /**
   * 密码登录
   * */
  pwdLoginIn(params) {
    return axios.post('/api/t/v1/teacher/teacherLogin', params)
  },
  /**
   * 查找操作日志
   * */
  getLoginRecord(params) {
    return axios.get(
      `/api/t/v1/operatelog/getLog?uid=${params.uid}&type=${params.type}&page=${params.page}&pagesize=${params.size}&ifAdmin=${params.ifAdmin}`
    )
  }
}
