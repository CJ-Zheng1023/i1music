import Vue from 'vue'
// import axios from '@/common/axios'

import App from './App'
import router from './router'
import store from './store'
import {Row, Col, Button, ButtonGroup, Table, TableColumn} from 'element-ui'
import BScroll from 'better-scroll'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/common/lib/iconfont/iconfont.css'
import '@/common/styles/styles.less'
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// Vue.http = Vue.prototype.$http = axios
Vue.BScroll = Vue.prototype.$BScroll = BScroll
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
