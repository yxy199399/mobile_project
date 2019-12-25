<template>
<div id="container">
    <div class="gHeader">
        <div class="back" @click="doBack"></div>
        <h1>我的积分</h1>
        <!-- <div class="standard">颁发标准</div> -->
    </div>
    <div id="main">
        <div v-if="userMessage.expirePoint > 0" class="centerNews integralNews">
            <img src="../../assets/common/icon_news.png" alt="">
            <span>你的账户内有{{userMessage.expirePoint}}{{pointUnit}}将过期</span>
        </div>
        <div class="integralNum">
            <b>可用积分</b>
            <p>{{userMessage.remainderPoint | NumberFormat}}</p>
            <span> <router-link :to="{name: 'integralCard'}">查看积分卡券></router-link></span>
        </div>
        <ul class="integralTab clearfix">
            <li @click="showGet" :class="{integralTabOn: !integralMessage.isUse}">获得积分</li>
            <li @click="showUse" :class="{integralTabOn: integralMessage.isUse}">使用积分</li>
        </ul>
        <!-- <div v-if="integralMessage.isUse">
          <ul class="integralGenre clearfix">
              <li @click="pointUsed(0)" :class="{genreOn: integralMessage.usedType == 0}">全部</li>
              <li @click="pointUsed(1)" :class="{genreOn: integralMessage.usedType == 1}">订购取消</li>
              <li @click="pointUsed(2)" :class="{genreOn: integralMessage.usedType == 2}">赠送</li>
          </ul>
          <ul class="integralList" 
            v-infinite-scroll="getLoadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <li class="clearfix" v-for="(integral, idx) in datas" :key='idx'>
                  <div>
                      <p>{{integral.usedType}}</p>
                      <b>发行日： {{integral.usedDatetime | DateTime}}</b>
                  </div>
                  <span>-{{integral.usedPoint | NumberFormat}}</span>
              </li>
          </ul>
        </div> -->
        <div>
            <ul class="integralGenre clearfix" v-if="!integralMessage.isUse">
                <li @click="pointGet(0)" :class="{genreOn: integralMessage.getType == 0}">全部</li>
                <li @click="pointGet(1)" :class="{genreOn: integralMessage.getType == 1}">颁发</li>
                <li @click="pointGet(2)" :class="{genreOn: integralMessage.getType == 2}">赠送</li>
                <li @click="pointGet(3)" :class="{genreOn: integralMessage.getType == 3}">退回</li>
            </ul>
            <ul class="integralList"
            :class="{integralList02: !integralMessage.isUse}"
              v-infinite-scroll="getLoadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="10">
                <li class="clearfix" v-for="integral in datas" :key='integral.userPointId'>
                    <div>
                        <p>{{integralMessage.isUse ? '' : integral.issueTitle}}<i>{{integralMessage.isUse ? integral.usedType : integral.issueType}}</i></p>
                        <b v-if="integralMessage.isUse">发行日： {{integral.usedDatetime | DateTime}}</b>
                        <b v-if="!integralMessage.isUse">发行日： {{integral.issueDatetime | Date}} / 有效期： {{integral.usedEndDate | Date}}</b>
                    </div>
                    <span v-if="!integralMessage.isUse">+{{integral.issuePoint | NumberFormat}}</span>
                    <span v-if="integralMessage.isUse">-{{integral.usedPoint | NumberFormat}}</span>
                </li>
              </ul>
          </div>
    </div>
</div>
</template>

<script>
export default {
  data() {
    const query = this.$route.query;
    return {
      query: query,
      datas: [],
      integralMessage: {
        isUse: false,
        getType: 0,
        usedType: 0,
      },
      getPageMessage: {},
      userMessage: {},
      loading: true,
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      ISSUETYPE: ['全部', '颁发', '赠送', '退回'],
      // USEDTYPE: ['全部', '订购消费', '赠送']
      USEDTYPE: ['订购消费', '赠送好友']
    }
  },

  methods: {
    fetchData() {
      if (!this.integralMessage.isUse) {
        this.Api.get('userPoint', {
          issueType: this.integralMessage.getType,
          currentPage: this.getPageMessage.currentPage,
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          let data = res.data.data;
          data.list.map(res => {
            res.issueType = this.ISSUETYPE[res.issueType]
          })
          this.datas = this.datas.concat(data.list);
          this.getPageMessage = data.meta;
          // this.pointGet(this.integralMessage.getType);
          this.loading = false;
        })
      } else {
        this.Api.get('userUsedHistory', {
          usedType: this.integralMessage.usedType,
          currentPage: this.getPageMessage.currentPage,

        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          let data = res.data.data;
          data.list.map(res => {
            res.usedType = this.USEDTYPE[res.usedType];
          })
          this.datas = this.datas.concat(data.list);
          this.getPageMessage = data.meta;
          // this.pointUsed(this.integralMessage.usedType);
          this.loading = false;
          this.query.type = null;
        })
      }
    },

    fetchAllPoint() {
     this.Api.get('userMyPage')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.userMessage = res.data.data;
      })
    },

    showGet() {
      if (this.integralMessage.isUse === true) {
        this.getPageMessage.currentPage = 1;
        this.datas = [];
        this.integralMessage.isUse = false;
        this.fetchData();
      }
    },

    pointGet(type) {
      if (type == this.integralMessage.getType) return;
      this.getPageMessage.currentPage = 1;
      this.datas = [];
      this.integralMessage.getType = type;
      this.fetchData();
    },

    showUse() {
      if (this.integralMessage.isUse === false) {
        this.datas = [];
        this.getPageMessage.currentPage = 1;
        this.integralMessage.isUse = true;
        this.fetchData();
      }
      return;
    },

    pointUsed(type) {
      if (type == this.integralMessage.usedType) return;
      this.getPageMessage.currentPage = 1;
      this.datas = [];
      this.integralMessage.usedType = type;
      this.fetchData();
    },

    getLoadMore() {
      this.loading = true;
      if (this.getPageMessage.currentPage < this.getPageMessage.totalPage) {
        ++ this.getPageMessage.currentPage;
        this.fetchData();
      }
    },

    doBack() {
      this.$router.back(-1);
    }
  },

  created(){
    if (this.query.type === 'issueType') {
      this.integralMessage.isUse = false;
    } else if (this.query.type === 'usedType') {
      this.integralMessage.isUse = true;
    }
    if (this.Utils.getFilter('integralMessage')) this.integralMessage = this.Utils.getFilter('integralMessage');
    this.fetchData();
    this.fetchAllPoint();
  },

  beforeRouteLeave (to, from, next) {
    if (to.name === 'integralCard') {
      let newFilter = JSON.parse(JSON.stringify(this.integralMessage));
      this.Utils.setFilter('integralMessage', newFilter);
    } else {
      this.Utils.removeAllFilter();
    }

    next();
  }
}
</script>