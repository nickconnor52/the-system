import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  luckyNumber: '52',
  activeWeek: '17'
}
const getters = { }
const mutations = {
  setActiveWeek (state, data) {
    state.activeWeek = data
  }
}
const actions = { }

export default new Vuex.Store({
  state,
  // Current state of the application lies here.
  getters,
  // Compute derived state based on the current state. More like computed property.
  mutations,
  // Mutate the current state
  actions
  // Get data from server and send that to mutations to mutate the current state
})
