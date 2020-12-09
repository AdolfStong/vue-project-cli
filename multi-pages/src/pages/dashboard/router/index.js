/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 11:29:05
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-06 13:47:42
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 自身内部路由
const routes = [
  {
    path: '/',
    name: 'dashboardIndex',
    meta: {
      title: '重定向',
      icon: 'el-icon-menu'
    },
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '个人工作台',
      keepAlive: false
    },
    component: () => import('../views/dashboard.vue')
  }
]
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'dashboard',
  routes
})

export default router
