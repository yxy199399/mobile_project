<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>浏览商品</h1>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <div v-if="!collections.length" class="noData">------暂无数据------</div>
          <div class="collection">
              <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <li @click="goGoodsDetail(collection.trackingId)" v-for="(collection, idx) in collections" :key="idx">
                  <div ref='cellSwipe' class="collectionBox">
                      <div class="collectionPic">
                          <a>
                              <img :src="collection.imageName">
                          </a>
                      </div>
                      <div class="collectionWord">
                          <p class="collectionTitle">{{collection.commodityName}}</p>
                          <!-- <div class="collectionLabel"><b>{{collection.deliveryType}}</b></div> -->
                          <p class="collectionPrice">{{collection.price}} {{pointUnit}}</p>
                          <div @click.stop="goGoodsDetail(collection.trackingId)" class="collectionCart goodsListBtn">
                              <a><svg><use xlink:href="#cart"/></svg></a>
                          </div>
                      </div>
                  </div>
                </li>      
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collections: [],
      loading: false,
      pages: {
        currentPage: 1,
        totalPage: 1,
      },
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      // DELIVERYTYPE: ['自营', 'JD']
    }
  },

  methods: {
    fetchData() {
      this.Api.get('trackingBehavior', {
        currentPage: this.pages.currentPage,
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        // data.list.map(item => {
        //   item.deliveryType = this.DELIVERYTYPE[item.deliveryType];
        // })
        this.collections = this.collections.concat(data.list);
        this.pages.currentPage = data.meta.currentPage;
        this.pages.totalPage = data.meta.totalPage;
        this.loading = false;
      })
    },

    loadMore() {
      this.loading = true;
      if (this.pages.totalPage > this.pages.currentPage) {
        ++ this.pages.currentPage;
        this.fetchData();
      }
    },

    addCart(comment) {
      let id = comment.trackingId;
      let skuId = comment.skuId;
      this.Api.post('userCartUid', {
        uid: id,
        purchasingNum: 1,
        skuId: id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$toast(res.data.message);
      })
    },

    goGoodsDetail(id) {
      this.$router.push({
        name: 'goodsDetail',
        params: {id: id}
      })
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    this.fetchData();
  }
}
</script>
