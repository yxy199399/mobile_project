<template>
	<div id="container">
    <div class="gHeader">
      <h1>忘记密码</h1>
    </div>

    <div class="main">
      <div class="formPage">
        <div class="formPart">
          <p class="headLine01">邮箱验证</p>
          <div class="formItem">
            <div class="formRow">
              <div class="formName">
                <p>邮箱<i></i></p>
              </div>
              <div class="formFill">
                <input maxlength="50" type="tel" v-model="item.email" placeholder="请输入邮箱" >
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>验证码<i></i></p>
              </div>
              <div class="yzm clearfix">
                <input maxlength="6" type="text" v-model="item.authCode" placeholder="6位验证码">
                <button :disabled="downTime != downTimeT" @click="getVerif">{{getVerifButn}}</button>
              </div>
            </div>
            <div class="formRow phoneVerify">
              <p><router-link to="/phone/back-password">手机号验证</router-link></p>
            </div>
          </div>
        </div>
        <button :disabled="!item.email || !item.authCode" class="btnSubmit btnSubmit02" :class="{btnDisabled : !item.email || !item.authCode}"  @click="doNext">下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	data () {
		return {
      item: {
        email: '',			
        authType: 0,		
        authCode: ''			
      },

      getVerifButn: '获取验证码',
      downTime: 60,
      downTimeT: 60,
      isNext: false
		}
	},

	methods: {
    doNext() {
      let msg = '';
      if (!this.Utils.validateMail(this.item.email)) {
        msg += '请输入正确的邮箱\n';
      }

      if (msg) {
        this.$toast({
				  message: msg,
				  duration: 1500
				});
			  return;
      }

      this.Api.put('authSendVerify', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        // if (!res.data.data.firstLoginFlg) {
          this.$router.push({
            name: 'resetPassword',
            query: {
              id: this.item.authType,
              email: this.item.email
            }
          });
        // }
      })
    },

    getVerif() {
      let msg = '';
      if (!this.item.email) {
        msg += '请输入邮箱\n';
      } else if (!this.Utils.validateMail(this.item.email)) {
        msg += '请输入正确的邮箱\n';
      }
      

      if (msg) {
        this.$toast({
				  message: msg,
				  duration: 1500
				});
			  return;
      }
    
      this.Api.post('authSend', {
        email: this.item.email,
        authType: this.item.authType
      })
      .then(res => {
        
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }

        this.$toast('邮箱验证码发送成功，请注意查收');
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
    }
	}
}
</script>