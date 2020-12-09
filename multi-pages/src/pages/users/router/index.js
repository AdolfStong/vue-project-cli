/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-25 15:25:13
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-06 15:52:44
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'users',
    meta: {
      title: '学员中心',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    // TOSS,根据老师角色跳转
    redirect: '/system'
  },

  {
    path: '/system',
    name: 'systemUsers',
    meta: {
      title: '系统课学员',
      keepAlive: true
    },
    component: () => import('../views/index.vue')
  },
  {
    path: '/studyRecord',
    name: 'studyRecord',
    meta: {
      title: '学习记录',
      keepAlive: true
    },
    component: () => import('../views/learnRecord/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'trading',
  routes
})

export default router
