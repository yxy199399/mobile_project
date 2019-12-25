<template>
  <div id="container">
    <div class="gHeader">
      <div class="back" @click="doBack"></div>
      <h1>修改邮箱地址</h1>
    </div>

    <div class="main">
      <div class="formPage formPage02">
        <div class="formPart">
          <div class="formItem">
            <div class="formRow" v-if="userInfo.email">
              <div class="formName">
                <p>原邮箱<i></i></p>
              </div>
              <div class="formFill">
                <input disabled type="email" :value="userInfo.email">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>{{userInfo.email ? '新' : ''}}邮箱<i></i></p>
              </div>
              <div class="formFill">
                <input maxlength="50" type="email" v-model="item.email" placeholder="请输入邮箱地址">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>验证码<i></i></p>
              </div>
              <div class="yzm clearfix">
                <input maxlength="6" type="text" v-model="item.authType" placeholder="6位验证码">
                <button :disabled="downTime != downTimeT" @click="getVerif">{{getVerifButn}}</button>
              </div>
            </div>
          </div>
        </div>
        <button v-show="isShowSure" ref="forSure" @click="doSave" class="btnSubmit btnSave">保存</button>
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
        email: '',				
        authType: ''			
      },
      userInfo: {},
      mobileOriginal: '',
      getVerifButn: '获取验证码',
      downTime: 60,
      downTimeT: 60,
      winHeight: window.innerHeight,
      isShowSure: true
    }
  },

  methods: {
    ...mapMutations({
      setUserInfo: 'USER_INFO'
    }),

    doSave() {
      let msg = '';
      if (!this.item.email) {
        msg += '请输入新邮箱账号\n'
      } else if (!this.Utils.validateMail(this.item.email)) {
        msg += '请输入正确的新邮箱账号\n'
      } else if (this.item.email === this.userInfo.email) {
        msg += '不能与原邮箱账号相同\n';
      }

      if (!this.item.authType) {
        msg += '请输入验证码\n'
      }

      if (msg) {
        this.$toast(msg);
        return;
      }

      this.Api.put('userEmail', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.userInfo.email = this.item.email;
        this.setUserInfo(this.userInfo);
        this.$router.push({
          name: 'userCenter'
        })
      })
    },

    getVerif() {
      let msg = '';
      if (!this.item.email) {
        msg += '请输入新邮箱账号\n';
      } else if (!this.Utils.validateMail(this.item.email)) {
        msg += '请输入正确的新邮箱账号\n';
      } else if (this.item.email === this.userInfo.email) {
        msg += '不能与原邮箱账号相同\n';
      }
      
      if (msg) {
        this.$toast({
				  message: msg,
				  duration: 1500
				});
			  return;
      }
    
      this.Api.post('authSendAuth', {
        email: this.item.email
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
          this.getVerifButn = this.downTime + '秒后重新获取';    
        }, 1000);
        
      })
    },

    getUserInfo() {
      this.userInfo = this.$store.state.userInfo;
    },

    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      this.$refs['forSure'].style.marginTop = (clientHeight - htmlHeight) + 'px';
    },

    doBack() {
      this.$router.back(-1);
    }
  },

  created() {
    this.getUserInfo();
  },

  mounted() {
    this.setHeight();
    window.onresize = ()=>{
      return(()=>{
        this.winHeight = window.innerHeight;
      })()
    }
  },

  destroyed() {
    window.onresize = null;
  },

  watch: {
    'winHeight': {
      handler(newName, oldName) {
        if (newName < oldName) {
          this.isShowSure = false;
        } else {
          this.isShowSure = true;
        }
      }
    }
  }
}
</script>