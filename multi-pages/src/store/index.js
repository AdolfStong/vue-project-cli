/*
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:05:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-08 16:21:31
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
// import user from './modules/user'
import leftbar from './modules/leftbar'
import team from './modules/team'
import tabbed from './modules/tabbed'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    // user
    leftbar,
    tagsView,
    team,
    tabbed
  },
  getters
})

export default store
