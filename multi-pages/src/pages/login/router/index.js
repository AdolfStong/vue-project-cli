/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 17:04:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-30 17:02:03
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登录',
      icon: 'el-icon-s-custom',
      keepAlive: false
    },
    component: () => import('../views/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
