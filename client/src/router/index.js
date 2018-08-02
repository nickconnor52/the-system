import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Matchups from '@/components/Matchups'
import PickTracker from '@/components/PickTracker'

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
    },
    {
      path: '/pick-tracker',
      name: 'PickTracker',
      component: PickTracker
    }
  ]
})
