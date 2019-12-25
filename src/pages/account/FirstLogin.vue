<template>
	<div id="container">
		<div class="gHeader">
			<h1>首次登录验证</h1>
		</div>

		<div class="main">
			<div class="formPage">
				<div class="formPart">
					<p class="headLine01">{{$route.params.id == 3 ? '姓名验证' : '绑定手机号码'}}</p>
					<div class="formItem">
						<div class="formRow" v-if="$route.params.id != 2">
							<div class="formName">
								<p>姓名<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="20" v-model="item.userName" type="text" placeholder="请输入真实姓名">
							</div>
						</div>
						
						<div class="formRow" v-if="$route.params.id != 3">
							<div class="formName">
								<p>手机号<i></i></p>
							</div>
							<div class="formFill">
								<input maxlength="11" v-if="$route.params.id == 1" v-model="item.mobile" type="tel" placeholder="请输入手机号" >
                <input v-if="$route.params.id == 2" v-model="havePhone" type="tel" disabled>
							</div>
						</div>

						<div class="formRow"  v-if="$route.params.id != 3">
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
        <div class="formPart">
          <p class="headLine01">初始密码重置</p>
          <div class="formItem">
            <div class="formRow">
              <div class="formName">
                <p>重置密码<i></i></p>
              </div>
              <div class="formFill">
                <input maxlength="50" v-model="item.password" type="password" placeholder="请输入8~16位的英文数字组合密码">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>确认密码<i></i></p>
              </div>
              <div class="formFill">
                <input maxlength="50" v-model="repassword" type="password" placeholder="请再次输入密码">
              </div>
            </div>
          </div>
        </div>
				<button class="btnSubmit btnSubmit02" @click="doSure">确认</button>
			</div>

		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      item: {
        userName: '',			
        mobile: '',				
        authCode: '',				
        password: '',				
        firstLoginType: this.$route.params.id				
      },
      havePhone: 0,
      repassword: '',
      getVerifButn: '获取验证码',
      downTime: 60,
      downTimeT: 60,
      userInfo: {}
    }
  },
   
  methods: {
    doSure(){
      let postData = this.item;
      if (this.$route.params.id == 2) {
        delete postData.userName;
      } else if(this.$route.params.id == 3) {
        delete postData.mobile;
        delete postData.authCode;
      }

      let msg = '';
      if (postData.hasOwnProperty('userName')) {
        if (!postData.userName) {
          msg += '请输入真实姓名\n';
        }
      }

      if (postData.hasOwnProperty('mobile')) {
        if (!postData.mobile) {
          msg += '请输入手机号\n';
        } else if (!this.Utils.validateMobile(postData.mobile)) {
          msg += '请输入正确的手机号\n';
        }
      }

      if (postData.hasOwnProperty('authCode')) {
        if (!postData.authCode) {
          msg += '请输入验证码\n';
        }
      }
      
      if (!postData.password) {
        msg += '请输入密码\n';
      } else if (!this.Utils.validatePassword(this.item.password)) {
        msg += '密码必须是由8~16位的字母和数字组合\n'
      }

      if (!this.repassword) {
        msg += '请输入确认密码\n';
      } else if(this.repassword != postData.password) {
        msg += '两次输入的密码不一致\n';
      }

      if (msg) {
        this.$toast({
				  message: msg,
				  duration: 1500
				});
			  return;
      }
      
      this.Api.put('firstLogin', postData)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
					return;
        }
        this.$router.push({
          name: 'homeIndex'
        })
      })
    },

    getVerif() {
      let msg = '';
      if (!this.item.mobile) {
        msg += '请输入手机号\n';
      } else  if (!this.Utils.validateMobile(this.item.mobile)) {
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
        mobile: this.item.mobile
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

    getUserInfo () {
      this.userInfo = this.$store.state.userInfo;
      if (this.userInfo.mobile) {
        if (this.$route.params.id == 2) this.item.mobile = this.userInfo.mobile;
        this.havePhone = this.phoneDesensitization(this.userInfo.mobile);
      }
    },

    phoneDesensitization: (phone) => {
      if (!phone) return '';
      let pat=/(\d{3})\d*(\d{4})/;
      let b = phone.replace(pat,'$1****$2');
      return b;
    }
  },

  mounted() {
    this.getUserInfo();
  },

  watch: {
    '$route' (to, from) {
      this.item.firstLoginType = this.$route.params.id;
     }
  }
}
</script>