<template>
  <div id="container">
      <div class="gHeader gHeader01">
          <div class="browseInput browseInput01 browseInput02">
              <input maxlength="500" @keyup.enter="goCategory" v-model="searchKey" type="text" placeholder="大家都在找年货大礼包！">
              <span @click="doBack">取消</span>
              <!-- <svg><use xlink:href="#search"/></svg> -->
          </div>
          <div class="browseSearch"><svg><use xlink:href="#search"/></svg></div>
      </div>
      <div id="main">
          <div class="searchSlider">
            <ul class="clearfix">
                  <li @click="goCategory({tagsId: tag.tagId})" v-for="(tag, idx) in tags" :key="idx">
                      <a>
                          <div class="searchPic"><img :src="tag.tagIcon"></div>
                          <p>{{tag.tagName}}</p>
                      </a>
                  </li>
            </ul>
          </div>
          <div class="searchHistory" v-if="searchHistory.length > 0">
              <div class="searchTitle">
                  <span>历史记录</span>
                  <b><a @click.prevent="removeSession">清除记录</a></b>
              </div>
              <ul class="searchLabel clearfix">
                  <li v-for="(history, idx) in searchHistory" :key="idx" @click="goByHistory(history)"><a>{{history}}</a></li>
              </ul>
          </div>
          <div class="searchHistory">
              <div class="searchTitle">
                  <span>按积分搜索</span>
              </div>
              <ul class="searchLabel searchLabel01 clearfix">
                  <li @click="goByPoint(0, 100)"><a>100{{pointUnit}}以下</a></li>
                  <li @click="goByPoint(100, 200)"><a>100~200{{pointUnit}}</a></li>
                  <li @click="goByPoint(200, 500)"><a>200~500{{pointUnit}}</a></li>
                  <li @click="goByPoint(500, 'all')"><a>500{{pointUnit}}以上</a></li>
                  <li @click="goByPoint()"><a>我可兑换的</a></li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tags: [],
      searchKey: '',
      searchHistory: [],
      myPoint: 0,
      pointUnit: this.$store.state.userInfo.pointSuffixName
    }
  },

  methods: {
    fetchTagsData() {
      this.Api.get('userHomePage')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.tags = res.data.data.listTags;
        this.myPoint = res.data.data.point;
      })
    },

    tagsDArray() {
      let tagsDArrayData = this.tags;
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

    goCategory({tagsId}) {
      let query = {
        commoditySearchWords: this.searchKey
      };
      if (tagsId) query.tagsId = tagsId;
      this.setSession();
      this.$router.push({
        name: 'categoryList',
        query: query
      })
    },

    goByHistory(history) {
      let query = {
        commoditySearchWords: history
      };
      this.setSession();
      this.$router.push({
        name: 'categoryList',
        query: query
      })
    },

    goByPoint(pointFrom, pointTo) {
      if (pointFrom == 0) pointFrom = null;
      if (pointTo == 'all') pointTo = null;
      if (arguments.length == 0) {
        pointFrom = null;
        pointTo = this.myPoint;
      }
      let query = {
        pointFrom: pointFrom,
        pointTo: pointTo
      };
      this.setSession();
      this.$router.push({
        name: 'categoryList',
        query: query
      })
    },

    getSession() {
      let searchHistoryString = this.Session.getS('searchKey');
      if(searchHistoryString) this.searchHistory = searchHistoryString.split(',');
    },

    setSession() {
      if (this.searchKey) {
        if (this.searchHistory.indexOf(this.searchKey) > -1) this.searchHistory.splice(this.searchHistory.indexOf(this.searchKey), 1);
        this.searchHistory.unshift(this.searchKey);
        let saveArr = this.searchHistory.slice(0, 3);
        let saveString = saveArr.toString();
        this.Session.setS('searchKey', saveString)
      }
    },

    removeSession() {
      this.Session.removeS('searchKey');
      this.searchHistory = [];
    },

    doBack() {
      this.$router.back(-1)
    }
  },
  created() {
    this.fetchTagsData();
    this.getSession();
  }
}
</script>