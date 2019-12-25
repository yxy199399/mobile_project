<template>
  <div id="container">
    <div class="gHeader">
      <h1>重置密码</h1>
    </div>

    <div class="main">
      <div class="formPage">
        <div class="formPart">
          <p class="headLine01">重新设置密码</p>
          <div class="formItem">
            <div class="formRow">
              <div class="formName">
                <p>新密码<i></i></p>
              </div>
              <div class="formFill">
                <input type="password" minlength="8" maxlength="16" v-model="item.password" placeholder="请输入8~16位英文数字组合密码">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>密码确认<i></i></p>
              </div>
              <div class="formFill">
                <input type="password" minlength="8" maxlength="16" v-model="repassword" placeholder="请再次输入密码">
              </div>
            </div>
            <div class="formRow phoneVerify">
              <p v-if="query.id == 1"><router-link to="/mail/back-password">邮箱验证</router-link></p>
              <p v-if="query.id == 0"><router-link to="/phone/back-password">手机号验证</router-link></p>
            </div>
          </div>
        </div>
        <button class="btnSubmit" @click="doSure">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const query = this.$route.query;
    return {
      query: query,
      item: {
        authType: '',			
        email: '',				
        mobile: '',				
        password: ''				
      },
      repassword: '',
      userInfo: {},
      paramsType: 0,
    }
  },

  methods: {
    doSure() {
      let msg = '';

      if (!this.item.password) {
        msg += '请输入密码\n'
      } else if (!this.Utils.validatePassword(this.item.password)) {
        msg += '密码必须是由8~16位的字母和数字组合\n'
      }

      if (!this.repassword) {
        msg += '请输入确认密码\n'
      } else if(this.repassword !== this.item.password) {
        msg += '两次输入的密码不一致\n'
      }

      if (msg) {
				this.$toast({
				  message: msg,
				  duration: 1500
				});
				return;
      }
      
      this.Api.put('user', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
					return;
        }
        this.$router.push({
          name: 'mobileMailLogin'
        })
      })
    }
  },

  mounted() {
    this.item.authType = this.query.id;
    if (this.query.mobile) {
      this.item.mobile = this.query.mobile;
    } else if (this.query.email) {
      this.item.email = this.query.email;
    }
  },

  watch: {
    '$route' (to, from) {
      this.item.authType = this.$route.params.id;
     }
  }
  
}
</script>