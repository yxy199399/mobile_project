<template>
	<div id="container">
		<div class="gHeader">
			<h1>登录</h1>
      <div class="password standard"><router-link to="/phone/back-password">忘记密码</router-link></div>
		</div>

		<div class="main">
			<div class="formPage">
				<div class="formPart">
					<p class="headLine01">手机验证码登录</p>
					<div class="formItem">
						<div class="formRow">
							<div class="formName">
								<p>手机号<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="11" v-model="item.loginId" type="tel" placeholder="请输入手机号">
							</div>
						</div>

						<div class="formRow">
							<div class="formName">
								<p>验证码<i></i></p>
							</div>
							<div class="yzm clearfix">
								<input maxlength="6" v-model="item.authCode" type="text" placeholder="6位验证码">
								<button :disabled="downTime != downTimeT" @click="getVerif">{{getVerifButn}}</button>
							</div>
						</div>
					</div>
				</div>
				<button class="btnSubmit btnSubmit02" @click="doLogin">登录</button>
			</div>
      <div ref="formLink" class="formLink">
				<span><router-link to="/crop/login">企业账号登录</router-link></span>
				<span><router-link to="/mobile-mail/login">手机号/邮箱登录</router-link></span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	data () {
		return {
      item: {
        loginId: '',			
        authCode: '',		
        loginType: 3			
      },

      getVerifButn: '获取验证码',
      downTime: 60,
      downTimeT: 60
		}
	},

	methods: {
    ...mapMutations({
      setUserInfo: 'USER_INFO'
    }),

    doLogin() {
      let msg = '';
      if (!this.item.loginId) {
        msg += '请输入手机号\n'
      } else if (!this.Utils.validateMobile(this.item.loginId)) {
        msg += '请输入正确的手机号\n';
      }
      

      if (!this.item.authCode) {
        msg += '请输入验证码'
      }

      if (msg) {
        this.$toast({
				  message: msg,
				  duration: 1500
				});
			  return;
      }

      this.Api.post('loginLogin', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }

        let data = res.data.data;
        this.setUserInfo(data);
        if (data.firstLoginFlg === 1) {
          this.$router.push({
            name: 'firstLogin',
            params: {
              id: data.jumpType
            }
          });
          return;
        }
        this.$router.push({
          name: 'homeIndex'
        })
      })
    },

    getVerif() {
      let msg = '';
      if (!this.item.loginId) {
        msg += '请输入手机号\n';
      } else if (!this.Utils.validateMobile(this.item.loginId)) {
        msg += '请输入正确的手机号\n';
      }
      

      if (msg) {
        this.$toast({
				  message: msg,
				  duration: 1500
				});
			  return;
      }
    
      this.Api.post('loginAuth', {
        mobile: this.item.loginId
      })
      .then(res => {
        
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }

        this.$toast('手机验证码发送成功，请注意查收');
        this.downTime = this.downTimeT;
        let timer = setInterval(_ => {
          if (this.downTime <= 0) {
            clearInterval(timer);
            this.downTime = this.downTimeT;
            this.getVerifButn ='获取验证码';
            return;
          }
          this.downTime --;
          this.getVerifButn = this.downTime + '秒后重新获取'
          
        }, 1000);
        
      })
    },

    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      this.$refs['formLink'].style.marginTop = (clientHeight - htmlHeight) + 'px';
    }
  },
  
  mounted() {
    this.setHeight();
  }
}
</script>