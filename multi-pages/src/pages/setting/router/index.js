/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 11:29:05
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-07 22:24:28
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 自身内部路由
const routes = [
  {
    path: '/userSetting',
    name: 'userSetting',
    meta: {
      title: '账号设置',
      keepAlive: false
    },
    component: () => import('../views/userSetting.vue')
  },
  {
    path: '/sysSettingChild',
    name: 'sysSettingChild',
    meta: {
      title: '系统设置-1',
      keepAlive: false
    },
    component: () => import('../views/sysSetting.vue')
  }
]
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'setting',
  routes
})

export default router
