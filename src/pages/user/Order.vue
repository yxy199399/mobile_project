<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>我的订单</h1>
      </div>
      <div id="main">
          <ul class="orderTab clearfix">
              <li @click="doFilter()" :class="{orderTabOn: orderSesstion.shippingStatus === '全部'}">全部</li>
              <li @click="doFilter(0)" :class="{orderTabOn: orderSesstion.shippingStatus === '未付款'}">未付款</li>
              <li @click="doFilter(1)" :class="{orderTabOn: orderSesstion.shippingStatus === '待发货'}">待发货</li>
              <li @click="doFilter(2)" :class="{orderTabOn: orderSesstion.shippingStatus === '发货完成'}">发货完成</li>
              <li @click="doFilter(3)" :class="{orderTabOn: orderSesstion.shippingStatus === '取消/退货'}">取消/退货</li>
          </ul>
          <div v-if="!myOrder.length" class="noData">------您还没有相关的订单------</div>
          <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <li v-for="(order, index) in myOrder" :key="index">
              <div class="centerWrap01 centerWrap03">
                  <div class="centerTitle02 centerTitle03">
                      <span>{{order.shippingStatus}}</span>
                      <!-- <span>{{orderSesstion.shippingStatus}}</span> -->
                      <h2 @click="goOrderDetail(order.orderId)">订单编号：{{order.orderId}}</h2>
                  </div>
                  <ul class="centerList01 centerList03">
                      <li class="clearfix">
                          <a>
                              <div class="orderListPic">
                                <img :src="order.imageName">
                              </div>
                              <div class="orderText">
                                  <p class="cartCommodityName">{{order.commodityName}}</p>
                                  <span>{{order.standardDetail}}</span>
                                  <b class="orderIntegral">{{order.retailPrice}}<span>{{pointUnit}}</span></b>
                                  <i class="orderNum">x<span>{{order.purchasingNum}}</span></i>
                              </div>
                          </a>
                      </li>
                  </ul>
                  <div class="orderTotal">
                      <p>共{{order.purchasingNum}}件商品 合计：<span>{{order.price | NumberFormat}}<i>{{pointUnit}}</i></span></p>
                      <div class="orderBtn">
                          <button v-if="order.shippingStatus === '发货完成'" @click="orderLogistics(order.shippingId)">物流查询</button>
                          <button  v-if="!order.orderCancelFlg && !order.orderStatus" @click="orderCancel(order.orderId)">取消订单</button>
                          <button v-if="order.paymentStatus === '未支付' && !order.orderStatus" @click="goPay(order.orderId)" class="orderPayment">立即付款</button>
                      </div>
                  </div>
              </div>
            </li> 
          </ul>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { MessageBox  } from 'mint-ui';
export default {
  data() {
    const query = this.$route.query;
    return {
      query: query,
      shippingStatus: null,
      myOrder: [],
      pages: {
        currentPage: 1,
      },
      loading: false,
      orderSesstion: {
        shippingStatus: '全部'
      },
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      SHOPPINGSTATUETYPE: ['全部', '未付款', '待发货', '发货完成', '取消/退货'],
      GetSHOPPINGSTATUETYPE: ['未付款', '待发货', '发货中', '发货完成', '发货取消', '退货'],
      PAYMENTSTATUS: ['未支付', '已支付']
    }
  },

  methods: {
    ...mapMutations({
      setWeixinpay: 'WEIXINPAY_PARMA'
    }),
    
    fetchMyOrderData() {
      let postData = {
        currentPage: this.pages.currentPage,
        shippingStatus: this.shippingStatus
      }

      this.Api.get('myOrder', postData)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        data.list.map(item => {
          item.shippingStatus = this.GetSHOPPINGSTATUETYPE[item.shippingStatus];
          item.paymentStatus = this.PAYMENTSTATUS[item.paymentStatus];
        })
        this.myOrder = this.myOrder.concat(data.list);
        this.pages = data.meta;
        this.loading = false;
      })
    },

    loadMore() {
      this.loading = true;
      if (this.pages.totalPage > this.pages.currentPage) {
        ++ this.pages.currentPage;
        this.fetchMyOrderData();
      }
    },

    doFilter(type) {
      if (type == this.shippingStatus) return;
      if (arguments.length === 0) {
        this.shippingStatus = null
      } else {
        this.shippingStatus = type;
      };
      this.myOrder = [];
      this.pages.currentPage = 1;
      this.fetchMyOrderData();
      let idx = type + 1;
      if (isNaN(idx)) {
        this.orderSesstion.shippingStatus = this.SHOPPINGSTATUETYPE[0];
      } else {
        this.orderSesstion.shippingStatus = this.SHOPPINGSTATUETYPE[idx];
      }
      
    },

    goPay(id) {
      this.Api.post('orderPayUid', {
        uid: id
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

        // TODO
        // this.$router.push({
        //   name: 'orderCompleteTest',
        //   query: {out_trade_no: res.data.data.orderId}
        // })
      })
    },

    orderCancel(id) {
      MessageBox.confirm('确定取消订单吗？' , '取消确认').then(action => {
        this.Api.put('myOrderUid', {
          uid: id
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          this.myOrder = [];
          this.fetchMyOrderData();
          this.$toast('订单取消成功');
        })
      })
      .catch(action => {
        return;
      });
    },

    orderLogistics(id) {
      this.$router.push({
        name: 'shipping',
        params: {id: id}
      })
      // this.Api.get('myOrderLogistics', {
      //   uid: id
      // })
      // .then(res => {
      //   if (res.data.code) {
      //     this.$toast(res.data.errors.message);
      //     return;
      //   }
      // })
    },

    goOrderDetail(id) {
      this.$router.push({
        name: 'orderDetail',
        params: {id: id}
      })
    },

    orderDel(id) {
      this.Api.delete('myOrderUid', {
        uid: id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$toast(res.data.message);
      })
    },  

    doBack() {
      this.$router.push({
        name: 'userCenter'
      })
    }
  },

  created() {
    if (this.query) {
      let idx = parseInt(this.query.shippingStatus) + 1;
      if (isNaN(idx)) {
        this.orderSesstion.shippingStatus = this.SHOPPINGSTATUETYPE[0];
      } else {
        this.shippingStatus = this.query.shippingStatus;
        this.orderSesstion.shippingStatus = this.SHOPPINGSTATUETYPE[idx];
      }
    }
    if (this.Utils.getFilter('orderSesstion')) {
      this.orderSesstion = this.Utils.getFilter('orderSesstion');
      if (this.orderSesstion.shippingStatus == '全部') {
        this.shippingStatus = null
      } else {
        let idx = this.SHOPPINGSTATUETYPE.indexOf(this.orderSesstion.shippingStatus);
        this.shippingStatus = idx - 1;
      }
    }
    this.fetchMyOrderData();
  },

  beforeRouteLeave (to, from, next) {
    if (to.name !== 'userCenter') {
      let newFilter = JSON.parse(JSON.stringify(this.orderSesstion));
      this.Utils.setFilter('orderSesstion', newFilter);
    } else {
      this.Utils.removeAllFilter();
    }
    next();
  }
}
</script>