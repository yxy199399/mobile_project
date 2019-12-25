<template>
	<div id="container">
		<div class="gHeader">
			<h1>登录</h1>
			<div class="password standard"><router-link to="/phone/back-password">忘记密码</router-link></div>
		</div>

		<div class="main">
			<div class="formPage">
				<div class="formPart">
					<p class="headLine01">企业账号登录</p>
					<div class="formItem">
						<div class="formRow">
							<div class="formName">
								<p>企业号<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="20" type="text" placeholder="企业编号" v-model="item.corpNo">
							</div>
						</div>
						
						<div class="formRow">
							<div class="formName">
								<p>账号<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="20" type="text" placeholder="账号" v-model="item.loginId">
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
        <span><router-link to="/mobile-mail/login">手机号/邮箱登录</router-link></span>
				<span><router-link to="/mobile/auth/login">手机验证码登录</router-link></span>
			</div>

		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      item: {
        loginId: '',			
        password: '',			
        corpNo: '',					
        loginType: 2
      }
    }
  },

  methods: {
    ...mapMutations({
      setUserInfo: 'USER_INFO'
    }),

    doLogin() {
      let msg = '';
      if (!this.item.loginId) {
        msg += '请输入企业名称\n';
      }

      if (!this.item.corpNo) {
        msg += '请输入账号\n';
      }

      if (!this.item.password) {
        msg += '请输入密码\n';
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