import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Matchups from '@/components/Matchups'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/matchups',
      name: 'Matchups',
      component: Matchups
    }
  ]
})
