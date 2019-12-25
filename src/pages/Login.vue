<template>
  <div>
    <button @click="doLogin">Login</button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      
    }
  },

  created() {
    
  },

  methods: {
    doLogin() {
      this.Api.post('login', {
        //hl: 1,
        loginType: 1,
        loginId: '13482830626',
        password: '123'
      })
      .then(res => {

      });
    }
  }
}
</script>