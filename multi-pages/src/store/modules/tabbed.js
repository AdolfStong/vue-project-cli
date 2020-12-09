/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-16 15:26:41
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-16 22:52:27
 * @Description: 多页签打开
 */
const getDefaultState = () => {
  return {
    // 当前选中页签
    currentTabbed: null,
    tabbedList: {}
  }
}
const state = getDefaultState()

const mutations = {
  SET_CURRENT_TABBED: (state, tab = '') => {
    state.currentTabbed = tab
  },
  SET_TABBED_LIST: (state, tab = '') => {
    state.tabbedList = tab
  }
}

const actions = {
  setCurrentTabbed({ commit, state }, tab = '') {
    commit('SET_CURRENT_TABBED', tab)
  },
  setTabbedList({ commit, state }, tab = '') {
    commit('SET_TABBED_LIST', tab)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
