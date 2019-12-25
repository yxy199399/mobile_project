<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack()" class="back"></div>
          <div class="browseInput"><input maxlength="500" @keyup.enter="doSearch" v-model="changeItem.commoditySearchWords" type="text" placeholder="大家都在找年货大礼包！"></div>
          <div @click="doSearch" class="browse"><svg><use xlink:href="#search"/></svg></div>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <ul class="integralTab browseTab clearfix">
              <li @click="orderTypeFilter(0)" :class="{integralTabOn: changeItem.orderType == 0 && !filterType}">综合<span class="screen"><svg><use xlink:href="#screen"/></svg></span></li>
              <li @click="orderTypeFilter(1)" :class="{integralTabOn: changeItem.orderType == 1 && !filterType}">销量</li>
              <li @click="orderTypeSort(2)" :class="{integralTabOn: changeItem.orderType == 2 && !filterType}">价格
                  <span class="browsePrice">
                      <b :class="{sortOn: changeItem.sort === 'desc'}"><i class="screen screen01"><svg><use xlink:href="#screen"/></svg></i></b>
                      <b :class="{sortOn: changeItem.sort === 'asc'}"><i class="screen"><svg><use xlink:href="#screen"/></svg></i></b> 
                  </span>
              </li>
              <li :class="{integralTabOn: filterType === '筛选'}" @click="doFilter">筛选</li>
          </ul>
          <!-- <div v-if="isGoodsFilter" class="goodsFilter">
                <input maxlength="8" v-model="pointFrom" type="text"> ~
                <input maxlength="8" v-model="pointTo" type="text">
                <button @click="filterSure">确定</button>
          </div> -->
          <ul class="integralGenre clearfix">
              <li @click="isDeliveryType(0)" :class="{genreOn: changeItem.deliveryType == 0}">自营</li>
              <li @click="isDeliveryType(1)" :class="{genreOn: changeItem.deliveryType == 1}">JD</li>
          </ul>
          <div class="goodsList goodsList01">
              <ul class="clearfix" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                  <li @click="goDetail(shopping.commodityId)" v-for="(shopping, index) in shoppingData" :key="index">
                      <div class="goodsListPic">
                          <a>            
                              <img :src="shopping.imageName">
                          </a>
                      </div>
                      <div class="goodsListInfo clearfix">
                          <div class="goodsListWord goodsListWord01">
                              <p>{{shopping.commodityName}}</p>
                              <i>{{shopping.deliveryType}}</i>
                              <span>{{shopping.price | NumberFormat}} {{pointUnit}}</span>
                          </div>
                          <div @click.stop="goDetail(shopping.commodityId)" class="goodsListBtn goodsListBtn01">
                              <a>
                                  <svg><use xlink:href="#cart"/></svg>
                              </a>
                          </div>
                      </div>
                  </li>
              </ul>
              <div class="footerSpace"></div>
          </div>
      </div>
      <footer-self v-if="isFooterShow" active="categoryType"></footer-self>
      <mt-popup class="goodsFilterPopup"
        v-model="isGoodsFilter"
        position="right">
        <div class="containerPopup">
          <h2>筛选</h2>
          <div class="filterModule">
            <p>价格区间（p）</p>
            <div class="priceRange">
              <input maxlength="8" v-model="changeItem.pointFrom" type="text"> ~
              <input maxlength="8" v-model="changeItem.pointTo" type="text">
            </div>
          </div>
          <div class="filterModule">
            <p>全部类目</p>
            <div class="goodsType">
              <ul>
                <li @click="typeSelect(cIdx)" v-for="(cType, cIdx) in categoryTypeObj.typeOneData" :key="cIdx" :class="{typeOn: categoryTypeObj.typeSelected == cIdx}">{{cType.categoryNameMobile}}</li>
              </ul>
            </div>
          </div>
          </div>
          <div class="goodsFilterPopupBtnConainer">
            <button @click="filterSure" class="goodsFilterPopupBtn">确定</button>
          </div>
        
      </mt-popup>
  </div>
</template>

<script>
import FooterSelf from '@/components/Footer';
import { mapMutations } from 'vuex'
export default {
  data() {
    const query = this.$route.query;
    return {
      query: query,
      keepPageState: {},
      shoppingData: [],
      routerFrom: '',
      deliveryType: 0,
      orderType: 0,
      sort: '',
      pointFrom: '',
      pointTo: '',
      isGoodsFilter: false,
      filterType: '',
      commoditySearchWords: '',
      changeItem: {
        commoditySearchWords: '',
        pointFrom:  '',
        pointTo: '',
        deliveryType: '',
        orderType: '',
        sort: '',
        categoryId: '',
        categorySubId: ''
      },
      loading: false,
      pages: {
        currentPage: 1,
        totalPage: 1,
      },
      categoryTypeObj: {
        parentCategoryId: '',
        typeOneData: [],
        typeSelected: null,
        categoryId: '',
      },
      addCartItem: {
        skuId: '',
        purchasingNum: 1
      },
      DELIVERYTYPE: ['自营', 'JD'],
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      winHeight: window.innerHeight,
      isFooterShow: true
    }
  },

  components: {
    FooterSelf
  },

  methods: {
    ...mapMutations({
      setPageState: 'KEEP_PAGE_STATE'
    }),

    fetchData() {
      let filter = {
        currentPage: this.pages.currentPage,
      }
      if (this.query.tagsId) filter.tagsId = this.query.tagsId;
      if (this.query.bannerId) filter.bannerId = this.query.bannerId;
      if (this.query.searchType) filter.searchType = this.query.searchType;
      if (this.query.categoryId) this.categoryId = this.query.categoryId;
      if (this.query.categorySubId) this.categorySubId = this.query.categorySubId;
      if (this.query.pointFrom) this.pointFrom = this.query.pointFrom;
      if (this.query.pointTo) this.pointTo = this.query.pointTo;
      if (this.query.commoditySearchWords) this.commoditySearchWords = this.query.commoditySearchWords;

      // if (this.routerFrom === 'goodsDetail') {
      this.keepPageState = this.$store.state.pageState.categoryList;
      if (this.keepPageState.commoditySearchWords) this.commoditySearchWords = this.keepPageState.commoditySearchWords;
      if (this.keepPageState.pointFrom) this.pointFrom = this.keepPageState.pointFrom;
      if (this.keepPageState.pointTo) this.pointTo = this.keepPageState.pointTo;
      if (this.keepPageState.orderType || this.changeItem.orderType === 0) this.orderType = this.keepPageState.orderType;
      if (this.keepPageState.deliveryType || this.keepPageState.deliveryType === 0) this.deliveryType = this.keepPageState.deliveryType;
      if (this.keepPageState.sort) this.sort = this.keepPageState.sort;
      if (this.keepPageState.categoryId) this.categoryId = this.keepPageState.categoryId;
      if (this.keepPageState.categorySubId) this.categorySubId = this.keepPageState.categorySubId;
      // }

      if (this.changeItem.commoditySearchWords) this.commoditySearchWords = this.changeItem.commoditySearchWords;
      if (this.changeItem.pointFrom) this.pointFrom = this.changeItem.pointFrom;
      if (this.changeItem.pointTo) this.pointTo = this.changeItem.pointTo;
      if (this.changeItem.orderType || this.changeItem.orderType === 0) this.orderType = this.changeItem.orderType;
      if (this.changeItem.deliveryType || this.changeItem.deliveryType === 0) this.deliveryType = this.changeItem.deliveryType;
      if (this.changeItem.sort) this.sort = this.changeItem.sort;
      if (this.changeItem.categoryId) this.categoryId = this.changeItem.categoryId;
      if (this.changeItem.categorySubId) this.categorySubId = this.changeItem.categorySubId;

      // if (this.keepPageState.filterType) this.filterType = this.keepPageState.filterType;
      filter.categoryId = this.categoryId;
      filter.categorySubId = this.categorySubId;
      filter.commoditySearchWords = this.commoditySearchWords;
      filter.orderType = this.orderType;
      filter.deliveryType = this.deliveryType;
      filter.pointFrom = this.pointFrom;
      filter.pointTo = this.pointTo;

      if (filter.orderType == 2) {
        filter.sort = this.sort;
      } else {
        if (filter.sort) delete filter.sort;
      }

      this.Api.get('commodity', filter)
      .then(res => {
       if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        data.list.map(item => item.deliveryType = this.DELIVERYTYPE[item.deliveryType]);
        this.shoppingData = this.shoppingData.concat(data.list);
        this.pages.currentPage = data.meta.currentPage;
        this.pages.totalPage = data.meta.totalPage;
        this.loading = false;
      })
    },

    fetchTypeData() {
      if (this.query.parentCategoryId) {
        this.categoryTypeObj.parentCategoryId = this.query.parentCategoryId;
      }
      this.Api.get('category', {
        parentCategoryId: this.categoryTypeObj.parentCategoryId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.categoryTypeObj.typeOneData = data;
      })
    },

    loadMore() {
      this.loading = true;
      if (this.pages.totalPage > this.pages.currentPage) {
        ++ this.pages.currentPage;
        this.fetchData();
      }
    },

    orderTypeFilter(type) {
      if (type == this.changeItem.orderType && this.filterType !== '筛选') return;
      this.filterType = '';
      this.isGoodsFilter = false;
      this.shoppingData = [];
      this.pages.currentPage = 1;
      this.changeItem.orderType = type;
      this.fetchData();
    },

    orderTypeSort(type) {
      this.filterType = '';
      this.isGoodsFilter = false;
      this.changeItem.orderType = type;
      if (!this.changeItem.sort) {
        this.changeItem.sort = 'desc';
      } else if (this.changeItem.sort === 'desc') {
        this.changeItem.sort = 'asc';
      } else {
        this.changeItem.sort = 'desc';
      }
      this.shoppingData = [];
      this.pages.currentPage = 1;
      this.fetchData();
    },

    doSearch() {
      this.query.commoditySearchWords = null;
      this.shoppingData = [];
      this.pages.currentPage = 1;
      this.fetchData();
    },

    addInCart(idx) {
      let shopingDetail = this.shoppingData[idx];
      this.addCartItem.skuId = shopingDetail.skuId;
      this.purchasingNum = 1;
      this.addCartItem.uid = shopingDetail.commodityId;
      this.Api.post('userCartUid', this.addCartItem)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$toast(res.data.message);
      })

    },

    isDeliveryType(type) {
      if (this.changeItem.deliveryType == type) return;
      this.shoppingData = [];
      this.pages.currentPage = 1;
      this.changeItem.deliveryType = type;
      this.fetchData();
    },

    goDetail(id) {
      this.$router.push({
        name: 'goodsDetail',
        params: {id: id}
      })
    },

    doFilter() {
      this.isGoodsFilter = true;
      this.filterType = '筛选';
    },

    filterSure() {
      // if (this.pointFrom) this.query.pointFrom = this.pointFrom;
      // if (this.pointTo) this.query.pointTo = this.pointTo;
      // if (this.categoryTypeObj.categoryId) this.query.categoryId = this.categoryTypeObj.categoryId;
      this.shoppingData = [];
      this.pages.currentPage = 1;
      this.isGoodsFilter = false;
      this.fetchData();
    },

    typeSelect(i) {
      let selected = this.categoryTypeObj.typeOneData[i];
      this.categoryTypeObj.typeSelected = i;
      if (this.query.parentCategoryId) {
        this.changeItem.categorySubId = selected.categoryId;
      } else {
        this.changeItem.categoryId = selected.categoryId;
      }
      // this.categoryTypeObj.categoryId = selected.categoryId;
    },

    doBack() {
      this.$router.back(-1);
    }
  },

  created() {
    this.fetchData();
    this.fetchTypeData();
  },

  mounted() {
    window.onresize = ()=>{
      return(()=>{
        this.winHeight = window.innerHeight;
      })()
    }
  },

  destroyed() {
    window.onresize = null;
  },

  beforeRouteLeave (to, from, next) {
    let pageState = {
      categoryList: {}
    };
    if (to.name === 'goodsDetail') {
      if(this.query.commoditySearchWords) this.commoditySearchWords = this.query.commoditySearchWords;
      if(this.query.pointFrom) pageState.categoryList.pointFrom = this.query.pointFrom;
      if(this.query.pointTo) pageState.categoryList.pointTo = this.query.pointTo;
      // if(this.sort) pageState.categoryList.sort = this.sort;
      if(this.filterType) pageState.categoryList.filterType = this.filterType;
      if(this.query.categoryId) pageState.categoryList.categoryId = this.query.categoryId;
      if(this.query.categorySubId) pageState.categoryList.categorySubId = this.query.categorySubId;

      if(this.changeItem.commoditySearchWords) this.commoditySearchWords = this.changeItem.commoditySearchWords;
      if(this.changeItem.pointFrom) pageState.categoryList.pointFrom = this.changeItem.pointFrom;
      if(this.changeItem.pointTo) pageState.categoryList.pointTo = this.changeItem.pointTo;
      if(this.changeItem.sort) pageState.categoryList.sort = this.changeItem.sort;
      if(this.changeItem.categoryId) pageState.categoryList.categoryId = this.changeItem.categoryId;
      if(this.changeItem.categorySubId) pageState.categoryList.categorySubId = this.changeItem.categorySubId;
      
      pageState.categoryList.commoditySearchWords = this.commoditySearchWords;
      pageState.categoryList.orderType = this.orderType;
      pageState.categoryList.deliveryType = this.deliveryType;
    }
    this.setPageState(pageState);
    next()
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'goodsDetail' || !from.name) {
        vm.keepPageState = vm.$store.state.pageState.categoryList;
        vm.routerFrom = 'goodsDetail';
        if (vm.keepPageState.commoditySearchWords) vm.changeItem.commoditySearchWords = vm.keepPageState.commoditySearchWords;
        if (vm.keepPageState.pointFrom) vm.changeItem.pointFrom = vm.keepPageState.pointFrom;
        if (vm.keepPageState.pointTo) vm.changeItem.pointTo = vm.keepPageState.pointTo;
        if (vm.keepPageState.orderType) vm.changeItem.orderType = vm.keepPageState.orderType;
        if (vm.keepPageState.deliveryType) vm.changeItem.deliveryType = vm.keepPageState.deliveryType;
        if (vm.keepPageState.sort) vm.changeItem.sort = vm.keepPageState.sort;
        if (vm.keepPageState.filterType) vm.filterType = vm.keepPageState.filterType;
        if (vm.keepPageState.categoryId) vm.changeItem.categoryId = vm.keepPageState.categoryId;
        if (vm.keepPageState.categorySubId) vm.changeItem.categorySubId = vm.keepPageState.categorySubId;
      } else {
        vm.setPageState({categoryList: {}});
      }
    })
  },

  watch: {
    'winHeight': {
      handler(newName, oldName) {
        if (newName < oldName) {
          this.isFooterShow = false;
        } else {
          this.isFooterShow = true;
        }
      }
    }
  }
}
</script>

<style>
  /* .integralTabOn .sortOn .screen svg {
    fill: #9b9b9b;
  } */
</style>
