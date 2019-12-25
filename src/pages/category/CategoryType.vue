<template>
<div id="container">
    <div class="gHeader">
        <div class="browseInput browseInput01"><input @keyup.enter="goBySearch" v-model="searchKey" type="text" placeholder="大家都在找年货大礼包！"></div>
        <div @click="goBySearch" class="browse browse01"><svg><use xlink:href="#search"/></svg></div>
    </div>
    <div id="main">
        <div class="classifyWrap" :class="{classifyCategoryType: !isFooterShow}">
            <div class="classifyNameWrap">
                <ul class="classifyName">
                    <li @click="changeType(index)" :class="{NameOn: index == activeType}" v-for="(typeOne, index) in typeOneData" :key="index"><span>{{typeOne.categoryNameMobile}}</span></li>
                </ul>
            </div>
            <div class="classifyConWrap">
                <div class="classifyCon">
                    <div class="classifyBanner">
                        <img :src="activeImg">
                    </div>
                    <div class="classifyConWord">
                        <p class="classifyConTitle">{{twoTypeTitle}}</p>
                        <ul class="clearfix">
                            <li v-for="(typeTwo, idx) in typeTwoData" :key="idx">
                                <a @click="goCategoryList(idx)" href="#">
                                    <div class="classifyConPic">
                                        <img :src="typeTwo.categoryImage">
                                    </div>
                                    <p>{{typeTwo.categoryNameMobile}}</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer-self v-if="isFooterShow" active="categoryType"></footer-self>
    
</div>
</template>

<script>
import FooterSelf from '@/components/Footer';
export default {
  data() {
    return {
      parentCategoryId: '',
      typeOneData: [],
      typeTwoData: [],
      activeType: 0,
      activeImg: '',
      twoTypeTitle: '',
      searchKey: '',
      isClick: false,
      winHeight: window.innerHeight,
      isFooterShow: true
    }
  },

  components: {
    FooterSelf
  },

  methods: {
    fetchData() {
      this.Api.get('category', {
        parentCategoryId: this.parentCategoryId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        if (this.parentCategoryId) {
          this.typeTwoData = data;
          if (data.length == 0 && this.isClick === true) {
            this.$router.push({
              name: 'categoryList',
              query: {categoryId: this.parentCategoryId}
            })
            // console.log(data);
          }
        } else {
          this.typeOneData = data;
          this.fetchTwoData();
        }
        this.parentCategoryId = this.typeOneData[this.activeType].parentCategoryId;
      })
    },

    fetchTwoData () {
      let parentCategoryId = this.typeOneData[0].categoryId;
      this.Api.get('category', {
        parentCategoryId: parentCategoryId,
        hl: 1
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.typeTwoData = data;
        this.activeImg = this.typeOneData[0].categoryImage;
        this.twoTypeTitle = this.typeOneData[0].categoryNameMobile;
      })
    },

    changeType(i) {
      this.isClick = true;
      if (i === this.activeType) {
        return
      }
      this.activeType = i;
      this.activeImg = this.typeOneData[i].categoryImage;
      this.parentCategoryId = this.typeOneData[i].categoryId;
      this.twoTypeTitle = this.typeOneData[i].categoryNameMobile;
      this.fetchData();
    },

    goCategoryList(i) {
      let typeData = this.typeTwoData[i];
      this.$router.push({
        name: 'categoryList',
        query: {
          categorySubId: typeData.categoryId,
          parentCategoryId: typeData.parentCategoryId
        }
      })
    },
    
    goBySearch() {
      // if (!this.searchKey) {
      //   this.$toast('请输入搜索关键字')
      //   return;
      // };
      this.$router.push({
        name: 'categoryList',
        query: {commoditySearchWords: this.searchKey}
      })
    }
  },

  created() {
    this.fetchData();
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