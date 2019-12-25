<template>
  <div id="container">
      <div class="gHeader">
          <div class="back" @click="doBack"></div>
          <h1>账号设置</h1>
      </div>
      <div id="main">
          <ul class="centerList01 centerList02 centerList04">
              <li>
                  <p><span>用户账号</span><b>{{userInfo.loginId}}</b></p>
              </li>
              <li>
                  <p><span>姓名</span><b>{{userInfo.userName}}</b></p>
              </li>
              <li>
                  <router-link :to="{name: 'userResetPassword'}">
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      <p><span>设置登录密码</span></p>
                  </router-link>
              </li>
              <li>
                  <router-link :to="{name: 'resetPhone'}">
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      <p>
                        <span>修改手机号码</span>
                        <b v-if="!userInfo.mobile">未绑定</b>
                        <b v-if="userInfo.mobile">{{userInfo.mobile | PhoneDesensitization}}</b>
                      </p>
                  </router-link>
              </li>
              <li>
                  <router-link :to="{name: 'resetEmail'}">
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      
                      <p>
                        <span>邮箱地址</span>
                        <b v-if="!userInfo.email">未绑定</b>
                        <b v-if="userInfo.email">{{userInfo.email}}</b>
                      </p>
                  </router-link>
              </li>
          </ul>
          <div class="footerSpace"></div>
      </div>
      <footer-self active="userCenter"></footer-self>
  </div>
</template>

<script>
import FooterSelf from '@/components/Footer';
export default {
  data() {
    return {
      userInfo: {},
    }
  },

  components: {
    FooterSelf
  },

  methods: {
    getUserInfo() {
      this.userInfo = this.$store.state.userInfo;
    },

    doBack() {
      this.$router.back(-1);
    }
  },

  created() {
    this.getUserInfo()
  }
}
</script>