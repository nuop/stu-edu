import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入elementui
import ElementUI from 'element-ui'
// 引入elementui样式
// import 'element-ui/lib/theme-chalk/index.css'

// 引入自动以的样式
import './styles/index.scss'

Vue.config.productionTip = false

// 注册为vue插件
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
