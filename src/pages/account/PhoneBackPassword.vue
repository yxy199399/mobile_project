<template>
  <div id="container">
    <div class="gHeader">
      <h1>忘记密码</h1>
    </div>

    <div class="main">
      <div class="formPage">
        <div class="formPart">
          <p class="headLine01">手机号验证</p>
          <div class="formItem">
            <div class="formRow">
              <div class="formName">
                <p>
                  手机号
                  <i></i>
                </p>
              </div>
              <div class="formFill">
                <input maxlength="11" type="tel" v-model="item.mobile" placeholder="请输入手机号">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>
                  验证码
                  <i></i>
                </p>
              </div>
              <div class="yzm clearfix">
                <input maxlength="6" type="text" v-model="item.authCode" placeholder="6位验证码">
                <button :disabled="downTime != downTimeT" @click="getVerif">{{getVerifButn}}</button>
              </div>
            </div>
            <div class="formRow phoneVerify">
              <p>
                <router-link to="/mail/back-password">邮箱验证</router-link>
              </p>
            </div>
          </div>
        </div>
        <button
          :disabled="!item.mobile || !item.authCode"
          class="btnSubmit btnSubmit02"
          :class="{btnDisabled : !item.email || !item.authCode}"
          @click="doNext"
        >下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {
        mobile: "",
        authType: 1,
        authCode: ""
      },

      getVerifButn: "获取验证码",
      downTime: 60,
      downTimeT: 60,
      isNext: false
    };
  },

  methods: {
    doNext() {
      let msg = "";
      if (!this.Utils.validateMobile(this.item.mobile)) {
        msg += "请输入正确的手机号\n";
      }

      if (msg) {
        this.$toast({
          message: msg,
          duration: 1500
        });
        return;
      }

      this.Api.put("authSendVerify", this.item).then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        // if (!res.data.data.firstLoginFlg) {
        this.$router.push({
          name: "resetPassword",
          query: {
            id: this.item.authType,
            mobile: this.item.mobile
          }
        });
        // }
      });
    },

    getVerif() {
      let msg = "";
      if (!this.item.mobile) {
        msg += "请输入手机号\n";
      } else if (!this.Utils.validateMobile(this.item.mobile)) {
        msg += "请输入正确的手机号\n";
      }

      if (msg) {
        this.$toast({
          message: msg,
          duration: 1500
        });
        return;
      }

      this.Api.post("authSend", {
        mobile: this.item.mobile,
        authType: this.item.authType
      }).then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }

        this.$toast("手机验证码发送成功，请注意查收");
        this.downTime = this.downTimeT;
        let timer = setInterval(_ => {
          if (this.downTime <= 0) {
            clearInterval(timer);
            this.downTime = this.downTimeT;
            this.getVerifButn = "获取验证码";
            return;
          }
          this.downTime--;
          this.getVerifButn = this.downTime + "秒后重新获取";
        }, 1000);
      });
    }
  }
};
</script>