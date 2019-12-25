<template>
	<div id="container">
		<div class="gHeader">
			<h1>登录</h1>
			<div class="password standard"><router-link to="/phone/back-password">忘记密码</router-link></div>
		</div>

		<div class="main">
			<div class="formPage">
				<div class="formPart">
					<p class="headLine01">手机/邮箱登录</p>
					<div class="formItem">
						<div class="formRow">
							<div class="formName">
								<p>账号<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="50" type="text" placeholder="手机号/邮箱" v-model="item.loginId">
							</div>
						</div>
						
						<div class="formRow">
							<div class="formName">
								<p>密码<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="50" type="password" placeholder="请输入密码" v-model="item.password">
							</div>
						</div>
					</div>
				</div>
				<button class="btnSubmit btnSubmit02" @click="doLogin">登录</button>
			</div>

			<div ref="formLink" class="formLink">
        <span><router-link to="/crop/login">企业账号登录</router-link></span>
				<span><router-link to="/mobile/auth/login">手机验证码登录</router-link></span>
			</div>

		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	data () {
    const query = this.$route.query;
		return {
      query: query,
			item: {
				loginId: '',
				password: '',
        loginType: 1
      },
      openId: ''
		}
	},

	methods: {
    ...mapMutations({
      setUserInfo: 'USER_INFO'
    }),

		doLogin() {
			let msg = '';
			if (!this.item.loginId) {
				msg += '请输入手机号/邮箱\n';
			} else {
				if (this.item.loginId.indexOf('@') > -1) {
					if (!this.Utils.validateMail(this.item.loginId)) {
						msg += '请输入正确的邮箱地址\n';
					}
				} else {
					if (!this.Utils.validateMobile(this.item.loginId)) {
						msg += '请输入正确的手机号\n';
					}
				}
			}

			if (!this.item.password) {
				msg += '请输入密码';
			}

			if (msg) {
				this.$toast({
				  message: msg,
				  duration: 1500
				});
				return;
			}

      let openId = this.Utils.cookieGet('ic.openId');
      if (openId) {
        this.item.openId = openId;
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
    
    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      this.$refs['formLink'].style.marginTop = (clientHeight - htmlHeight) + 'px';
    }
  },

  created() {
    let isWX = this.Utils.isWX();
    if (isWX) {
      if (this.query.code) {
        this.Api.get('userWeixinAgree', {
          code: this.query.code
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          let data = res.data.data;
          if (data.token) {
            this.setUserInfo(data);
            this.Utils.cookieSet('ic.openId', data.weixinId);
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
          } else {
            this.Utils.cookieSet('ic.openId', data.openId);
          }
        })
      } else {
        this.Utils.getWXUserInfoCode(process.env.SITE_URL + 'mobile-mail/login');
      }
    }
  },

  mounted() {
    this.setHeight();
  }
}
</script>

