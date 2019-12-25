<template>
  <div class="header">
  	<div class="logo">
  		<img src="../assets/logo.jpg">
  	</div>

  	<div class="right">
  		<div class="loginInfo">账号：{{accountName}}</div>
  		<div class="logout">
  			<el-button type="danger" size="small" @click="doLogout">退出</el-button>
  		</div>
  	</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {

		}
	},

  computed: {
    ...mapState({
      accountName: state => state.userInfo.accountName
    })
  },

	methods: {
    ...mapMutations({
      userLogout: 'USER_LOGOUT'
    }),

		doLogout() {
      this.$confirm('确定退出登录吗?', this.Strings.Common.NOTE, {
        confirmButtonText: this.Strings.Common.CONFIRM,
        cancelButtonText: this.Strings.Common.CANCEL,
        type: 'warning'
      })
      .then(_ => {
        this.userLogout();
        this.$router.push('login');
      })
      .catch(_ => {

      });
		}
	}
}
</script>