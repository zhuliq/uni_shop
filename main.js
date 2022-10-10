import App from './App'
import request from 'common/request.js'

uni.$http = request
// 封装展示消息提示的方法
uni.$showMsg = function(title='数据请求失败！', duration=1500) {
  uni.showToast({
    title: title,
    duration: duration,
    icon: 'none'
  })
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
