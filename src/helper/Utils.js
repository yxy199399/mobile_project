import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";

/***
 ** Utils 工具类集合
***/
export default {
	validateMobile: (mobile) => {
		var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
		return reg.test(mobile);
	},

	validateMail: (email) => {
		var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
		return reg.test(email);
  },

  validatePassword: (password) => {
    var reg = /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/;
    return reg.test(password);
  },
  
  	//设置检索缓存
	setFilter: (moduleName, filterData) => {
		sessionStorage.setItem('filtter.' + moduleName, JSON.stringify(filterData));
	},

	//读取检索缓存
	getFilter: (moduleName) => {
		if (sessionStorage.getItem('filtter.' + moduleName)) {
			return JSON.parse(sessionStorage.getItem('filtter.' + moduleName));
		}
		return null;
	},

	//清空检索缓存
	removeAllFilter() {
		sessionStorage.clear();
  },
  
  //倒计时
  downTime(futureTime) {
     let showTime = {
       d: '',
       h: '',
       m: '',
       s: '',
     }
     //获取当前时间
     let date = new Date();
     let now = date.getTime();

     //时间差
     let leftTime = futureTime - now;

     //定义变量 d,h,m,s保存倒计时的时间
     if (leftTime >= 0) {
      showTime.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      showTime.h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
      showTime.m = Math.floor((leftTime / 1000 / 60) % 60);
      showTime.s = Math.floor((leftTime / 1000) % 60);
      if (showTime.s < 10) {
        showTime.s = "0" + showTime.s;
      }
      if (showTime.m < 10) {
        showTime.m = "0" + showTime.m;
      }
      if (showTime.h< 10) {
        showTime.h = "0" + showTime.h;
      }
    }else{
      showTime.d ='00';
      showTime.h ='00';
      showTime.m ='00';
      showTime.s ='00';
    }

    return showTime;
  },

  getCursortPosition: function(obj) {
    var cursorIndex = 0;
    if (obj.selectionStart || obj.selectionStart==0) {
        cursorIndex = obj.selectionStart;
    }
    return cursorIndex;
  },

  entitiestoUtf16: function(str) {
    // 检测出形如&#12345;形式的字符串
    var strObj = this.utf16toEntities(str);
    var patt = /&#\d+;/g;
    var H,L,code;
    var arr = strObj.match(patt)||[];
    for (var i=0;i<arr.length;i++){
        code = arr[i];
        code = code.replace('&#', '').replace(';','');
        // 高位
        H = Math.floor((code-0x10000) / 0x400)+0xD800;
        // 低位
        L = (code - 0x10000) % 0x400 + 0xDC00;
        code = "&#"+code+";";
        var s = String.fromCharCode(H,L);
        strObj = strObj.replace(code, s);
    }
    return strObj;
  },

  utf16toEntities: function(str) {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
    // 检测utf16字符正则
    var newStr = (str + '').replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0);
            // 取出高位
            L = char.charCodeAt(1);
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return newStr;
  },

  isWX: function() {
    //return true;
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == 'micromessenger';
  },

  getWXUserInfoCode: function(backUrl) {
    var appid = process.env.WXAPPID;
    var redirect_uri = encodeURIComponent(backUrl);
    var wxUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    window.location.href = wxUrl;
  },

  importThemeCss(url) {
    if (url && !document.getElementById('companyStyle')) {
      var link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("id", "companyStyle");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", url);
      var heads = document.getElementsByTagName("head")[0];
      heads.appendChild(link);
    }
  },

  //Cookie操作
	getCookieVal: function(offset) {
		var endstr = document.cookie.indexOf(";", offset);  
		if (endstr == -1) endstr = document.cookie.length;  
		return unescape(document.cookie.substring(offset, endstr));
	},
	cookieGet: function(key) {
		var arg = key + "=";  
		var alen = arg.length;  
		var clen = document.cookie.length;  
		var i = 0;  
		while (i < clen) {  
			var j = i + alen;  
			if (document.cookie.substring(i, j) == arg) return this.getCookieVal(j);  
			i = document.cookie.indexOf(" ", i) + 1;  
			if (i == 0) break;  
		}  
		return null;
	},
	cookieSet: function(key, value) {
		var exp = new Date();  
		exp.setTime(exp.getTime() + 60 * 60 * 24 * 365 * 1000); //一年有效
		document.cookie = key + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
	},


}