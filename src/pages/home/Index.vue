<template>
  <div id="container">
      <div id="main">
          <div class="topInfo">
              <h1>
                <!-- <img src="../../assets/index/img_logo.png" alt=""> -->
                <img :src="corpLogo" alt="">
              </h1>
              <div class="myPoints">
                  <P>我的积分</P>
                  <span v-if="homePage.point == 0">{{homePage.point}}</span>
                  <span v-if="homePage.point != 0">{{homePage.point | NumberFormat}}</span>
              </div>
              <div class="service"><a href="javascript:;" onclick="globalMobileIcon.openMobileInnerChat();" target="_blank"><img src="../../assets/index/img_service.png" alt=""></a></div>
          </div>
          <div class="mainWrap">
              <div class="topSlider">
                  <div class="sliderList">
                    <mt-swipe :auto="4000">
                      <mt-swipe-item v-for="(swiper, idx) in homePage.listBanner" :key="idx">
                        <img :src="swiper.imageFileMobile" alt="" @click="goCategory({bannerId: swiper.bannerId})">
                      </mt-swipe-item>
                    </mt-swipe>
                  </div>
              </div>
              <div class="iconSlidereWrap">
                  <div class="iconBg"></div>
                  <div class="search">
                      <input @focus="goSearch" type="text" placeholder="大家都在找年货大礼包!">
                      <div class="topSelect" @click="isGoodsTypeShow = !isGoodsTypeShow">
                        <span>所有</span>
                          <!-- <label>所有</label>
                          <select >
                              <option>所有</option>
                              <option>所有</option>
                          </select> -->
                      </div>
                      <span @click="goSearch" class="searchBtn"><a href="#"><svg><use xlink:href="#search"/></svg></a></span>
                      <div class="searchChoice" v-show="isGoodsTypeShow">
                        <ul>
                          <li @click="goCategory({categoryId: goodsType.categoryId})" v-for="(goodsType, gIdx) in goodsTypes" :key="gIdx">{{goodsType.categoryNameMobile}}</li>
                        </ul>
                      </div>
                  </div>
                  <div class="iconWrap">
                      <div class="iconSlider">
                        <mt-swipe :auto="0" :show-indicators="false" :continuous="false" @change="handleChange">
                          <mt-swipe-item v-for="(tag, tIndex) in tags" :key="tIndex">
                            <ul>
                              <li v-for="(tagContent, tcIndex) in tags[tIndex]" :key="tcIndex">
                                  <a @click="goCategory({tagsId: tagContent.tagId})">
                                      <div class="iconPic">
                                        <img :src="tagContent.tagImageUrl">
                                      </div>
                                      <p>{{tagContent.tagName}}</p>
                                  </a>
                              </li>
                            </ul>
                          </mt-swipe-item>
                        </mt-swipe>
                      </div>
                      <mt-progress ref="progress" :value="tagsColumnInit" :bar-height="5" :style="{left: tagsColumn}">
                      </mt-progress>
                  </div>
              </div>
              <div class="noticeBg">
                <!-- <mt-swipe :auto="0">
                  <mt-swipe-item v-for="bullet in homePage.listNews.slice(0, 1)" :key="bullet.newsId">
                    <div class="notice" >
                      <b>公告</b>{{bullet.newsContent}}<span><router-link :to="{name: 'homeBullet'}">查看详情</router-link></span>
                    </div>
                  </mt-swipe-item>
                </mt-swipe> -->
                <div class="notice">
                    <b>公告</b> <p v-html="bulletNews.sliceContent">{{bulletNews.sliceContent}}</p> <span @click="isNewsShow = true">查看详情</span>
                </div>
                  <div class="flashSale" v-if="homeBanner.length > 0">
                      <div class="flashSaleTitle clearfix">
                          <span>限时抢购</span>
                          <div class="flashSaleTime">
                              <span>距活动结束</span>
                              <down-time :time="homePageRecommendDownTime"></down-time>
                          </div>
                          <b class="flashSaleMore"><a @click="goCategory({searchType: 0})">更多></a></b>
                      </div>
                      <div class="flashSaleGoods clearfix">
                        <div v-for="(banner, bIdx) in homeBanner.slice(0, 3)" :key="bIdx" class="hannerAll">
                          <div v-if="bIdx == 0" @click="goDetail(banner.commodityId)" class="saleGoodsLeft">
                              <img :src="banner.imageName">
                              <p>{{banner.commodityName}}</p>
                              <span>{{banner.discountPrice | NumberFormat}} {{pointUnit}}</span>
                          </div>
                          <div v-if="bIdx != 0" class="saleGoodsRight">
                              <div @click="goDetail(banner.commodityId)" class="saleGoodsrow clearfix">
                                  <div>
                                      <p>{{banner.commodityName}}</p>
                                      <span>{{banner.discountPrice | NumberFormat}} {{pointUnit}}</span>
                                  </div>
                                  <img :src="banner.imageName">
                              </div>
                          </div> 
                        </div>
                          <!-- <div @click="goDetail(bannerOne.commodityId)" class="saleGoodsLeft" v-for="bannerOne in homeBanner.slice(0, 1)" :key="bannerOne.commodityName">
                              <img :src="homeBanner[0].imageName">
                              <p>{{bannerOne.commodityName}}</p>
                              <span>{{bannerOne.discountPrice | NumberFormat}} {{pointUnit}}</span>
                          </div>
                          <div class="saleGoodsRight">
                              <div @click="goDetail(banner.commodityId)" class="saleGoodsrow clearfix" v-for="(banner, bIdx) in homeBanner.slice(1, 3)" :key="bIdx">
                                  <div>
                                      <p>{{banner.commodityName}}</p>
                                      <span>{{banner.discountPrice | NumberFormat}} {{pointUnit}}</span>
                                  </div>
                                  <img :src="banner.imageName">
                              </div>
                          </div> -->
                      </div>
                  </div>
              </div>
          </div>
          <div class="advertisement" v-if="homePageNew.length > 0">
              <a @click="goCategory({searchType: 1})">
                  <img src="https://benefit-dev.oss-cn-shanghai.aliyuncs.com/top/img_new_arrived_sp.jpg">
              </a>
          </div>
          <div class="goodsList">
              <ul class="clearfix">
                  <li v-for="(newGoods, nIndex) in homePageNew.slice(0, 4)" :key="nIndex">
                      <div class="goodsListPic">
                          <a @click.prevent="goDetail(newGoods.commodityId)" href="#">
                              <img :src="newGoods.imageName">
                          </a>
                      </div>
                      <div class="goodsListInfo clearfix">
                          <div class="goodsListWord">
                              <p>{{newGoods.commodityName}}</p>
                              <span>{{newGoods.price | NumberFormat}} {{pointUnit}}</span>
                          </div>
                          <div @click="goDetail(newGoods.commodityId)" class="goodsListBtn">
                              <a>
                                  <svg><use xlink:href="#cart"/></svg>
                              </a>
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
          <div class="advertisement" v-if="homePageRanking.length > 0">
              <a @click="goCategory({searchType: 2})">
                  <img src="https://benefit-dev.oss-cn-shanghai.aliyuncs.com/top/img_hot_sale_sp.jpg">
              </a>
          </div>
          <div class="goodsList goodsListHot">
              <ul class="clearfix hotClearfix">
                  <li v-for="(ranking, raIndex) in homePageRanking.slice(0, 5)" :key="raIndex">
                    <div v-if="raIndex == 0">
                      <div class="goodsExchange clearfix" @click.prevent="goDetail(ranking.commodityId)">
                          <div class="exchangePic">
                              <a>
                                  <img :src="ranking.imageName">
                              </a>
                          </div>
                          <div class="exchangeWord">
                              <span>{{ranking.commodityDescriptionMobile}}</span>
                              <p>{{ranking.commodityName}}</p>
                              <div class="exchangeBtn">
                                  <a>
                                      <img src="../../assets/index/img_btn_hot.png">
                                  </a>
                              </div>
                          </div>
                      </div>
                    </div>

                    <div v-if="raIndex !=0">
                      <div class="goodsListPic">
                          <a @click.prevent="goDetail(ranking.commodityId)" href="#">
                              <img :src="ranking.imageName">
                          </a>
                      </div>
                      <div class="goodsListInfo clearfix">
                          <div class="goodsListWord">
                              <p>{{ranking.commodityName}}</p>
                              <span>{{ranking.price | NumberFormat}} {{pointUnit}}</span>
                          </div>
                          <div @click="goDetail(ranking.commodityId)" class="goodsListBtn">
                              <a>
                                  <svg><use xlink:href="#cart"/></svg>
                              </a>
                          </div>
                      </div>
                    </div>
                      
                  </li>
              </ul>
          </div>
          <div class="goodsLike">
              <p v-if="homePageRecommend.length > 0" class="likeTitle">猜你喜欢</p>
              <div class="goodsLikeList">
                  <ul class="clearfix">
                      <li v-for="(recommend, rIndex) in homePageRecommend" :key="rIndex">
                          <div class="likeGoodsPic">
                              <a @click.prevent="goDetail(recommend.commodityId)" href="#">
                                  <img :src="recommend.imageName">
                              </a>
                          </div>
                          <p>{{recommend.price | NumberFormat}}{{pointUnit}}</p>
                      </li>
                  </ul>
              </div>
              <div class="footerWord">
                  <i></i>
                  <span>我也是有底线的</span>
                  <i></i>
              </div>
          </div>
      </div>
        <div class="orderLayerWrap" v-if="!loading">
            <div class="orderLayer06">
                <p>稍等片刻</p>
                <span>正在努力加载中...</span>
                <div class="loader">
                    <div class="loader-inner line-spin-fade-loader">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
            </div>
        </div>
        <mt-popup class="mtPopupNoBg mtPopupMaxHe"
          v-model="isNewsShow"
          popup-transition="popup-fade">
            <div class="orderLayerWrap" >
              <div class="orderLayer05">
                  <div class="layerNoticeWrap">
                      <img src="../../assets/index/img_layer.png" alt="">
                      <div class="layerNoticeBox">
                          <p class="layerNotice">网站公告</p>
                          <p v-html="bulletNews.newsContent" class="layerNoticeWord">{{bulletNews.newsContent}}</p>
                      </div>
                  </div>
                  <i @click="isNewsShow = false" class="layerClose"><svg><use xlink:href="#close"/></svg></i>
                  <button @click="goByBullet(bulletNews.redirectUrl)" v-if="bulletNews.redirectUrl" class="layerBtn">点我抢购</button>
              </div>
          </div>
        </mt-popup>
      <footer-self active="homeIndex"></footer-self>
  </div>
</template>

<script>
import FooterSelf from '@/components/Footer';
import downTime from '@/components/DownTime';
export default {
  data() {
    return {
      loading: false,
      homePage: {},
      tags: [],
      tagsColumn: 50,
      tagsColumnInit: 50,
      bulletNews: {},
      homePageRecommend: [],
      homePageRecommendDownTime: 0,
      timer: '',
      homePageRanking: [],
      homePageNew: [],
      homeBanner: [],
      goodsTypes: [],
      addCartItem: {
        skuId: '',
        purchasingNum: 1
      },
      isNewsShow: false,
      isGoodsTypeShow: false,
      sliderListImgH: 0,
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      corpLogo: this.$store.state.userInfo.corpLogoMobile
    }
  },

  components: {
    FooterSelf,
    downTime
  },

  methods: {
    fetchHomePageData() {
      this.Api.get('userHomePage')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.homePage = res.data.data;
        this.bulletNews = res.data.data.listNews[0];
        if (this.bulletNews.newsContent.length > 42) {
          this.bulletNews.sliceContent = `${this.bulletNews.newsContent.slice(0, 42)}...`;
        } else {
          this.bulletNews.sliceContent = this.bulletNews.newsContent;
        }
        this.tagsDArray();
      })
    },

    fetchHomeRecommendData() {
      this.Api.get('userHomePageRecommend')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.homePageRecommend = data.list;
      })
    },

    fetchHomeRankingData() {
      this.Api.get('userHomePageRanking')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.homePageRanking = data.list;
      })
    },

    fetchHomeNewData() {
      this.Api.get('userHomePageNew')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.homePageNew = data.list;
      })
    },

    fetchHomeBannerData() {
      this.Api.get('userHomePageCampaign')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.homeBanner = data.list;
        if (data.list.length > 0) this.homePageRecommendDownTime = data.list[0].campaignEndDatetime;
      })
    },

    fetchGoodsTypeData() {
      this.Api.get('category', {
        parentCategoryId: ''
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.goodsTypes = data;
      })
    }, 

    goCategory({tagsId, bannerId, searchType, categoryId}) {
      let query = {};
      if (tagsId) query.tagsId = tagsId;
      if (bannerId) query.bannerId = bannerId;
      if (searchType) query.searchType = searchType;
      if (categoryId) query.categoryId = categoryId;
      this.$router.push({
        name: 'categoryList',
        query: query
      })
    },

    goDetail(id) {
      this.$router.push({
        name: 'goodsDetail',
        params: {id: id}
      })
    },

    addInCart(good) {
      this.addCartItem.skuId = good.skuId;
      this.purchasingNum = 1;
      this.addCartItem.uid = good.commodityId;
      this.Api.post('userCartUid', this.addCartItem)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$toast(res.data.message);
      })
    },

    tagsDArray() {
      let tagsDArrayData = this.homePage.listTags;
      let num = 5;
      this.tagsColumnInit = 100/(Math.ceil(tagsDArrayData.length/num));
      this.tagsColumn = this.tagsColumnInit * 1;
      let Arr = new Array(Math.ceil(tagsDArrayData.length/num));
      for(var i = 0; i < Arr.length; i ++){
        Arr[i] = new Array();
        for(var j = 0; j < num; j ++){
          Arr[i][j] = '';
        }
      }
      for(var i = 0; i < tagsDArrayData.length;i ++){
        Arr[parseInt(i/num)][i%num] = tagsDArrayData[i]; 
      } 
      this.tags = Arr;
    },

    handleChange(index) {
      let progressDom = this.$refs.progress.$el.children[0].lastChild;
      progressDom.style.left = this.tagsColumnInit * index + '%';
    },

    getSliderHeight() {
      let screenWidth = window.innerWidth;
      let contentWrap = screenWidth - 36;
      let sliderListHeight = contentWrap*370/680;
      let sliderDom = document.getElementsByClassName('sliderList')[0];
      sliderDom.style.height = sliderListHeight + 'px'
    },

    goByBullet(url) {
      window.location.href = url;
    },

    goSearch() {
      this.$router.push({
        name: 'categorySearch'
      })
    }
  },

  created() {
    this.fetchHomePageData();
    this.fetchHomeRecommendData();
    this.fetchHomeRankingData();
    this.fetchHomeNewData();
    this.fetchHomeBannerData();
    this.fetchGoodsTypeData();
  },

  mounted() {
    this.loading = true;
    this.getSliderHeight();
  },

  destroyed() {
    clearInterval(this.timer);
  }
}
</script>

<style>
/* .sliderList > .mint-swipe {
  height: 160px;
}
  
.sliderList .mint-swipe-items-wrap > div > img {
    width: 100%;
    display: block;
}
.sliderList .mint-swipe-indicators {
    top: 35px;
    right: 6px;
    bottom: auto;
    left: auto;
}
.sliderList .mint-swipe-indicator {
    display: block;
    width: 6px;
    height: 6px;
    margin: 3px 0;
} */
/* .iconWrap > .mt-progress {
    width: 42px;
    margin: 0 auto;
    border-radius: 20px;
}
.iconWrap .mt-progress-progress {
    background-color: #d12238;
    border-radius: 20px;
}
.iconWrap .mt-progress-runway {
    background-color: #d8d8d8;
    border-radius: 20px;
} */
/* .noticeBg > .mint-swipe {
  height: 41px;
}
.noticeBg .mint-swipe-indicators {
  display: none;
} */
/* .goodsLike > .goodsLikeList {
  overflow-x: auto;
} */
</style>