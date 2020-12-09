/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-06 14:07:26
 */
import axios from 'axios'
import _ from 'lodash'
import { removeToken } from '@/utils/auth'

// 测试环境配置
// const isTest = process.env.BASE_URL === 'ghpagestest'
// const isTest = location.href.indexOf('test.')
// axios.defaults.baseURL = isTest ? 'http://47.98.38.59:43401' : ''
// 请求超时时间
axios.defaults.timeout = 240000

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(
  (config) => {
    // 非graphql服务接口，统一回科目类型
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    let _data = null
    if (response.status === 200) {
      _data = response.data
      const {
        config: { url = '' }
      } = response
      if (_.isPlainObject(_data) && _data.code) {
        switch (_data.code) {
          case '0':
            _data = null
            break
          case '2':
          default:
            window._Vue.$message.error(_data.errors || `服务器异常: api-${url}`)
            break
        }
      }
    }
    return _data
  },
  (err) => {
    const errResponse = err.response || { status: 'fail' }
    const { config: { url = '' } = {}, status } = errResponse
    let errMsg = `服务器异常-${url}`

    switch (status) {
      case 400:
        errMsg = `参数错误-${url}`
        break
      case 401: {
        errMsg = `没有权限，禁止登录`
        break
      }
      case 404: {
        errMsg = `接口不存在-${url}`
        break
      }
      case 500:
      default:
        break
    }

    if (!document.getElementsByClassName('el-message').length) {
      window._Vue.$message({
        type: 'error',
        message: errMsg,
        onClose: () => {
          if (status === 401) {
            removeToken()
            location.href = `/login/#/`
          }
        }
      })
    }

    return errResponse
  }
)

export default axios
