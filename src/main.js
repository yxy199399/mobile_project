// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'
import 'babel-polyfill'
import App from './App'
import router from './router'
import store from './store'
import Api from './helper/Api'
import Utils from './helper/Utils'
import Strings from './helper/Strings'
import Filters from './helper/Filters'
import Session from './helper/Session'
import './assets/style.css'
import './assets/css/font-bo.css'
import './assets/css/font-awesome.min.css'

//Mint UI
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);

import { Popup } from 'mint-ui';
Vue.component(Popup.name, Popup);

import { CellSwipe } from 'mint-ui';
Vue.component(CellSwipe.name, CellSwipe);


//全局
Vue.prototype.dayjs = dayjs
Vue.prototype.Strings = Strings
Vue.prototype.Api = Api
Vue.prototype.Utils = Utils
Vue.prototype.Session = Session

//过滤器
Object.keys(Filters).forEach(key => {  
  Vue.filter(key, Filters[key])  
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
