<template>
  <div id="container">
    <div class="gHeader">
      <div class="back" @click="doBack"></div>
      <h1>修改密码</h1>
    </div>

    <div class="main">
      <div class="formPage formPage02">
        <div class="formPart">
          <div class="formItem">
            <div class="formRow">
              <div class="formName">
                <p>当前密码<i></i></p>
              </div>
              <div class="formFill">
                <input type="password" minlength="8" maxlength="16" v-model="item.oldPassword" placeholder="请输入当前密码">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>重置密码<i></i></p>
              </div>
              <div class="formFill">
                <input type="password" minlength="8" maxlength="16" v-model="item.password" placeholder="请输入8~16位英文数字组合密码">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>确认密码<i></i></p>
              </div>
              <div class="formFill">
                <input type="password" minlength="8" maxlength="16" v-model="repassowrd" placeholder="请再次输入密码">
              </div>
            </div>
          </div>
        </div>
        <button v-if="isShowSure" ref="forSure" @click="doSave" class="btnSubmit btnSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {
        oldPassword: '',				
        password: ''				
      },
      repassowrd: '',
      winHeight: window.innerHeight,
      isShowSure: true
    }
  },

  methods: {
    doSave() {
      let msg = '';
      if (!this.item.oldPassword) {
        msg += '请输入原密码\n'
      } else if (!this.Utils.validatePassword(this.item.oldPassword)) {
        msg += '请输入正确的原密码\n'
      }

      if (!this.item.password) {
        msg += '请输入新密码\n'
      } else if (!this.Utils.validatePassword(this.item.password)) {
        msg += '密码必须是由8~16位的字母和数字组合\n'
      }

      if (!this.repassowrd) {
        msg += '请确认密码\n'
      } else if (this.repassowrd !== this.item.password) {
        msg += '两次输入的密码不一致\n'
      }

      if (msg) {
        this.$toast(msg);
        return;
      }

      this.Api.put('userPwd', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$router.push({
          name: 'userAccount'
        })
      })
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