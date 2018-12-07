import Vue from 'vue'
// import axios from '@/common/axios'

import App from './App'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import '@/common/lib/iconfont/iconfont.css'
import '@/common/styles/styles.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')