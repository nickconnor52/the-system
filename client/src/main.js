// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import store from './store/store'
import axios from 'axios'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'es6-promise/auto'

require('highcharts/modules/no-data-to-display')(Highcharts)

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(HighchartsVue)
Vue.config.productionTip = false

window.Vue = require('vue')
window.axios = require('axios')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store,
  axios
})
