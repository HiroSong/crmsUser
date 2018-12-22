// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import axios from './util/request'
import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cube from 'cube-ui'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'

import datetimeFormat from './util/datetime';

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Cube)

Vue.prototype.$http = axios
Vue.prototype.$datetimeFormat = datetimeFormat

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: {
    App
  },
  template: '<App/>'
})()
