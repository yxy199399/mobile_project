<template>
  <div id="container">
      <div class="gHeader">
          <h1>支付结果</h1>
      </div>
      <div id="main">
          <div class="finishInfo">
              <div class="finishInfoPic"><img v-if="payResultShow === '已成功'" src="../../assets/center/img_complete.png" alt=""></div>
              <p class="finishInfoTitle">申请支付{{payResultShow}}</p>
              <!-- <p class="finishInfoWord">订单金额：<span>￥{{orderData.usedAmount / userInfo.pointRate}}</span></p> -->
          </div>
          <div class="centerWrap01 centerWrap03">
              <ul class="centerList06 centerList08 centerList10">
                  <li class="detailsTotal detailsTotal01">
                      <p><span>订购积分合计<i>（含运费）</i></span><b>{{orderData.totalPoint}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>使用积分支付</span><b>{{orderData.usedPoint}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>使用积分卡券支付</span><b>{{orderData.usedPointCard}}{{pointUnit}}</b></p>
                  </li>
                  <li >
                      <p><span>在线支付金额</span><b>{{orderData.usedAmount / userInfo.pointRate}}元</b></p>
                  </li>
              </ul>
          </div>
          <div class="footerSpace footerSpace03"></div>
          <div class="btnWrapFix">
              <button @click="goOrder" class="btnTemplate btnDelete">查看历史记录</button>
          </div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    const id = this.$route.query.out_trade_no;
    const userToken = this.Utils.cookieGet('token');
    if (userToken) localStorage.setItem('token', userToken);
    return {
      id : id,
      userInfo: {},
      orderData: {},
      weixinpayParmas: {},
      payResultShow: '进行中...',
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      timer: ''
    }
  },

  methods: {
    ...mapMutations({
      setWeixinpay: 'WEIXINPAY_PARMA'
    }),

    fetchData() {
      this.Api.get('orderStatusUid', {
        uid: this.id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.orderData = res.data.data;
      })
    },

    onBridgeReady() {
      // alert(5)
      let that = this;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': this.weixinpayParmas.appId,
          'timeStamp': this.weixinpayParmas.timeStamp,
          'nonceStr': this.weixinpayParmas.nonceStr,
          'package': this.weixinpayParmas.package,
          'signType': this.weixinpayParmas.signType,
          'paySign': this.weixinpayParmas.paySign
        },
          function(res){
            alert('6=' + JSON.stringIfy(res))
            that.getPaySatus();
      })
    },

    payResult() {
      // alert(3)
      if (typeof WeixinJSBridge == "undefined"){
        if(document.addEventListener){
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
      }else{
        // alert('4=' + JSON.stringify(WeixinJSBridge))
        this.onBridgeReady();
      }
    },

    getPaySatus() {
      this.Api.get('orderStatusUid', {
        uid: this.id,
        hl: 1
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        if (res.data.data.paymentStatus) {
          clearInterval(this.timer);
          this.payResultShow = "已成功"
          let weixinpay = {};
          this.setWeixinpay(weixinpay);
        }
      })
    },

    goOrder() {
      this.$router.push({
        name: 'order'
      })
    }
  },

  created() {
    this.fetchData();
  },

  mounted() {
    this.userInfo = this.$store.state.userInfo;
    this.weixinpayParmas = this.$store.state.weixinpayParmas;
    if (this.weixinpayParmas && this.weixinpayParmas.appId) {
      this.payResult();
      this.timer = setInterval(_ => {
        this.getPaySatus();
      }, 2000)
    } else {
      this.payResultShow = "已成功"
    };
  },

  destroyed() {
    let weixinpay = {};
    this.setWeixinpay(weixinpay);
    clearInterval(this.timer)
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name && vm.Utils.isWX()) {
        vm.$router.go()
      }
    })
  }
}
</script>