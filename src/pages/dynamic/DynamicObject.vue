<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <div class="browseInput"><input maxlength="20" v-model="searchKey" @keyup.enter="showResult" @blur="searchUser" @focus='searchUser' type="text" placeholder="输入查找对象的手机号或账号"></div>
          <div @click="showResult" class="browse"><svg><use xlink:href="#search"/></svg></div>
      </div>
      <div id="main">
        <div class="listWrap" v-if="!isSearch">
              <p class="contactsTitle">最近联系人</p>
              <ul class="integralTicket contactsList">
                  <li class="clearfix" v-for="(contact, idx) in contactUserData" :key="idx" :class="{ticketOn: contact.userId == selectId}" @click="isChoice(contact)">
                      <div class="orderLayerPic" :style="{backgroundImage: `url(${contact.userPhoto})`}"></div>
                      <div class="orderLayerWord">
                          <p>{{contact.userName}}</p>
                          <span>{{contact.mobile}}</span>
                      </div>
                      <i class="centerChoice"><svg><use xlink:href="#choice"></use></svg></i>
                  </li>
              </ul>
          </div>
            <div class="orderLayerWrap orderLayerWrap01" v-if="isSearch">
              <div class="listWrap listWrap01">
                  <p class="contactsTitle">搜索结果</p>
                  <ul class="integralTicket contactsList"> 
                    <li class="clearfix" v-for="(user, idx) in userData" :key="idx" :class="{ticketOn: user.userId == selectId}" @click="isChoice(user)">
                      <div class="orderLayerPic" :style="{backgroundImage: `url(${user.userPhoto})`}"></div>
                      <div class="orderLayerWord">
                          <p>{{user.userName}}</p>
                          <span>{{user.mobile}}</span>
                      </div>
                      <i class="centerChoice"><svg><use xlink:href="#choice"></use></svg></i>
                    </li>
                  </ul>
              </div>
          </div>
          <div class="btnWrapFix">
              <button v-if="isShowSure" @click="doSure" class="btnTemplate btnNew" :disabled="!selectId">确定</button>
          </div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      userInfo: {},
      vuexMessage: {},
      userData: [],
      contactUserData: [],
      userSelectInfo: {},
      selectId: '',
      isSearch: false,
      searchKey: '',
      winHeight: window.innerHeight,
      isShowSure: true
    }
  },

  methods: {
    ...mapMutations({
      dynamicMessage: 'DYNAMIC_MEASSGE'
    }),

    getUser() {
      this.Api.get('dynamicUsers', {
        loginId: this.searchKey
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.userData = res.data.data;
      })
    },

    getContactUser() {
      this.Api.get('dynamicRecentContacts')
      .then(res => {
        if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          this.contactUserData = res.data.data;
      })
    },

    isChoice(user) {
      this.userSelectInfo = user;
      this.selectId = user.userId
    },

    searchUser() {
      this.isSearch = true;
    },

    showResult() {
      this.concactFilter();
    },

    concactFilter() {
      this.getUser();
    },

    doSure() {
      this.vuexMessage.messageObject = this.userSelectInfo;
      this.dynamicMessage(this.vuexMessage);
      this.$router.push({
        name: 'dynamicSend'
      })
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    this.getContactUser()
  },

  mounted() {
    this.vuexMessage = this.$store.state.dynamicMsg;
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