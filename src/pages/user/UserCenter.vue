<template>
  <div id="container">
      <div id="main">
          <div class="centerUseInfo" :style="{backgroundImage: `url('${userMessage.userPhoto}')`}">
              <div>
                  <div class="centerIntegral">
                      <a>
                          <span v-if="userMessage.remainderPoint != 0">{{userMessage.remainderPoint | NumberFormat}}</span>
                          <span v-if="userMessage.remainderPoint == 0">{{userMessage.remainderPoint}}</span>
                          {{pointUnit}}
                      </a>
                  </div>
                  <div class="centerHead clearfix">
                      <a>
                          <i @click="selectPic" :style="{backgroundImage: `url(${userMessage.userPhoto})`}">
                            <input v-show="false" @change="uploadPic($event)" type="file" accept="image/*" class="hiddenInput" />
                          </i>
                          <div>
                              <b>{{userMessage.userName}}</b>
                              <p>{{userMessage.groupName}}</p>
                          </div>
                      </a>
                  </div>
              </div>
              <div class="centerBrowse">
                  <ul class="clearfix">
                      <li>
                          <router-link :to="{name: 'collection'}">
                              <span>{{userFavorite.totalNum}}</span>
                              <p>我的收藏</p>
                          </router-link>
                      </li>
                      <li>
                          <router-link :to="{name: 'tracking'}">
                              <span>{{trackNum}}</span>
                              <p>浏览商品</p>
                          </router-link>
                      </li>
                      <li>
                          <router-link :to="{name: 'integralCard'}">
                              <span>{{userMessage.cardNum}}</span>
                              <p>积分卡券</p>
                          </router-link>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="centerNews" v-if="userMessage.expirePoint > 0">
              <img src="../../assets/common/icon_news.png">
              <span v-if="userMessage.expirePoint != 0">你的账户内有{{userMessage.expirePoint | NumberFormat}}{{pointUnit}}{{pointUnit === '积分' ? '' : '积分'}}将<!--于2019年4月1日-->过期</span>
          </div>
          <div class="centerWrap01">
              <div class="centerTitle01 centerTitle02">
                  <span>
                    <router-link :to="{name: 'order'}">全部订单</router-link>
                  </span>
                  <h2>我的订单</h2>
              </div>
              <ul class="centerOrder clearfix">
                  <li @click="goOrder(0)" class="centerItem01">
                      <a>
                          <img src="../../assets/center/icon_order01.png" alt="">
                          <p>待付款</p>
                      </a>
                  </li>
                  <li @click="goOrder(1)">
                      <a>
                          <img src="../../assets/center/icon_order02.png" alt="">
                          <p>待发货</p>
                      </a>
                  </li>
                  <li @click="goOrder(2)">
                      <a>
                          <img src="../../assets/center/icon_order03.png" alt="">
                          <p>发货完成</p>
                      </a>
                  </li>
                  <li @click="goOrder(3)">
                      <a>
                          <img src="../../assets/center/icon_order04.png" alt="">
                          <p>退货</p>
                      </a>
                  </li>
                  <!-- <li @click="goOrder()">
                      <a>
                          <img src="../../assets/center/icon_order05.png" alt="">
                          <p>已完成</p>
                      </a>
                  </li> -->
              </ul>
          </div>
          <div class="centerWrap01 centerWrap02">
              <div class="centerTitle01 centerTitle02">
                  <span>
                    <router-link :to="{name: 'integral'}">全部积分</router-link>
                  </span>
                  <h2>我的积分</h2>
              </div>
              <ul class="centerList01">
                  <li @click="goIntegral('issueType')">
                      <a>
                          <p>获得积分</p>
                      </a>
                  </li>
                  <li @click="goIntegral('usedType')">
                      <a>
                          <p>使用积分</p>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap02">
              <div class="centerTitle01 centerTitle02">
                  <h2>基本信息</h2>
              </div>
              <ul class="centerList01 centerList02">
                  <li>
                    <router-link :to="{name: 'userAccount'}">
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      <p>账号设置</p>
                    </router-link>
                  </li>
                  <!-- <li>
                      <a href="#">
                          <img src="../../assets/common/icon_arrow.png" alt="">
                          <p>绑定账号</p>
                      </a>
                  </li> -->
                  <li>
                    <router-link :to="{name: 'addressList'}">
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      <p>我的收货地址</p>
                    </router-link>
                  </li>
              </ul>
          </div>
          <div class="footerSpace"></div>
      </div>
      <footer-self active="userCenter"></footer-self>

  </div>
</template>

<script>
import FooterSelf from '@/components/Footer';
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      userInfo: {},
      userMessage: {},
      userFavorite: {},
      trackData: [],
      trackNum: 0,
      pointUnit: this.$store.state.userInfo.pointSuffixName,
    }
  },
  components: {
    FooterSelf
  },

  methods: {
    ...mapMutations({
      setUserInfo: 'USER_INFO'
    }),

    fetchUserData() {
      this.Api.get('userMyPage')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.userMessage = res.data.data;
      })
    },

    fetchFavoriteData() {
      this.Api.get('userFavorite')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.userFavorite = data.meta;
      })
    },

    fetchChackData() {
      this.Api.get('trackingBehavior')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        let pages = data.meta;
        this.trackNum = pages.totalNum;
      })
    },

    getUserInfo() {
      this.userInfo = this.$store.state.userInfo;
    },

    uploadPic(e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      let oImg = this.$refs.userPhoto;
      let that = this;
      reader.onload = function(e) {
        that.Api.post('ossUploadImage', {
          imgType: 7,
          imgBaseStr: this.result
        })
        .then(res => {
          if (res.data.code) {
            that.$toast(res.data.errors.message);
            return;
          }
          let photoUrl = res.data.data.imgUrl; 
          that.Api.put('userPhotoUid', {
            photoUrl: photoUrl
          })
          .then(res => {
            if (res.data.code) {
              that.$toast(res.data.errors.message);
              return;
            }
            that.userMessage.userPhoto = photoUrl;
            that.userInfo.userPhoto = photoUrl;
            that.setUserInfo(that.userInfo);
          })
        })
      }; 
    },

    goOrder(id) {
      let query = {shippingStatus: id}
      this.$router.push({
        name: 'order',
        query: query
      })
    },

    goIntegral(type) {
      let query = {
        type: type
      }
      this.$router.push({
        name: 'integral',
        query: query
      })
    },

    selectPic() {
      this.$el.querySelector('.hiddenInput').click()
    }
  },

  created() {
    this.fetchUserData();
    this.fetchFavoriteData();
    this.fetchChackData();
    this.getUserInfo();
  }
}
</script>