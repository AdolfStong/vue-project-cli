/*
 * @Descripttion: 组合所有接口文件
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-06 13:56:23
 */

import Login from './modules/Login'
import User from './modules/User' // 用户接口
import Dashboard from './modules/Dashboard' // 个人工作台(toss 服务部门)

export default Object.assign({}, { Login }, { User }, { Dashboard })
