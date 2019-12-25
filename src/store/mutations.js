import * as ALL from './mutation-types'
import { DYNAMIC_MEASSGE, WEIXINPAY_PARMA, KEEP_PAGE_STATE } from './mutation-types'
import Utils from '../helper/Utils'

export default {
	//存储用户信息
	[ALL.USER_INFO](state, userInfo) {
    localStorage.setItem('token', userInfo.token);
    sessionStorage.setItem('themeCssUrl', userInfo.spCssUrl);
    sessionStorage.setItem('htmlTitle', userInfo.corpName);
    state.userInfo = userInfo;
    Utils.cookieSet('token', userInfo.token);
    // alert(userInfo.token);

	},

	//用户退出登录
	[ALL.USER_LOGOUT](state) {
		localStorage.removeItem('token');
		state.userInfo = {};
  },
  
  //动态徽章和发布人信息
  [DYNAMIC_MEASSGE](state, dynamic) {
    state.dynamicMsg = dynamic;
  },

  [WEIXINPAY_PARMA] (state, weixinpay) {
    state.weixinpayParmas = weixinpay;
  },

  [KEEP_PAGE_STATE] (state, pageState) {
    state.pageState = pageState;
  }
}