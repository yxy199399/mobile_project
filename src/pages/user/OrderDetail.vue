<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>订单详情</h1>
      </div>
      <div id="main">
          <div class="detailsAddressWrap">
              <!-- <div @click="goShipping" class="detailsAddress" v-if="shippingData.shippingStatus === '发货完成'">
                  <a>
                      <div class="detailsPic">
                          <svg><use xlink:href="#logistics"/></svg>
                      </div>
                      <div class="detailsWord">
                          <p>该订单包裹已发出，请注意查看物流信息</p>
                          <span>{{orderDetail.orderDatetime | DateTime}}</span>
                      </div>
                      <div class="orderArrow orderArrow01">
                          <img src="../../assets/common/icon_arrow.png">
                      </div>
                  </a>
              </div> -->
              <div class="detailsAddress">
                  <div class="detailsPic">
                      <svg><use xlink:href="#location"/></svg>
                  </div>
                  <div class="detailsWord detailsWord01">
                      <p>{{orderDetail.addressName}}<b>{{orderDetail.addressMobile}}</b></p>
                      <span>{{orderDetail.provinceName}} {{orderDetail.cityName}} {{orderDetail.countyName}}{{orderDetail.townName}} {{orderDetail.address}}</span>
                  </div>
              </div>
          </div>
          <div class="centerWrap01 centerWrap03" v-for="(type, tIndex) in DELIVERYTYPE" :key="tIndex" v-show="listOrderDetailShippingInfoFilter(type).length > 0">
              <div class="centerTitle02 centerTitle03 centerTitle04">
                  <h2>{{type}}</h2>
              </div>
              <div v-for="(goods, index) in listOrderDetailShippingInfoFilter(type)" :key="index">
                <div>
                    <div class="centerTitle02 centerTitle03 centerTitle05">
                        <span>{{goods.shippingStatus}}</span>
                        <div>
                          <p v-if="goods.shippingId">发货编号：{{goods.shippingId}}</p>
                          <p v-if="goods.subJdOrderId">京东单号：{{goods.subJdOrderId}}</p>
                        </div>
                    </div>
                    <ul class="centerList01 centerList03">
                        <li class="clearfix">
                            <a href="#">
                                <div class="orderListPic">
                                  <img :src="goods.imageName">
                                </div>
                                <div class="orderText">
                                    <p>{{goods.commodityName}}</p>
                                    <span>{{goods.standardDetail}}</span>
                                    <b class="orderIntegral">{{goods.retailPrice}}<span>{{pointUnit}}</span></b>
                                    <i class="orderNum">x<span>{{goods.purchasingNum}}</span></i>
                                </div>
                            </a>
                        </li>
                    </ul>
                  </div>
                  <div class="orderTotal orderTotal01">
                      <div class="orderBtn">
                          <button @click="goShipping(goods.shippingId)" v-if="goods.shippingStatus === '发货完成'">查看物流</button>
                      </div>
                  </div>
                </div>
              
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap05 centerWrap07">
              <ul class="centerList06 centerList08">
                  <li>
                      <p><span>商品总计</span><b>{{orderDetail.commodityTotalAmount}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>运费</span><b>{{orderDetail.shippingCharge ? orderDetail.shippingCharge : 0}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>积分支付</span><b>-{{orderDetail.usedPoint ? orderDetail.usedPoint : 0}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>积分卡券支付</span><b>-{{orderDetail.sumUsedPointCard ? orderDetail.sumUsedPointCard : 0}}{{pointUnit}}</b></p>
                  </li>
                  <li class="detailsTotal">
                      <p><span>实付款 （含运费）</span><b class="integralTotal integralTotal01">￥{{payByMoney}}</b></p>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap09">
              <div class="centerTitle02 centerTitle03 centerTitle04">
                  <p class="orderInfoTitle">订单信息</p>
              </div>
              <ul class="orderInfo">
                  <li><span>订单编号:</span><b>{{orderDetail.orderId}}</b></li>
                  <li><span>创建时间:</span><b>{{orderDetail.orderDatetime | DateTime}}</b></li>
                  <li><span>支付方式:</span><b>{{orderDetail.paymentType}}</b></li>
                  <li v-if="orderDetail.paymentStatus === 1"><span>支付时间:</span><b>{{orderDetail.paymentDatetime | DateTime}}</b></li>
              </ul>
          </div>
          <div ref="btnWrap" v-if="orderDetail.paymentStatus === 0" class="btnWrap">
            <button @click="goPay(); return false;" class="btnTemplate btnDelete">付款</button>
          </div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    const id = this.$route.params.id;
    return {
      id: id,
      orderDetail: {},
      shippingData: {},
      userInfo: {},
      payByMoney:0,
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      PAYMENTTYPE: ['全积分', '微信支付', '支付宝'],
      SHIPPINGSTATUS: ['未付款', '等待发货', '发货中', '发货完成', '发货取消'],
      DELIVERYTYPE: ['自营', 'JD']
    }
  },

  methods: {
    ...mapMutations({
      setWeixinpay: 'WEIXINPAY_PARMA'
    }),
    
    fetchData() {
      this.Api.get('myOrderUid', {
        uid: this.id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        data.paymentType = this.PAYMENTTYPE[data.paymentType];
        data.listOrderDetailShippingInfo.map(item => {
          item.shippingStatus = this.SHIPPINGSTATUS[item.shippingStatus];
          item.deliveryType = this.DELIVERYTYPE[item.deliveryType];
        });
        this.shippingData = data.listOrderDetailShippingInfo[0];
        this.orderDetail = data;
        this.payNeed();
      })
    },

    listOrderDetailShippingInfoFilter(type) {
      let typeArr = [];
      if(this.orderDetail.listOrderDetailShippingInfo) typeArr = this.orderDetail.listOrderDetailShippingInfo.filter(item => item.deliveryType === type);
      return typeArr;
    },

    goAddressList() {
      this.$router.push({name: 'addressList'})
    },

    getUserInfo() {
      this.userInfo = this.$store.state.userInfo;
    },

    payNeed() {
      let payTotal = this.orderDetail.commodityTotalAmount + this.orderDetail.shippingCharge;
      let payPoint = this.orderDetail.usedPoint + this.orderDetail.sumUsedPointCard;
      this.payByMoney = (payTotal - payPoint)/this.userInfo.pointRate;
    },

    goPay() {
      this.Api.post('orderPayUid', {
        uid: this.id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        if (res.data.data.alipayInfo) {
          window.location.href = res.data.data.alipayInfo.reqUrl;
          return;
        }
        let weixinPayResult = {};
        if (res.data.data.wxpayInfo) {
          weixinPayResult = res.data.data.wxpayInfo;
          weixinPayResult.package = weixinPayResult.packageStr;
          delete weixinPayResult.packageStr;
          delete weixinPayResult.code_url;
          delete weixinPayResult.tradeType;
        };
        this.setWeixinpay(weixinPayResult);
        this.$router.push({
          name: 'orderComplete',
          query: {out_trade_no: res.data.data.orderId}
        })
      })
      // this.Api.put('orderUid', {
      //   uid: this.id
      // })
      // .then(res => {
      //   if (res.data.code) {
      //     this.$toast(res.data.errors.message);
      //     return;
      //   }
      //   let data = res.data.data;
      //   this.$router.push({
      //     name: 'orderComplete',
      //     query: {out_trade_no: data.orderId}
      //   })
      // })

      // this.$router.push({
      //   name: 'orderComplete',
      //   query: {out_trade_no: this.id}
      // })
    },

    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      let setHeight = clientHeight - htmlHeight;
      if (this.$refs['btnWrap']) {
        if (setHeight > 0) this.$refs['btnWrap'].style.marginTop = setHeight  + 'px';
      }
    },

    goShipping(id) {
      this.$router.push({
        name: 'shipping',
        params: {id: id}
      })
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    this.fetchData();
  },

  mounted() {
    this.getUserInfo();
    this.setHeight();
  }
}
</script>