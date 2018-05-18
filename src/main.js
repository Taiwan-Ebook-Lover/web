// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Row, Col, Main, Header, Tag, Input, Button, Icon } from 'element-ui'
import lodash from 'lodash'
import App from './App'
import 'element-ui/lib/theme-chalk/display.css'

Vue.config.productionTip = false

Vue.use(Row)
Vue.use(Col)
Vue.use(Main)
Vue.use(Header)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App}
})
