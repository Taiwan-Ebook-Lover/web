// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import _ from 'lodash'

import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import App from './App'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(_)

Vue.use(Vuetify, {
  theme: {
    primary: '#455A64',
    secondary: '#757575',
    accent: '#448AFF',
    error: '#FF5252',
    warning: '#FFA726',
    info: '#2196f3',
    success: '#9CCC65',
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
