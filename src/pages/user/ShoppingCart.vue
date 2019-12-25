<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>购物车</h1>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <div v-if="!cartList.length" class="noData">------暂无数据------</div>
          <div class="addressWrap">
              <div class="addressItem" v-for="(deliver, idx) in DELIVERYTYPE" :key="idx" v-show="cartListFlter(deliver).length > 0">
                <div>
                  <p @click="isCheckAll(idx)" class="addressTitle addressTitle01" :class="{ticketOn: selectAllType[idx]}"><i class="centerChoice centerChoice03"><svg><use xlink:href="#choice"/></svg></i>{{deliver}}</p>
                  <ul class="centerList01 centerList03 centerList05 centerList07">
                      <li class="clearfix" v-for="(cart, index) in cartListFlter(deliver)" :key="index" v-show="cart.deliveryType == deliver" @click="goGoodsDetail(cart.commodityId)">
                          <i @click.stop="isCheckOn(cart)" class="centerChoice centerChoice03" :class="{ticketOn: cart.cartStaus}"><svg><use xlink:href="#choice"/></svg><span>失效</span></i>
                          <a href="#">
                              <div class="orderListPic">
                                <img :src="cart.imageName">
                              </div>
                          </a>
                          <div class="orderText orderText01">
                              <p class="cartCommodityName">{{cart.commodityName}}</p>
                              <!-- <span>尺寸/规格</span> -->
                              <span>
                                {{cart.standardDetail1Name ? cart.standardDetail1Name : ''}}
                                {{cart.standardDetail2Name ? `/${cart.standardDetail2Name}` : ''}}
                                {{cart.standardDetail3Name ? `/${cart.standardDetail3Name}` : ''}}
                                {{cart.standardDetail4Name ? `/${cart.standardDetail4Name}` : ''}}
                                {{cart.standardDetail5Name ? `/${cart.standardDetail5Name}` : ''}}
                                {{cart.standardDetail6Name ? `/${cart.standardDetail6Name}` : ''}}
                              </span>
                              <b class="orderIntegral orderIntegral02">{{cart.price}}<span>{{pointUnit}}</span></b>
                              <i @click.stop="stop" class="orderNum orderNum02">
                                  <button @click.stop ="redShopping(cart)">-</button>
                                  <input maxlength="8" disabled @blur="changeShoppingCount(cart)" v-model="cart.purchasingNum" type="number">
                                  <button @click.stop="addShopping(cart)">+</button>
                              </i>
                              <i @click.stop="shoppingDel(cart)" class="orderDel"><svg><use xlink:href="#delete"/></svg></i>
                              <!-- <img src="../../assets/common/img_delete.png" alt=""> -->
                              <!-- <svg><use xlink:href="#delete"/></svg>     width: 11px;height: 12px;fill: #aeaeae;-->
                          </div>
                      </li>
                  </ul>
                </div>    
              </div>
          </div>
          <div class="centerWrap01 shoppingTotal">
              <div class="placeOrder clearfix">
                  <p v-if="sumPrice != 0">合计：<span>{{sumPrice | NumberFormat}}<b>{{pointUnit}}</b></span></p>
                  <p v-if="sumPrice == 0">合计：<span>{{sumPrice}}<b>{{pointUnit}}</b></span></p>
                  <button @click="settlement">结算</button>
              </div>
          </div>
          <div class="footerSpace footerSpace01"></div>
      </div>
      
      <footer-self active="shoppingCart"></footer-self>
  </div>
</template>

<script>
import FooterSelf from '@/components/Footer';
import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      cartList: [],
      selectAllType: [],
      pages: {
        currentPage: 1,
        totalPage: 1,
      },
      sumPrice: 0,
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      DELIVERYTYPE: ['自营', 'JD']
    }
  },

  components: {
    FooterSelf
  },

  methods: {
    fetchData() {
      this.Api.get('userCart')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;

        data.map(item => {
          item.deliveryType = this.DELIVERYTYPE[item.deliveryType];
        })
        this.cartList = data;
        this.isSelectAll();
        // this.sumPriceUpdata();
      })
    },

    changeCountSubmit(cart, buyNum) {
      this.Api.put('userCartUid', {
        uid: cart.cartId,
        purchasingNum: buyNum
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        cart.purchasingNum = buyNum;
        this.sumPriceUpdata();
      })
    },

    cartListFlter(key) {
      let cartListType = [];
      let allCartListData = [...this.cartList];
      if (allCartListData.length > 0) cartListType = allCartListData.filter(item => item.deliveryType === key);
      return cartListType;
    },

    changeShoppingCount(cart) {
      let shopping = cart;
      let cartId = shopping.cartId;
      let buyNum = shopping.purchasingNum;
      let originNum = Object.assign({}, shopping);
      let maxNum = shopping.oneUserOrderLimit;
      if (buyNum < 1) {
        this.$toast('购买数量不能小于1');
        buyNum = originNum;
        return;
      } else if(maxNum && buyNum > maxNum) {
        this.$toast(`每人最多能购买${maxNum}件该产品`);
        buyNum = originNum;
        return;
      }
      this.changeCountSubmit(shopping, buyNum);
    },

    redShopping(cart) {
      let shopping = cart;
      let cartId = shopping.cartId;
      let buyNum = shopping.purchasingNum;
      if (buyNum > 1) {
        buyNum -- ;
        this.changeCountSubmit(shopping, buyNum);
      } else {
        this.$toast('购买数量不能小于1');
      }
    },

    addShopping(cart) {
      let shopping = cart;
      let cartId = shopping.cartId;
      let buyNum = shopping.purchasingNum;
      let maxNum = shopping.oneUserOrderLimit;
      if (maxNum && buyNum >= maxNum) {
        this.$toast(`每人最多能购买${maxNum}件该产品`);
        return;     
      }
      buyNum ++ ;
      this.changeCountSubmit(shopping, buyNum);
    },

    shoppingDel(cart) {
      let shopping = cart;
      let cartId = shopping.cartId;
      MessageBox.confirm('确定删除该商品?' , '删除确认').then(action => {
        this.Api.delete('userCartUid', {
          uid: cartId
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          let cartIndex = this.cartList.indexOf(cart);
          this.cartList.splice(cartIndex, 1);
          this.isSelectAll();
          // this.sumPriceUpdata();
          // this.fetchData();
        })
      })
      .catch(action => {
        return;
      });
    },

    isCheckAll(idx) {
      let type = this.DELIVERYTYPE[idx];
      this.selectAllType[idx] = !this.selectAllType[idx];
      this.cartListFlter(type).map(item => item.cartStaus = this.selectAllType[idx]);
      this.sumPriceUpdata();
      this.$forceUpdate();
    },

    isCheckOn(cart) {
      cart.cartStaus = !cart.cartStaus;
      this.isSelectAll();
    },

    
    isSelectAll() {
      // let allCartListData = [...this.cartList];
      // let noSelect = allCartListData.filter(item => !item.cartStaus);
      // if (noSelect.length == 0) {
      //   for (let i = 0; i < this.selectAllType.length; i ++) {
      //     this.selectAllType[i] = true;
      //   }
      //   return;
      // };
      // this.DELIVERYTYPE.forEach((k, v) => {
      //   let typeData = noSelect.filter(item => item.deliveryType === k);
      //   if (typeData.length > 0) {
      //     this.selectAllType[v] = false;
      //   } else {
      //     this.selectAllType[v] = true;
      //   }
      // })

      this.DELIVERYTYPE.forEach((k, v) => {
        let typeData = this.cartList.filter(item => item.deliveryType === k);
        this.selectAllType[v] = typeData.every(item => {
          return item.cartStaus;
        })
        this.sumPriceUpdata();
      })

    },

    settlement() {
      let type = this.DELIVERYTYPE;
      let allId = [];
      for (let i = 0; i < this.cartList.length; i ++) {
        if (this.cartList[i].cartStaus) {
          allId.push(this.cartList[i].cartId);
        }
      }
      if (allId.length == 0) {
        this.$toast('请选择需要购买的商品');
        return;
      };
      this.Api.post('lockOrderCat', {
        listCartId: allId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.$router.push({
          name: 'orderComfirm',
          query: {
            orderToken: data.orderToken
          }
        })
      })
    },

    sumPriceUpdata() {
      this.sumPrice = 0;
      for(let i = 0; i < this.cartList.length; i ++) {
        if (this.cartList[i].cartStaus) {
          this.sumPrice += this.cartList[i].price * this.cartList[i].purchasingNum
        }
      }
    },

    goGoodsDetail(id) {
      this.$router.push({
        name: 'goodsDetail',
        params: {id: id}
      })
    },

    doBack() {
      this.$router.back(-1);
    },

    stop() {
      return;
    }
  },

  created() {
    this.fetchData();
  }
}
</script>