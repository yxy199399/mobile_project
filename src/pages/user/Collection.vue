<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>我的收藏</h1>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <div class="collection">
              <div v-if="!collections.length" class="noData">------您还没有收藏商品------</div>
              <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <li @click="goGoodsDetail(collection.commodityId)" v-for="(collection, idx) in collections" :key="idx">
                  <mt-cell-swipe
                    title=''
                    :right="[
                      {
                        content: '<span>删除</span>',
                        handler: () => {
                          delFavorite(collection.id)
                        }
                      }
                    ]">
                      <div ref='cellSwipe' class="collectionBox">
                          <div class="collectionPic">
                              <a href="#">
                                  <img :src="collection.imageName" alt="">
                              </a>
                          </div>
                          <div class="collectionWord">
                              <p class="collectionTitle">{{collection.commodityName}}</p>
                              <div class="collectionLabel"><b>{{collection.deliveryType}}</b></div>
                              <p class="collectionPrice">{{collection.price}} {{pointUnit}}</p>
                              <div @click.stop="goGoodsDetail(collection.commodityId)" class="collectionCart goodsListBtn">
                                  <a href="#"><svg><use xlink:href="#cart"/></svg></a>
                              </div>
                          </div>
                      </div>
                    </mt-cell-swipe>
                </li>      
              </ul>
          </div>
      </div>
    
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
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
      DELIVERYTYPE: ['自营', 'JD']
    }
  },

  methods: {
    fetchData() {
      this.Api.get('userFavorite', {
        currentPage: this.pages.currentPage,
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        data.list.map(item => {
          item.deliveryType = this.DELIVERYTYPE[item.deliveryType];
        })
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
      let id = comment.commodityId;
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

    delFavorite(id) {
      MessageBox.confirm('确定删除该商品?' , '删除确认').then(action => {
        this.Api.delete('userFavoriteUid', {
          uid: id
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          this.collections = [];
          this.pages.currentPage = 1;
          this.fetchData();
        })
      })
      .catch(action => {
        return;
      });
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
