import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
const socketOptions = {
  autoConnect: false // 自动连接     这里为我项目需求  需要在指定情况下才连接socket
}

Vue.use(
  new VueSocketIO({
    // debug: true,   // debug调试，生产建议关闭
    connection: SocketIO('http://localhost:8021', socketOptions)
    // allowEIO3:true,
    // extraHeaders: {
    //   'Access-Control-Allow-Credentials':true
    // },
    // store,          // 如果没有使用到store可以不用写
  })
)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$socket.open()
app.$mount('#app')
