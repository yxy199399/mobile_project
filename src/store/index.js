import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from 'vuex-along'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: {},
  dynamicMsg: {},
  weixinpayParmas: {},
  pageState: {
    categoryList: {}
  }
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	plugins: [vuexAlong]
})