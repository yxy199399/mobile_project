<template>
  <div id="container">
      <div class="gHeader">
          <div class="back" @click="doBack"></div>
          <h1>商品详情</h1>
          <!-- <div class="standard">分享</div> -->
      </div>
      <div id="main">
          <div class="goodsBannerBox">
              <div class="goodsBanner">
                  <mt-swipe  @change="swiperImgChange" ref="swiperImg" :auto="0" :show-indicators="false">
                    <mt-swipe-item v-for="(good, idx) in goodsData.listCommodityImgBean" :key="idx">
                      <img :src="good.imageName">
                    </mt-swipe-item>
                  </mt-swipe>
              </div>
              <div class="bannerPage">{{swiperBadge.currentNum}}<span>/</span>{{swiperBadge.allNum}}</div>
          </div>
          <!-- <div v-if="goodsData.campaignId">促销商品</div> -->
          <div class="goodsTitle">
              <h2>{{goodsData.commodityName}}</h2>
              <p>
                <span v-if="goodsData.discountPrice">{{goodsData.discountPrice | NumberFormat}}</span>
                <span v-if="!goodsData.discountPrice">{{goodsData.price | NumberFormat}}</span>
                <b>{{pointUnit}}</b>
                <i>{{goodsData.deliveryType}}</i>
              </p>
              <!-- <p><span>{{goodsData.price}}</span><b>{{pointUnit}}</b><i>{{goodsData.deliveryType}}</i></p> -->
          </div>
          <div v-if="goodsData.campaignEndDatetime" class="flashSale goodsFlashSale">
            <div class="flashSaleTitle clearfix">
              <span>限时抢购</span>
              <div class="flashSaleTime">
                <span>距活动结束</span>
                <down-time :time="goodsData.campaignEndDatetime"></down-time>
              </div>
            </div>
          </div>
          <div class="centerWrap01 centerWrap03 centerWrap05">
              <ul class="centerList01 centerList02 centerList06 centerList09">
                  <!-- <li>
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      <p><span><i>参数</i>品牌/材质/产地...</span></p>
                  </li> -->
                  <li @click="selectColor">
                      <img src="../../assets/common/icon_arrow.png" alt="">
                      <p><span><i>选择</i>颜色分类/尺寸</span></p>
                  </li>
              </ul>
          </div>
          <div class="centerWrap03 centerWrap05 centerWrap08" v-show="goodsData.videoPath">
              <div class="videoBox">
                  <video :src="goodsData.videoPath" :poster="goodsData.videoPicture" webkit-playsinline="true" playsinline="" muted="muted">暂时不支持播放该视频</video>
                  <div class="goodsMask"></div>
                  <span v-if="isPayingNow" @click="isPaying($event)" class="goodsPlay"><svg><use xlink:href="#video"/></svg></span>
              </div>
          </div>
          <div class="centerWrap03 centerWrap05 centerWrap10" v-show="goodsData.commodityDescriptionPc">
              <div class="centerTitle02 centerTitle03 centerTitle04 centerTitle06">
                  <p class="orderInfoTitle orderInfoTitle01">商品详情</p>
              </div>
              <div class="goodsDetailImg" v-html="goodsData.commodityDescriptionPc">
                {{goodsData.commodityDescriptionPc}}
              </div>
          </div>
          <div class="centerWrap03 centerWrap05 centerWrap10" v-if="recommendData.length > 0">
              <div class="centerTitle02 centerTitle03 centerTitle04 centerTitle06">
                  <p class="orderInfoTitle orderInfoTitle01">人气推荐</p>
              </div>
              <div class="goodsLikeList goodsLikeList01">
                  <ul class="clearfix">
                      <li v-for="(recommend, rIdx) in recommendData" :key="rIdx" @click="goGoodsDeTail(recommend.commodityId)">
                          <a href="#">
                              <div class="likeGoodsPic">
                                  <img class="goodsDetailsPic" :src="recommend.imageName">
                              </div>
                              <span>{{recommend.commodityName}}</span>
                              <p>{{recommend.price | NumberFormat}}{{pointUnit}}</p>
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="centerWrap01 centerWrap06 centerWrap11">
              <div class="detailsBuy clearfix">
                  <ul class="clearfix">
                      <li class="detailsService" onclick="globalMobileIcon.openMobileInnerChat();">
                          <svg><use xlink:href="#service"/></svg>
                      </li>
                      <li @click="goCart" class="detailsCart">
                          <svg><use xlink:href="#cart01"/></svg>
                      </li>
                      <li @click="addInCollection" class="detailsCollection" :class="{onCollenction: goodsData.favoriteFlg}">
                          <svg><use xlink:href="#collection"/></svg>
                      </li>
                  </ul>
                  <div class="detailsBuyBtn"><button class="addCartBtn" :disabled="popupGoodsData.discountPrice" @click="addInCart">加入购物车</button><button @click="buyNow" class="buyBtn">立即购买</button></div>
              </div>
          </div>
          <mt-popup class="mtPropupMaxHeHalf" v-model="isDetial" position="bottom">
            <div class="orderLayerWrap">
                <div class="orderLayer01 orderLayer03">
                    <div class="layerGoods clearfix">
                        <div class="layerGoodsPic">
                            <img :src="selectImg">
                        </div>
                        <div class="layerGoodsWord goodsTitle">
                            <h2>{{goodsData.commodityName}}</h2>
                            <i>{{goodsData.deliveryType}}</i>
                            <p>
                              <span v-if="popupGoodsData && !popupGoodsData.discountPrice">{{popupGoodsData.sellingPrice | NumberFormat}}</span>
                              <span v-if="popupGoodsData && popupGoodsData.discountPrice">{{popupGoodsData.discountPrice | NumberFormat}}</span>
                              <b>{{pointUnit}}</b>
                            </p>
                        </div>
                    </div>
                    <div class="goodsInfoChoice">
                        <div v-for="(type, oIdx) in goodsType" :key="oIdx">
                            <span>{{type.name}}</span>
                            <ul ref="goodsParmas">
                                <li :class="{goodsOn: goodsAttriSelect[oIdx] === iIdx}" v-for="(typeList, iIdx) in type.listCommodityStanDard" :key="iIdx" @click="choiceGoodsAttri($event,oIdx, iIdx)">
                                  <b>{{typeList.standardDetailName}}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="goodsNumChoice goodsInfoChoice">
                        <span>数量</span>
                        <i class="orderNum orderNum02 orderNum03">
                            <button @click="changeNum('red')" class="numDisabled">-</button>
                            <input maxlength="8" disabled @keyup.enter="changeNum()" v-model="purchasingNum" type="text">
                            <button @click="changeNum('add')">+</button>
                        </i>
                    </div>
                </div>
                <div class="btnWrap">
                    <button @click="BuyNumSure" class="btnTemplate btnNew">确定</button>
                </div>
            </div>
          </mt-popup>
          <div class="footerSpace footerSpace02"></div>
      </div>
  </div>
</template>

<script>
import downTime from '@/components/DownTime';
export default {
  data() {
    const id = this.$route.params.id;
    return {
      id: id,
      goodsData: {},
      popupGoodsData: {},
      goodsType: [],
      goodsAttri: [],
      goodsAttriSelect: [],
      isDetial: false,
      purchasingNum: 1,
      subPurchasingNum: 1,
      swiperBadge: {
        allNum: 0,
        currentNum: 1,
      },
      specification: {
        oIndex: '',
        iIndex: ''
      },
      skuId: null,
      recommendData: [],
      selectImg: '',
      buyOrAdd: '',
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      selectTypeCount: 0,
      isPayingNow: true,
      DELIVERYTYPE: ['自营', 'JD']
    }
  },

  components: {
    downTime
  },

  methods: {
    fetchData() {
      this.Api.get('commodityUid',{
        uid: this.id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;

        data.deliveryType = this.DELIVERYTYPE[data.deliveryType];
        this.goodsData = data;
        data.listCommodityDetailBean.map(item => {
          let allDardInfo = '';
          data.listCommodityStanDardInfoBean.forEach((iItem, iI) => {
            let filterKey = `standardDetail${iI + 1}Name`;
            allDardInfo += `$${item[filterKey]}`;
          });
          item.allDardInfo = allDardInfo;
        })
        this.swiperBadge.allNum = data.listCommodityImgBean.length;
        this.goodsType = data.listCommodityStanDardInfoBean;
        this.popupGoodsData = data.listCommodityDetailBean[0];
        this.selectImg = data.listCommodityImgBean[0].imageName;
        if (this.goodsData.campaignId) {
          // this.popupGoodsData.discountPrice = true;
        }
      })
    },

    fetchRecommendData() {
      this.Api.get('userHomePageRecommend')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.recommendData = data.list;
      })
    },

    selectColor() {
      this.isDetial = true;
    },

    changeNum(type) {
      if(type === 'add') {
        if (this.goodsData.oneUserOrderLimit && this.purchasingNum > this.goodsData.oneUserOrderLimit -1) {
          this.$toast(`购买数量不能超过${this.goodsData.oneUserOrderLimit}`);
          this.isDetial = false;
          return;
        }
        this.purchasingNum ++;
      } else if (type === 'red') {
        if (this.purchasingNum < 2) {
          this.$toast('数量不能小于1');
          this.isDetial = false;
          return;
        }
        this.purchasingNum --
      } else {
        if (this.goodsData.oneUserOrderLimit && this.purchasingNum > this.goodsData.oneUserOrderLimit) {
          this.$toast(`购买数量不能超过${this.goodsData.oneUserOrderLimit}`);
          this.isDetial = false;
          this.purchasingNum = 1;
          return;
        } else if(this.purchasingNum < 1) {
          this.$toast('数量不能小于1');
          this.isDetial = false;
          this.purchasingNum = 1;
          return;
        }
      }
    },

    BuyNumSure() {
      let msg = '';
      if (this.goodsAttri.length == 0 && this.goodsType.length > 0) msg += '请选择商品参数\n';
      for (let i = 0; i < this.goodsAttri.length; i ++) {
        if (!('standardDetailName' in this.goodsAttri[i]))  msg += `请选择${this.goodsAttri[i].attriName}`;
      }
      if (this.purchasingNum <= 0) msg += '请选择购买数量\n';
      if (msg) {
        this.$toast(msg);
        return;
      }
      this.subPurchasingNum = this.purchasingNum;
      this.getGoodSkuId();
    },

    addInCart() {
      // if (this.goodsData.campaignId) return;

      if (!this.goodsData.skuId) {
        this.isDetial = true;
        this.buyOrAdd = 'add';
        return;
      }
      if (!this.subPurchasingNum) {
        this.isDetial = true;
        return;
      }

      this.Api.post('userCartUid', {
        uid: this.id,
        skuId: this.goodsData.skuId,
        purchasingNum: this.subPurchasingNum
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$toast('添加成功');
      })
    },

    buyNow() {
      if (!this.goodsData.skuId) {
        this.isDetial = true;
        this.buyOrAdd = 'buy';
        return;
      }
      if (!this.subPurchasingNum) {
        this.isDetial = true;
        return;
      }
      this.Api.post('lockOrder', {
        skuId: this.goodsData.skuId,
        purchasingNum: this.subPurchasingNum,
        commodityId: this.goodsData.commodityId,
        addressId: this.goodsData.addressId
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
            skuId: data.skuId,
            commodityId: this.id,
            purchasingNum: data.purchasingNum,
            orderToken: data.orderToken
          }
        })
      })
    },

    addInCollection() {

      this.Api.post('userFavoriteUid', {
        uid: this.goodsData.commodityId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.goodsData.favoriteFlg = !this.goodsData.favoriteFlg;
        if (res.data.data.favoriteFlg) {
          this.$toast('取消收藏成功');
        } else {
          this.$toast('收藏成功');
        }
      })
    },

    choiceGoodsAttri(e, oIndex, iIndex) {
      if (e.currentTarget.classList.value === 'goodsDisabeld') return;
      this.specification.oIndex = oIndex;
      this.specification.iIndex = iIndex;
      let attribute = this.goodsType[oIndex].listCommodityStanDard[iIndex];
      this.goodsAttriSelect[oIndex] = iIndex;
      if (this.goodsAttri.length == 0) {
        for (let i = 0; i < this.goodsType.length; i ++) {
          let attri = {};
          let attriName = this.goodsType[i].name;
          attri['attriName'] = attriName;
          this.goodsAttri.push(attri);
        }
      }
      this.selectTypeCount ++;
      this.goodsAttri[oIndex]['standardDetailName'] = attribute.standardDetailName;
      this.$forceUpdate();
    },

    setSwiperHeight() {
      let swiperImg = this.$refs.swiperImg.$el;
      let w = swiperImg.clientWidth;
      swiperImg.style.height = w + 'px';
    },

    swiperImgChange(index) {
      this.swiperBadge.currentNum = index + 1;
    },

    goCart() {
      this.$router.push({
        name: 'shoppingCart'
      })
    },

    goGoodsDeTail(id) {
      this.$router.push({
        name: 'goodsDetail',
        params: {id: id}
      })
    },

    getGoodSkuId() {
      let allGoodsData = [...this.goodsData.listCommodityDetailBean];
      let filterData = this.goodsAttri;
      for (let i = 0; i < filterData.length; i ++) {
        let filterKey = `standardDetail${i + 1}Name`;
        allGoodsData = allGoodsData.filter(item => item[filterKey] === filterData[i].standardDetailName);
      }
      if (allGoodsData.length == 0) {
        this.$toast('该商品已售完，请重新选择');
        return;
      }
      if (allGoodsData[0].skuId) this.goodsData.skuId = allGoodsData[0].skuId;
      if (this.buyOrAdd === 'add') {
        this.addInCart()
      } else if (this.buyOrAdd === 'buy'){
        this.buyNow();
      }
      this.isDetial = false;
    },

    isPaying() {
      let that = this;
      let oVideo = document.querySelector('video');
      let videoDom = this.$refs.video;
      oVideo.play();
      oVideo.addEventListener('play',function(){
        that.isPayingNow = false;
      });
      oVideo.addEventListener('pause',function(){
        that.isPayingNow = true;
      })
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    this.fetchData();
    this.fetchRecommendData();
  },

  mounted() {
    this.setSwiperHeight();
    window.parent.scrollTo(0, 0);
  },

  watch: {
    'isDetial': {
      handler(newName, oldName) {
        // if (!this.goodsData.skuId) {
        //   this.goodsAttriSelect = [];
        // }
      }
    },

    'selectTypeCount': {
      handler(newName, oldName) {
        let allGoodsData = [...this.goodsData.listCommodityDetailBean];
        let filterData = this.goodsAttri;
        let allType = [...this.goodsType];
        let hasGoods = [];
        let noChioce = [];
        let noChioceIndex = [];
        let noGoodsArr = [];

        let leavesGoodsData = [...this.goodsData.listCommodityDetailBean];
        let leavesType = [...this.goodsType];
        let leavesDom = [...this.$refs.goodsParmas];
        let leavesParams = [];
        let selectDom = document.getElementsByClassName('goodsOn');
        let selectedType = this.goodsType[this.specification.oIndex].listCommodityStanDard[this.specification.iIndex].standardDetailName;
        leavesGoodsData = leavesGoodsData.filter(item => item[`standardDetail${this.specification.oIndex + 1}Name`] === selectedType);

        for (let i = 0; i < leavesDom.length; i ++) {
          let otherFilter = [...filterData];
          let domFilter = [];
          let allExitParam = [];
          let liDom = [];
          let liDomValue = [];
          liDom = leavesDom[i].children;
          let allGoods = [...this.goodsData.listCommodityDetailBean];
          otherFilter.forEach((llv, lli) => {
            if (lli == i) {
              allGoods = allGoods;
            } else if (llv.standardDetailName) {
              let filterKey = `standardDetail${lli + 1}Name`;
              allGoods = allGoods.filter(aitem => aitem[filterKey].replace(/\s/g,"") === llv.standardDetailName.replace(/\s/g,""));
            }
          });

          // console.log(allGoods)

          allGoods.forEach((lav, lai) => {
            otherFilter.forEach((laov, laoi) => {
              if (laoi == i) {
                let filterKey = `standardDetail${laoi + 1}Name`;
                if (allExitParam.indexOf(lav[filterKey].replace(/\s/g,"")) < 0) allExitParam.push(lav[filterKey].replace(/\s/g,""));
              }
            }) 
          });

          // console.log(liDom);
          // console.log(allExitParam)
          for (let j = 0; j < liDom.length; j ++) {
            if (liDom[j].classList.value === 'goodsDisabeld') liDom[j].classList.remove('goodsDisabeld');
            let liDomValue = liDom[j].innerText.replace(/\s/g,"");
            if (allExitParam.indexOf(liDomValue) < 0) {
              liDom[j].classList.add("goodsDisabeld");
            }
          }

          // domFilter.forEach((llfv, llfi) => {
          //   let filterKey = `standardDetail${i + 1}Name`;
          //   allGoods = allGoods.filter(aitem => aitem.allDardInfo.indexOf(llfv.standardDetailName) > -1);
          // });

          // console.log(allGoods);

          
          
          // liDomValue.forEach((liv, lii) => {
          //   console.log(allGoods);
          //   if (allGoods.allDardInfo.indexOf(liv) < 0) {
          //     console.log(111);
          //   }
          // })
          // filterData.forEach((llv, lli) => {
          //   if (i === lli) {
          //     console.log(llv);
          //   }
          // })
        }

        // leavesDom.splice(this.specification.oIndex, 1);

        // Array.prototype.forEach.call(selectDom, function(ele, index) {
        //     console.log(selectDom);
        // })

        // 重新选择移除没有商品的规格添加的goodsDisabeld
        // noGoodsArr = document.getElementsByClassName('goodsDisabeld');
        // for (let i = 0; i < noGoodsArr.length; i ++) {
        //   console.log(noGoodsArr[i].parent);
        //   noGoodsArr[i].classList.remove('goodsDisabeld');
        // }

        // 获取选中规格下的所有商品
        for (let i = 0; i < filterData.length; i ++) {
          let filterKey = `standardDetail${i + 1}Name`;
          if (filterData[i].standardDetailName) allGoodsData = allGoodsData.filter(item => item[filterKey] === filterData[i].standardDetailName);
        }

        // leavesGoodsData.forEach(lv => {
        //   leavesType.forEach((ltv, lti) => {
        //     if (lti != this.specification.oIndex) {
        //       let filterKey = `standardDetail${lti + 1}Name`;
        //       if (leavesParams.indexOf(lv[filterKey]) < 0) leavesParams.push(lv[filterKey].replace(/\s/g,""));
        //     }
        //   })
        // });

        // leavesDom.forEach(ldv => {
        //   for (let i = 0; i < ldv.children.length; i ++) {
        //     let liDom = ldv.children[i];
        //     if (liDom.classList.value === 'goodsDisabeld') liDom.classList.remove('goodsDisabeld');
        //     let liDomValue = liDom.innerText.replace(/\s/g,"");
        //     if (leavesParams.indexOf(liDomValue) < 0) {
        //       liDom.classList.add("goodsDisabeld");
        //     }
        //   }
        // })

        console.log(allGoodsData);

        // // 获取未选中的规格分类及下标
        // filterData.forEach((v, i) => {
        //   if (!v.standardDetailName) {
        //     noChioce.push(allType[i]);
        //     noChioceIndex.push(i);
        //   }
        // });

        // // 判断选中规格下商品中是否存在未选中规格的商品，并获取
        // noChioce.forEach(nv => {
        //   nv.listCommodityStanDard.forEach(nlv => {
        //     allGoodsData.forEach(av => {
        //       allType.forEach((tv, ti) => {
        //         let filterKey = `standardDetail${ti + 1}Name`;
        //         if (nlv.standardDetailName === av[filterKey]) {
        //           if (hasGoods.indexOf(nlv.standardDetailName) < 0) hasGoods.push(nlv.standardDetailName.replace(/\s/g,""));
        //         }
        //       }) 
        //     })
        //   })
        // })

        // 获取所有未选中规格的dom
        // let goodsParmasDom = this.$refs.goodsParmas;
        // let noGoodsParmasDom = [];
        // noChioceIndex.forEach(ncv => {
        //   noGoodsParmasDom = noGoodsParmasDom.concat(goodsParmasDom[ncv]);
        // });

        // // 给没有商品的规格属性添加样式
        // noGoodsParmasDom.forEach(ngv => {
        //   for (let i = 0; i < ngv.children.length; i ++) {
        //     let liDom = ngv.children[i];
        //     let liDomValue = liDom.innerText.replace(/\s/g,"");
        //     if (hasGoods.indexOf(liDomValue) > -1) {
        //     } else {
        //       liDom.classList.add("goodsDisabeld");
        //     }
        //   }
        // })

        if (allGoodsData.length == 0) {
          this.$toast('该商品已售完，请重新选择');
          return;
        }
        this.popupGoodsData = allGoodsData[0];
      }
    },

    '$route' (to, from){
      this.id = this.$route.params.id;
      this.fetchData();
    }
  }
}
</script>

<style>
  /* .goodsBanner > .mint-swipe img{
    width: 100%;
  } */
</style>
