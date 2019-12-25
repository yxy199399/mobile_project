//接口列表
const APIMAP = {
  loginLogin: 'login/login',
  
  //获取手机验证码
  loginAuth: 'login/auth',

  //首次登录确认
  firstLogin: 'login/',
  //忘记密码获取验证码
  authSend: 'authSend/',
  authSendVerify: 'authSend/verify',

  //我的页面
  userMyPage: 'user/myPage/',
  userFavorite: 'user/favorite/',
  trackingBehavior: 'trackingBehavior/',
  authSendAuth: 'authSend/auth',

  //重置密码
  user: 'user/',

  //地址类的api
  userAddress: 'user/address/:uid',
  userAddressDefaultUid: 'user/address/default/:uid',
  userAddressDefault: 'user/address/default',
  address: 'address/',

  //修改手机号码
  userMobile: 'user/mobile',
  userPwd: 'user/pwd',
  userEmail: 'user/email',

  //我的积分
  userPoint: 'user/point/',
  userUsedHistory: 'user/usedHistory/',
  userPointMyCard: 'user/point/myCard',
  userUsedHistoryPointCardUid: 'user/usedHistory/pointCard/:uid',

  //我的订单
  myOrder: 'myOrder/',
  myOrderUid: 'myOrder/:uid',
  myOrderLogistics: 'myOrder/logistics/:uid',
  orderStatusUid: 'order/status/:uid',
  orderPayUid: 'order/pay/:uid',

  //我的收藏
  userFavorite: 'user/favorite/',
  userFavoriteUid: 'user/favorite/:uid',
  userCartUid: 'user/cart/:uid',

  // 商品
  shippingCharge: 'shippingCharge/:uid',
  userPointMyPoint: 'user/point/myPoint',
  orderCard: 'order/card',
  order: 'order/',
  orderUid: 'order/:uid',
  orderCart: 'order/cart',

  //购物车
  userCart: 'user/cart/',
  lockOrderCat: 'lockOrder/cat',
  userCartClean: 'user/cart/clean',

  //动态
  dynamic: 'dynamic/',
  dynamicCoolUid: 'dynamic/cool/:uid',
  dynamicUid: 'dynamic/:uid',
  dynamicUsers: 'dynamic/users',
  dynamicRecentContacts: 'dynamic/recentContacts',
  dynamicDeleteUid: 'dynamic/delete/:uid',

  //首页
  userHomePage: 'user/homePage/',
  userHomePageRecommend: 'user/homePage/recommend',
  userHomePageRanking: 'user/homePage/ranking',
  userHomePageNew: 'user/homePage/new',
  userHomePageBanner: 'user/homePage/banner',
  commodityUid: 'commodity/:uid',
  commodity: 'commodity/',
  userHomePageTags: 'user/homePage/tags',
  userHomePageCampaign: 'user/homePage/campaign',

  //商品详情
  lockOrder: 'lockOrder/',
  category: 'category/',

  // 上传头像
  ossUploadImage: 'ossUpload/image',
  userPhotoUid: 'user/photo/:uid',

  //微信授权
  userWeixinAgree: 'user/weixin/agree'
};

/***
 ** Api 操作类
***/
import axios from 'axios'
import sha1 from 'crypto-js/sha1';
import { Toast, Indicator } from 'mint-ui'
import Router from '../router'

let nonceStr = () => {
  const len = 6;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxPos = chars.length;
  let str = '';
  for (var i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

axios.defaults.baseURL = process.env.API_HOST;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//POST传参序列化
axios.interceptors.request.use((config) => {
	let timestamp = Date.parse(new Date());
  let nonce = nonceStr();
  let clinetType = 1;
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') clinetType = 3;
  let signParams = {
  	clinetType: clinetType,
		timestamp: timestamp,
    nonce: nonce,
    signature: sha1(timestamp + nonce + process.env.API_SIGNATURE_KEY).toString()
  }

	/***
	 ** axios请求参数注解
	 ** get,delete: 参数使用params提交
	 ** post,put: 参数使用data提交
  ***/
  //if (config.params) delete config.params.uid;
  //if (config.data) delete config.data.uid;
  // hl: 如果为真，则不显示loading; 默认显示loading
  if (config.method == 'get' || config.method == 'delete') {
  	config.params = Object.assign(config.params || {}, signParams);
  	config.params.hl ? Indicator.close() : Indicator.open();
  } else {
  	config.data = Object.assign(config.data || {}, signParams);
  	config.data.hl ? Indicator.close() : Indicator.open();
  }

  if(localStorage.getItem('token')){
    config.headers['Api-Access-Token'] = localStorage.getItem('token');
  }

  return config;
}, (error) => {
	Indicator.close();

	Toast({
		message: error.data.message,
		duration: 3000
	});

  return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) => {
	Indicator.close();

	if (res.data.code) {
		//301 重新登录
		if (res.data.code == 301 || res.data.code == 302 || res.data.code == 403) {
			Router.replace({
				path: '/mobile-mail/login'
			});
			return;
		}

		Toast({
			message: res.data.errors.message,
			duration: 3000
		});
	}
	
  return res;
}, (error) => {
	Indicator.close();
	if (!error.status) {
		Toast({
			message: '网络错误~',
			duration: 3000
		});
	}
	
  return Promise.reject(error);
});

//配置axios
let initApiConfig = (key, params) => {
	//返回请求路径
	let url = APIMAP[key];
	if (params && params['uid'] && url.indexOf(':uid') > -1) {
		let newUrl = url.replace(':uid', params['uid']);
		return newUrl;
	} else if (url.indexOf(':uid') > -1) {
		return url.replace(':uid', '');
	}
	return url;
}

/***
 ** 暴露请求方法
***/
export default {
	get: (key, params) => {
		let url = initApiConfig(key, params);
		return axios.get(url, {params: params});
	},

	post: (key, data) => {
		let url = initApiConfig(key, data);
		return axios.post(url, data);
	},

	put: (key, data) => {
		let url = initApiConfig(key, data);
		return axios.put(url, data);
	},

	delete: (key, params) => {
		let url = initApiConfig(key, params);
		return axios.delete(url, {params: params});
  }
}