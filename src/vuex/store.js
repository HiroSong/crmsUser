import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 1、state：创建初始化状态
const state = {
  token: window.sessionStorage.getItem('token'),
  id: window.sessionStorage.getItem('id'),
  role: window.sessionStorage.getItem('role'),
  beActive: window.sessionStorage.getItem('beActive'),
  screenWidth: document.documentElement.clientWidth,
  screenHeight: document.documentElement.clientHeight,
  isCollapse: false,
  isMobile: navigator.userAgent.toLowerCase().match(/(phone|pad|pod|iphone|ipod|ios|ipad|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian|windows phone)/i) !== null,
  isVertical: document.documentElement.clientWidth < document.documentElement.clientHeight
}

// 2、mutations：创建改变状态的方法
const mutations = {
  // 状态变更函数-一般大写
  SET_AUTH(state, payload) {
    state.token = payload.token
    state.role = payload.role
    state.id = payload.id
    state.beActive = payload.beActive
    window.sessionStorage.setItem('token', payload.token)
    window.sessionStorage.setItem('id', payload.id)
    window.sessionStorage.setItem('role', payload.role)
    window.sessionStorage.setItem('beActive', payload.beActive)
  },
  CLEAR_AUTH(state) {
    state.token = undefined
    state.id = undefined
    state.role = undefined
    state.beActive = undefined
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('id')
    window.sessionStorage.removeItem('role')
    window.sessionStorage.removeItem('beActive')
  },
  SET_COLLAPSE(state, payload) {
    state.isCollapse = payload.isCollapse
  },
  ACTIVE_ACCOUNT(state, payload) {
    state.beActive = payload.beActive
  }
}

// 3、getters：提供外部获取state
const getters = {}

// 4、actions：创建驱动方法改变mutations
const actions = {
  // 触发mutations中相应的方法-一般小写
}

// 5、全部注入Store中
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

// 6、输出store
export default store
