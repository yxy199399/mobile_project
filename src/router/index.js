import Vue from 'vue'
import Router from 'vue-router';
import Utils from '../helper/Utils';

Vue.use(Router)

const routes = [
      //默认首页
  { path: '/', redirect: '/mobile-mail/login' },
  { path: '*', redirect: '/mobile-mail/login' },

  // {
  //   name: 'weixinAuth',
  //   path: '/weixin/auth',
  //   component: resolve => require(['../pages/account/WeixinAuth.vue'], resolve)
  // },
  
	{
    name: 'mobileAuthLogin',
    path: '/mobile/auth/login',
    component: resolve => require(['../pages/account/MobileAuthLogin.vue'], resolve)
  },

  {
    name: 'mobileMailLogin',
    path: '/mobile-mail/login',
    component: resolve => require(['../pages/account/MobileMailLogin.vue'], resolve)
  },

  {
    name: 'corpLogin',
    path: '/crop/login',
    component: resolve => require(['../pages/account/CorpLogin.vue'], resolve)
  },

  {
    name: 'firstLogin',
    path: '/first/login/:id',
    component: resolve => require(['../pages/account/FirstLogin.vue'], resolve)
  },

  {
    name: 'phoneBackPassword',
    path: '/phone/back-password',
    component: resolve => require(['../pages/account/PhoneBackPassword.vue'], resolve)
  },

  {
    name: 'mailBackPassword',
    path: '/mail/back-password',
    component: resolve => require(['../pages/account/MailBackPassword.vue'], resolve)
  },

  {
    name: 'resetPassword',
    path: '/reset/password',
    component: resolve => require(['../pages/account/ResetPassword.vue'], resolve)
  },

  {
    name: 'user',
    path: '/',
    component: resolve => require(['../pages/user/User.vue'], resolve),
    children: [
      {
        name: 'userCenter',
        path: '/user/center',
        component: resolve =>  require(['../pages/user/UserCenter.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'addressList',
        path: '/address/list',
        component: resolve =>  require(['../pages/user/AddressList.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'addressEdit',
        path: '/address/edit/:id',
        component: resolve =>  require(['../pages/user/AddressEdit.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'userAccount',
        path: '/user/account',
        component: resolve =>  require(['../pages/user/UserAccount.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'resetEmail',
        path: '/reset/email',
        component: resolve =>  require(['../pages/user/ResetEmail.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'resetPhone',
        path: '/reset/phone',
        component: resolve =>  require(['../pages/user/ResetPhone.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'userResetPassword',
        path: '/user/reset-password',
        component: resolve =>  require(['../pages/user/UserResetPassword.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'order',
        path: '/order',
        component: resolve =>  require(['../pages/user/Order.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'orderComfirm',
        path: '/order/comfirm',
        component: resolve =>  require(['../pages/user/orderComfirm.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'orderDetail',
        path: '/order/detail/:id',
        component: resolve =>  require(['../pages/user/OrderDetail.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'orderComplete',
        path: '/order/complete',
        component: resolve =>  require(['../pages/user/OrderComplete.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'shipping',
        path: '/order/Shipping/:id',
        component: resolve =>  require(['../pages/user/Shipping.vue'], resolve),
        meta: { requireAuth: true },
      },
      
      // // TODO
      // {
      //   name: 'orderCompleteTest',
      //   path: '/order/completeTest',
      //   component: resolve =>  require(['../pages/user/OrderCompleteTest.vue'], resolve),
      //   meta: { requireAuth: true },
      // },

      {
        name: 'integral',
        path: '/integral',
        component: resolve =>  require(['../pages/user/Integral.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'integralCard',
        path: '/integral/card',
        component: resolve =>  require(['../pages/user/IntegralCard.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'collection',
        path: '/collection',
        component: resolve =>  require(['../pages/user/Collection.vue'], resolve),
        meta: { requireAuth: true }
      },

      {
        name: 'tracking',
        path: '/tracking',
        component: resolve =>  require(['../pages/user/Tracking.vue'], resolve),
        meta: { requireAuth: true }
      }
      
    ]
  },
  
  {
    name: 'shoppingCart',
    path: '/shoping/cart',
    component: resolve =>  require(['../pages/user/ShoppingCart.vue'], resolve),
    meta: { requireAuth: true }
  },

  {
    name: 'goodsDetail',
    path: '/goods/detail/:id',
    component: resolve =>  require(['../pages/user/GoodsDetail.vue'], resolve),
    // meta: { requireAuth: true }
  },

  {
    name: 'home',
    path: '/',
    component: resolve => require(['../pages/home/Home.vue'], resolve),
    // meta: { requireAuth: true },
    children: [
      {
        name: 'homeIndex',
        path: '/home/index',
        component: resolve => require(['../pages/home/Index.vue'], resolve),
        // meta: { requireAuth: true },
      }
    ]
  },

  {
    name: 'category',
    path: '/',
    component: resolve =>  require(['../pages/category/Category.vue'], resolve),
    // meta: { requireAuth: true },
    children: [
      {
        name: 'categoryType',
        path: '/category/type',
        component: resolve => require(['../pages/category/CategoryType.vue'], resolve),
        // meta: { requireAuth: true },
      },

      {
        name: 'categoryList',
        path: '/category/list',
        component: resolve => require(['../pages/category/CategoryList.vue'], resolve),
        // meta: { requireAuth: true },
      },

      {
        name: 'categorySearch',
        path: '/category/search',
        component: resolve => require(['../pages/category/CategorySearch.vue'], resolve),
        // meta: { requireAuth: true },
      }
    ]
  },

  {
    name: 'dynamic',
    path: '/',
    component: resolve =>  require(['../pages/dynamic/Dynamic.vue'], resolve),
    meta: { requireAuth: true },
    children: [
      {
        name: 'dynamicList',
        path: '/dynamic/list',
        component: resolve => require(['../pages/dynamic/DynamicList.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'dynamicSend',
        path: '/dynamic/send',
        component: resolve => require(['../pages/dynamic/DynamicSend.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'dynamicNotice',
        path: '/dynamic/notice',
        component: resolve => require(['../pages/dynamic/DynamicNotice.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'dynamicObject',
        path: '/dynamic/object',
        component: resolve => require(['../pages/dynamic/DynamicObject.vue'], resolve),
        meta: { requireAuth: true },
      },

      {
        name: 'dynamicMedal',
        path: '/dynamic/medal',
        component: resolve => require(['../pages/dynamic/DynamicMedal.vue'], resolve),
        meta: { requireAuth: true },
      }
    ]
  },
  
];

const router = new Router({
	mode: 'history',
	base: process.env.ROUTER_BASE,
	routes: routes
})

const routerChange = () => {
  let loadSvgElem = document.getElementById('loadSvg');
  if (!loadSvgElem) {
    let spriteUrl = '/static/sprite.svg';
    if (process.env.NODE_ENV != 'development') {
      spriteUrl = process.env.ROUTER_BASE + 'static/sprite.svg';
    }
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', spriteUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
        let svgCode = xhr.responseText;
        let loadSvgElemDiv = document.createElement('div');
        loadSvgElemDiv.id = 'loadSvg';
        loadSvgElemDiv.innerHTML = svgCode;
        document.body.appendChild(loadSvgElemDiv);
      }
    }
    xhr.send();
  }
}

router.beforeEach((to, from, next) => {
  Utils.importThemeCss(sessionStorage.getItem('themeCssUrl'));
  let htmlTitle = sessionStorage.getItem('htmlTitle');
  document.title = htmlTitle ? htmlTitle : 'ic_mobile';
  routerChange();
  let userCookie = Utils.cookieGet('token');
	if (to.matched.some(r => r.meta.requireAuth)) {
    if (to.name === 'orderComplete') {
      if (userCookie) {
        next()
        return;
      } else {
        next('/mobile-mail/login');
      }
    }
		if (localStorage.getItem('token')) {
			next();
		} else {
      next('/mobile-mail/login');
		}
	} else {
		next();
	}

})

export default router;