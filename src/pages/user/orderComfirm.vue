<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>确认订单</h1>
      </div>
      <div id="main">
          <div class="orderAddress" @click="goAddressList">
              <div class="orderName clearfix">
                  <p>收货人：<b>{{address.addressName}}</b></p>
                  <span>{{address.mobile}}</span>
              </div>
              <div class="addressDetails">
                  <span>收货地址:</span>
                  <p>{{address.provinceName}} {{address.cityName}} {{address.countyName}} {{address.townName}} {{address.address}}</p>
              </div>
              <div class="orderArrow">
                  <img src="../../assets/common/icon_arrow.png" alt="">
              </div>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap04" v-for="(type, tIndex) in DELIVERYTYPE" :key="tIndex" v-show="shopingDataType(type).length > 0">
              <div class="centerTitle02 centerTitle03">
                  <h2>{{type}}</h2>
              </div>
              <ul class="centerList01 centerList03 centerList05">
                  <li class="clearfix" v-for="(shopping, sIndex) in shopingDataType(type)" :key="sIndex">
                      <a href="#">
                          <div class="orderListPic">
                            <img :src="shopping.imageName">
                          </div>
                          <div class="orderText">
                              <p>{{shopping.commodityName}}</p>
                              <span>
                                {{shopping.standardDetail1Name ? shopping.standardDetail1Name : ''}}
                                {{shopping.standardDetail2Name ? `/${shopping.standardDetail2Name}` : ''}}
                                {{shopping.standardDetail3Name ? `/${shopping.standardDetail3Name}` : ''}}
                                {{shopping.standardDetail4Name ? `/${shopping.standardDetail4Name}` : ''}}
                                {{shopping.standardDetail5Name ? `/${shopping.standardDetail5Name}` : ''}}
                                {{shopping.standardDetail6Name ? `/${shopping.standardDetail6Name}` : ''}}
                              </span>
                              <b class="orderIntegral">{{shopping.discountPrice ? shopping.discountPrice : shopping.price}}<span>{{pointUnit}}</span></b>
                              <i class="orderNum">x<span>{{shopping.purchasingNum}}</span></i>
                          </div>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap05">
              <ul class="centerList01 centerList02 centerList06">
                  <li>
                      <p><span>商品总计</span><b>{{shopingPoint}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>运费</span><b>{{freightPoint}}{{pointUnit}}</b></p>
                  </li>
                  <li>
                      <p><span>合计</span><b class="integralTotal">{{shopingPoint + freightPoint}}{{pointUnit}}</b></p>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap05">
              <ul class="centerList01 centerList02 centerList06">
                  <li>
                      <a href="javascript:void(0)" @click="selectCard">
                          <img src="../../assets/common/icon_arrow.png" alt="">
                          <p><span>使用积分卡券</span><b class="integralDeduction">-{{cardPointUserSure}}{{pointUnit}}</b></p>
                      </a>
                  </li>
                  <li>
                      <a href="javascript:void(0)" @click="selectIntegral">
                          <img src="../../assets/common/icon_arrow.png" alt="">
                          <p>
                            <span v-if="allPoint > 0">使用积分支付<i>({{allPoint}}{{pointUnit}}可用)</i></span>
                            <span v-if="allPoint == 0">无可用积分</span>
                            <b class="integralDeduction">-{{pointUse.pointUseSure ? pointUse.pointUseSure : 0}}{{pointUnit}}</b>
                          </p>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap05" v-if="payByMoney > 0 && !userInfo.usePaymentFlg">
              <ul class="centerList01 centerList02 centerList06">
                  <li>
                      <a href="javascript:void(0)" @click="payType">
                        <img src="../../assets/common/icon_arrow.png" alt="">
                          <p><span>支付方式</span><b>{{paymentType.payTypeSelect}}</b></p>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap05">
              <ul class="centerList01 centerList02 centerList06">
                  <li>
                      <p class="orderRemarks"><span>备注</span><b><input maxlength="200" type="text" v-model="item.orderMessage"></b></p>
                  </li>
              </ul>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap06">
              <div class="placeOrder clearfix">
                  <p>还需支付：<span>￥{{payByMoney > 0 ? payByMoney : 0}}<b>元</b></span></p>
                  <button @click="doSubmit(); return false;">提交订单</button>
              </div>
          </div>
          <mt-popup v-model="isCard" position="bottom">
            <div class="orderLayerWrap">
              <div class="orderLayer01">
                  <p class="orderLayerTitle">使用积分卡券</p>
                  <ul class="integralTicket">
                      <li @click="seletCardSure(orderCard)" class="clearfix" :class="{disabledChoice: orderCard.cardFlag === '不可用', ticketOn: orderCard.selectCardFlag}" v-for="orderCard in orderCardList" :key="orderCard.userPointId">
                          <div class="orderLayerPic">
                              <img src="../../assets/center/img_layer02.png">
                          </div>
                          <div class="orderLayerWord">
                              <p>{{orderCard.issueTitle}}</p>
                              <span v-if="orderCard.cardFlag === '不可用'">{{orderCard.cardFlag}}</span>
                              <span v-if="orderCard.cardFlag === '可用'">可使用：{{orderCard.remainderPoint}}{{pointUnit}}</span>
                              <span>有效期至{{orderCard.usedEndDate | Date}}</span>
                          </div>
                          <i class="centerChoice"><svg><use xlink:href="#choice"/></svg></i>
                      </li>
                  </ul>
                  <div class="btnWrapFix">
                      <button @click="orderCardPay" class="btnTemplate btnNew">确定</button>
                  </div>
              </div>
            </div>
          </mt-popup>

          <mt-popup v-model="isIntegral" position="bottom">
            <div class="orderLayerWrap">
                <div class="orderLayer01">
                    <p class="orderLayerTitle">使用积分</p>
                    <ul class="integralDetails">
                        <li class="clearfix" >
                            <span>当前可用积分</span>
                            <p v-if="allPoint > 0">{{allPoint | NumberFormat}}{{pointUnit}}</p>
                            <p v-if="allPoint == 0">{{allPoint}}{{pointUnit}}</p>
                        </li>
                        <li class="clearfix">
                            <span>订单支付积分</span>
                            <p v-if="pointUse.pointUsePrompt != 0">{{pointUse.pointUsePrompt | NumberFormat}}{{pointUnit}}</p>
                            <p v-if="pointUse.pointUsePrompt == 0">{{pointUse.pointUsePrompt}}{{pointUnit}}</p>
                        </li>
                    </ul>
                    <div class="integralUse">
                        <p>使用积分支付</p>
                        <div class="integralInput">
                            <input onpaste="return false" maxlength="8" type="text" v-model="pointUse.pointUsePrompt">
                            <span>{{pointUnit}}</span>
                        </div>
                    </div>
                    <div class="btnWrapFix">
                        <button @click="pointUseSureBtn" class="btnTemplate btnNew">确定</button>
                    </div>
                </div>
            </div>
          </mt-popup>

          <mt-popup v-model="isPay" position="bottom">
            <div class="orderLayerWrap">
                <div class="orderLayer01 orderLayer02">
                    <p class="orderLayerTitle">选择支付方式</p>
                    <ul class="integralTicket">
                        <li v-if="wayOpen === '微信'" @click="paymentSelet('微信支付')" class="clearfix" :class="{ticketOn: paymentType.payTypeSelect === '微信支付'}">
                            <div class="orderLayerPic">
                                <img src="../../assets/center/img_wechat.png" alt="">
                            </div>
                            <div class="orderLayerWord">
                                <p>微信支付<span><img src="../../assets/center/img_recommend.png" alt=""></span></p>
                                <span>微信安全支付</span>
                            </div>
                            <i class="centerChoice"><svg><use xlink:href="#choice"/></svg></i>
                        </li>
                        <li v-if="wayOpen === '支付宝'" @click="paymentSelet('支付宝')" class="clearfix" :class="{ticketOn: paymentType.payTypeSelect === '支付宝'}">
                            <div class="orderLayerPic">
                                <img src="../../assets/center/img_alipay.png">
                            </div>
                            <div class="orderLayerWord">
                                <p>支付宝</p>
                                <span>支付宝安全支付</span>
                            </div>
                            <i class="centerChoice"><svg><use xlink:href="#choice"/></svg></i>
                        </li>
                    </ul>
                </div>
            </div>
          </mt-popup>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    const query = this.$route.query;
    // const id = this.$route.params.id;
    return {
      // id: id,
      query: query,
      userInfo: {},
      item: {
        paymentType: 1,			
        paymentName: 1,
        listCartId: [],				
        addressId: '',					
        userPointId: [],					
        usePoint: 0,					
        orderToken: '',					
        orderType: 0,									
        orderMessage: ''		
      },
      payItem: {
        paymentType: 1,			
        paymentName: 1,				
        payForPoint: '',				
        paymentTotalFee: '',				
        userPointId: '',				
        usePoint: '',				
        addressId: ''			
      },
      shoppingData: [],
      shopingPoint: 0,
      freightPoint: 0,
      payByMoney: 0,
      commodityIds: '',
      address: {},
      shippingCharge: {},
      orderCardList: [],
      cardPointUser: 0,
      cardPointUserSure: 0,
      cardSelectAllPoint: 0,
      pointUse: {
        pointUsePrompt: 0,
        pointUseSure: 0,
      },
      selectCardList: [],
      selectCardListOld: [],
      isCard: false,
      isIntegral: false,
      isPay: false,
      paymentType: {
        payTypeSelect: '',
        payTypeCode: 1
      },
      allPoint: 0,
      wayOpen: '',
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      CARDFLAG: ['不可用', '可用'],
      DELIVERYTYPE: ['自营', 'JD']
    }
  },

  methods: {
    ...mapMutations({
      setWeixinpay: 'WEIXINPAY_PARMA'
    }),

    goAddressList() {
      this.$router.push({name: 'addressList'})
    },

    getDefaultAddress() {
      this.Api.get('userAddressDefault')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.address = res.data.data;
        this.item.addressId = res.data.data.addressId;
        // this.getFreightPoint();
      })
    },

    // getFreightPoint() {
      // this.Api.get('myOrderLogistics', {
      //   uid: this.address.addressId
      // })
      // .then(res => {
      //   if (res.data.code) {
      //     this.$toast(res.data.errors.message);
      //     return;
      //   }
      // })
    // },

    getIntegralCard() {
      if (this.query.commodityId) this.commodityIds = this.query.commodityId;
      this.Api.get('orderCard', {
        commodityIds: this.commodityIds
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        if (data.length > 0) {
          data.map(item => {
            item.cardFlag = this.CARDFLAG[item.cardFlag];
            item.selectCardFlag = false;
          })
        }
        
        this.orderCardList = data;
      })
    },

    getShopingList() {
      if (this.query.commodityId) {
        this.Api.get('order', this.query)
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          let data = res.data.data;
          if (data.deliveryType == 0) this.item.orderType = 1;
          if (data.deliveryType == 1) this.item.orderType = 2;
          data.deliveryType = this.DELIVERYTYPE[data.deliveryType];
          data.purchasingNum = this.query.purchasingNum;
          this.shoppingData.push(data);
          this.freightPoint = data.shippingCharge;
          this.shoppingData.forEach(priceItem => {
            let p = priceItem.discountPrice ? priceItem.discountPrice : priceItem.price;
            this.shopingPoint += p * priceItem.purchasingNum
          })
          this.paymoney();
        })
      } else {
        this.Api.get('orderCart')
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          let data = res.data.data;
          this.shoppingData = this.shoppingData.concat(data.listJD, data.listBenefit);
          this.shoppingData.map(item => {
            item.deliveryType = this.DELIVERYTYPE[item.deliveryType];
          })
          this.freightPoint = data.shippingCharge;
          if (data.listJD.length > 0 && data.listBenefit.length > 0) this.item.orderType = 0;
          if (data.listJD.length == 0 && data.listBenefit.length > 0) this.item.orderType = 1;
          if (data.listJD.length > 0 && data.listBenefit.length == 0) this.item.orderType = 2;
          this.item.listCartId = data.listCartId;
          this.shoppingData.forEach(priceItem => {
            let p = priceItem.discountPrice ? priceItem.discountPrice : priceItem.price;
            this.shopingPoint += p * priceItem.purchasingNum;
            // this.shopingPoint += priceItem.price * priceItem.purchasingNum;
            this.commodityIds += `${priceItem.commodityId},`;
          })
          this.paymoney();
        })
      }
    },

    shopingDataType(type) {
      let typeData = [];
      typeData = this.shoppingData.filter(item => item.deliveryType === type);
      return typeData;
    },

    getIntegral() {
      this.Api.get('userPointMyPoint')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.allPoint = data.point.toString();
      })
    },

    selectCard() {
      this.isCard = true;
      if (this.selectCardListOld.length > 0) {
        this.selectCardListOld.forEach((value, key) => {
          this.orderCardList.map(res => {
            if (res.userPointId == value) {
              res.selectCardFlag = true
            } else {
              res.selectCardFlag = false
            }
          })
        });
      } else {
        this.orderCardList.map(res => {
          res.selectCardFlag = false
        })
      }
      
    },

    seletCardSure(card) {
      let id = card.userPointId;
      if (card.cardFlag === '不可用') {
        return;
      }
      card.selectCardFlag = !card.selectCardFlag;
      if (card.selectCardFlag) {
        if (this.selectCardList.indexOf(id) > -1) {
          return;
        } else {
          this.selectCardList.push(id);
          let thisCardAdd = this.orderCardList.filter(res => res.userPointId === id);
          this.cardPointUser += thisCardAdd[0].remainderPoint;
        }
      } else {
        if (this.selectCardList.indexOf(id) > -1) {
          this.selectCardList.splice(this.selectCardList.indexOf(id), 1);
          let thisCardRed = this.orderCardList.filter(res => res.userPointId === id);
          this.cardPointUser -= thisCardRed[0].remainderPoint;
        } else {
          return;
        }
      }
    },

    pointUseSureBtn() {
      this.pointUse.pointUsePrompt = parseInt(this.pointUse.pointUsePrompt);
      if (!this.pointUse.pointUsePrompt || isNaN(this.pointUse.pointUsePrompt)) {
        this.$toast(`输入正确的积分格式`);
        this.pointUse.pointUsePrompt = 0;
        this.isIntegral = false;
        return;
      }
      let sumPoint = parseInt(this.shopingPoint) + parseInt(this.freightPoint);
      let cardPoint = parseInt(this.cardPointUserSure);
      this.allPoint = parseFloat(this.allPoint)
      if (this.pointUse.pointUsePrompt > this.allPoint) {
        this.$toast(`当前无那么多的积分数，请重新输入`);
        this.pointUse.pointUsePrompt = 0;
      } else if (this.pointUse.pointUsePrompt < 0) {
        this.$toast('不能为负数');
        this.pointUse.pointUsePrompt = 0;
      } else if (this.pointUse.pointUsePrompt % this.userInfo.pointRate != 0) {
        this.$toast(`使用的积分数只能是${this.userInfo.pointRate}的整倍数`);
        this.pointUse.pointUsePrompt = 0;
      } else if (sumPoint < cardPoint) {
        this.$toast('使用积分卡券上的积分已足够，不需要再使用积分');
        this.pointUse.pointUsePrompt = 0;
      } else {
        if (parseInt(this.pointUse.pointUsePrompt) > (sumPoint - cardPoint)) {
          this.pointUse.pointUseSure = sumPoint - cardPoint;
          this.pointUse.pointUsePrompt = this.pointUse.pointUseSure;
          this.item.usePoint = this.pointUse.pointUseSure;
        } else {
          this.pointUse.pointUseSure = this.pointUse.pointUsePrompt;
          this.item.usePoint = this.pointUse.pointUsePrompt;
        }
      }
      this.isIntegral = false;
      this.paymoney();
    },

    orderCardPay() {
      let sumPoint = parseInt(this.shopingPoint) + parseInt(this.freightPoint);
      let point = parseInt(this.pointUse.pointUseSure);
      // if (point == sumPoint) {
      //   this.$toast('已使用足够的积分，不需要使用积分卡券');
      //   this.selectCardList = [];
      //   this.cardPointUserSure = 0;
      //   this.isCard = false;
      //   return;
      // }
      // if (this.cardPointUser > (sumPoint - point)) {
      //   this.cardPointUserSure = sumPoint - point;
      // } else {
      //   this.cardPointUserSure = this.cardPointUser;
      // }
      if (parseInt(this.cardPointUser) > parseInt(sumPoint)) {
        this.pointUse.pointUseSure = 0;
        this.cardPointUserSure = sumPoint;
      } else if (this.cardPointUser > (sumPoint - point)) {
        this.pointUse.pointUseSure = sumPoint - this.cardPointUser;
        this.cardPointUserSure = this.cardPointUser;
      } else {
        this.cardPointUserSure = this.cardPointUser;
      }
      this.item.userPointId = this.selectCardList;
      this.isCard = false;
      this.selectCardListOld = this.selectCardList;
      this.paymoney();
    },

    selectIntegral() {
      this.isIntegral = true;
    },

    payType() {
      this.isPay = true;
    },

    paymentSelet(type) {
      this.paymentType.payTypeSelect = type;
      if(type === '微信支付') {
        this.payItem.paymentType = 1;
        this.paymentType.payTypeCode = 1;
      } else if(type === '支付宝') {
        this.payItem.paymentType = 2;
        this.paymentType.payTypeCode = 2;
      }

      this.isPay = false;

    },  

    paymoney() {
      let allPonitNeed = parseInt(this.shopingPoint) + parseInt(this.freightPoint);
      let pointDeduction = parseInt(this.cardPointUserSure) + parseInt(this.pointUse.pointUseSure);
      this.payByMoney = (allPonitNeed - pointDeduction) / this.userInfo.pointRate;
    },

    doSubmit() {
      if (this.query.orderToken) this.item.orderToken = this.query.orderToken;
      if (this.query.commodityId) {
        this.item.commodityId = this.query.commodityId;
        this.item.skuId = this.query.skuId;
        this.item.purchasingNum = this.query.purchasingNum;
        delete this.item.listCartId;
      }
      if (this.payByMoney > 0) {
        this.item.paymentType =  this.paymentType.payTypeCode;
        this.item.paymentName =  this.paymentType.payTypeCode;
      } else {
        this.item.paymentType =  0;
        this.item.paymentName =  0;
      }
      this.Api.post('order', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        
        this.payItem.payForPoint = this.item.usePoint;
        this.payItem.userPointId = this.item.userPointId;
        this.payItem.paymentTotalFee = this.payByMoney;
        this.payItem.addressId = this.item.addressId;

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
    },

    getUserInfo() {
      this.userInfo = this.$store.state.userInfo;
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    this.getShopingList();
    this.getDefaultAddress();
    this.getIntegral();
    this.getUserInfo();
    this.getIntegralCard();
  },

  mounted() {
    this.Session.remove('orderComfirmAddress');
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      this.wayOpen = '微信';
      this.paymentType.payTypeSelect = "微信支付";
      this.paymentType.payTypeCode = 1;
    } else {
      this.wayOpen = '支付宝'
      this.paymentType.payTypeSelect = "支付宝";
      this.paymentType.payTypeCode = 2;
    }
  },

  watch: {
    'isIntegral': {
      handler(newName, oldName) {
        this.pointUse.pointUsePrompt = this.item.usePoint;
        // console.log(this.pointUse.pointUsePrompt);
      }
    }
  }
}
</script>