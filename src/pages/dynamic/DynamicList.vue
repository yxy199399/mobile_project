<template>
  <div id="container">
      <div id="main">
          <div class="addressBg"></div>
          <ul class="integralTab dynamicTab clearfix">
              <li @click="changeType(3)" :class="{integralTabOn: dynamicType == 3}">全部</li>
              <li @click="changeType(2)" :class="{integralTabOn: dynamicType == 2}">公告</li>
              <li @click="changeType(0)" :class="{integralTabOn: dynamicType == 0}">互动</li>
              <li @click="changeType(1)" :class="{integralTabOn: dynamicType == 1}">积分</li>
          </ul>
          <div v-if="!listDatas.length" class="noData">------您还没有动态消息------</div>
          <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <li v-for="(dynamic, idx) in listDatas" :key="idx">
                <div class="dynamicItem" v-if="dynamic.dynamicType != 2">
                  <div class="dynamicHeadBox clearfix">
                      <div class="dynamicHead">
                          <div :style="{backgroundImage: 'url(' + dynamic.fromUserPhoto + ')'}"></div>
                          <p>{{dynamic.fromUserName}}</p>
                      </div>
                      <div class="dynamicSend"><svg><use xlink:href="#send"/></svg></div>
                      <div class="dynamicHead dynamicHead02">
                          <div :style="{backgroundImage: 'url(' + dynamic.toUserPhoto + ')'}"></div>
                          <p>{{dynamic.toUserName}}</p>
                      </div>
                  </div>
                  <div class="dcAward">
                      <div class="dcAwardTime clearfix">
                          <p>{{dynamic.issueTitle}}</p>
                          <span>{{dynamic.openDate | Date}}</span>
                      </div>
                      <p class="dcAwardWord" v-if="dynamic.sendMessage != 'null'">{{dynamic.sendMessage}}</p>
                      <ul class="dcPartData clearfix">
                          <li v-if="dynamic.pointNum" class="dcPoints"><div><p>{{dynamic.pointNum | NumberFormat}}</p><span>{{pointUnit}}</span></div></li>
                          <li class="dcFriend" v-if="dynamic.badgeIcon">
                            <i class="badgeBg" :class="dynamic.badgeIcon.bgShape" :style="{color: dynamic.badgeIcon.bgColor}"></i>
                            <i class="badgeCon" :class="dynamic.badgeIcon.shape"></i>
                          </li>
                      </ul>
                  </div>
                  <div class="dcDialog">
                      <div class="dcIcon clearfix">
                          <div class="dcDialogImg">
                              <svg @click="commentDynamic(dynamic.dynamicId)">
                                  <use xlink:href="#dialog"/>
                              </svg>
                          </div>
                          <div class="dcLikeImg" :class="{on: dynamic.coolFlag}">
                              <svg @click="giveLike(idx)" class="like01">
                                  <use xlink:href="#like_01"/>
                              </svg>
                              <svg class="like02">
                                  <use xlink:href="#like_02"/>
                              </svg>
                              <span v-if="dynamic.coolNum > 0" :style="{color: dynamic.coolFlag ? '#ff556a' : ''}">{{dynamic.coolNum}}</span>
                          </div>
                          <div class="dcDeleteImg" @click="delDynamic(idx)" v-if="dynamic.dynamicType == 0 && dynamic.fromUserId == userInfo.userId">
                              <svg>
                                  <use xlink:href="#delete"/>
                              </svg>
                          </div>
                      </div>
                      <div class="dcDialogSpace">
                      <div class="dcDialogBox">
                          <p v-if="dynamic.listCoolName.length > 0">
                              <svg class="like01">
                                  <use xlink:href="#like_01"/>
                              </svg>
                              <span v-for="(cool, cIdx) in dynamic.listCoolName" :key="cIdx">{{cool}}<i v-if="dynamic.listCoolName.length - 1 > cIdx">, </i></span>
                          </p>
                          <div :class="{shrink: !dynamic.isShowAll}" class="dcDialogWord" v-if="dynamic.listDynamicCommentInfo.length > 0">
                              <div v-for="(comment, cmIdx) in dynamic.isShowAll ? dynamic.listDynamicCommentInfo : dynamic.commebtData" :key="cmIdx">
                                  <p @click="delComment(comment)">
                                    <span>{{comment.userName}}</span>
                                    {{comment.commentContent}}
                                  </p>
                              </div>
                              <i @click="showAllComment(dynamic)" v-if="!dynamic.isShowAll">展开</i>
                          </div>
                      </div>
                  </div>
                  </div>
              </div>

              <div class="dynamicItemBg" v-if="dynamic.dynamicType == 2">
                  <div class="dcNotice dynamicItem">
                      <div class="dcAward">
                          <div class="dcAwardTime clearfix">
                              <p>{{dynamic.articleType}}</p>
                              <span>{{dynamic.openDate | DateTime}}</span>
                          </div>
                          <div class="dcAwardWord">
                              <p>{{dynamic.articleTitle}}</p>
                              <a @click="getBullteDetil(dynamic)">查看详情</a>
                          </div>
                      </div>
                      <div class="dcBanner"><img :src="dynamic.articleImage"></div>
                  </div>
              </div>
            </li>
          </ul>
          <div class="footerSpace"></div>
          <button @click="goSend()" class="btnRelease" v-if="dynamicType == 0"></button>
      </div>

      <mt-popup v-model="isShowprompt" position="bottom">
        <div class="dynamicComment">
          <input maxlength="200" type="text" v-model="comment" placeholder="请输入评论内容">
          <button class="sendCommentBtn" @click="sendComment">发送</button>
        </div>
      </mt-popup>

      <mt-popup class="mtPopupNoBg" v-model="delCommentData.isShowComment" position="bottom">
        <div class="orderLayerWrap">
              <div class="orderLayer04">
                  <button @click="delCommentSure" class="dynamicBtn">删除</button>
                  <button @click="delCommentCancel" class="dynamicBtn dynamicBtn01">取消</button>
              </div>
          </div>
      </mt-popup>

      <mt-popup class="mtPopupMaxHe" v-model="isShowBullet" position="bottom">
        <i @click="isShowBullet = false" class="noticeClose"><svg><use xlink:href="#close"/></svg></i>
        <div id="main">
          <div class="addressBg"></div>
          <div class="noticeHide"></div>
          <div class="noticeWrap">
              <div class="noticeTitle">
                  <span>{{bulletDetil.articleType}}</span>
                  <div>
                      <p>发布时间</p>
                      <p>{{bulletDetil.openDate | DateTime}}</p>
                  </div>
              </div>
              <div class="noticePicWrap">
                  <div class="noticePic"><img :src="bulletDetil.articleImage"></div>
              </div>
              <div class="noticeWord">
                  <h2>{{bulletDetil.articleTitle}}</h2>
                  <p v-html="bulletDetil.articleContent">{{bulletDetil.articleContent}}</p>
              </div>
          </div>
        </div>
      </mt-popup>

      <footer-self active="dynamicList"></footer-self>
  </div>
</template>

<script>
import FooterSelf from '@/components/Footer';
import { MessageBox  } from 'mint-ui';
export default {
  data() {
    return {
      dynamicType: 3,
      listDatas: [],
      // commebtData: [],
      userInfo: this.$store.state.userInfo,
      pages: {
        currentPage: 1
      },
      loading: false,
      isShowAll: false,
      isShowprompt: false,
      isShowBullet: false,
      delCommentData: {
        isShowComment: false,
        commentId: 0,
      },
      bulletDetil: {},
      comment: '',
      commentId: '',
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      ARTICLETYPE: ['公告', '文章', '众筹']
    }
  },

  components: {
    FooterSelf
  },

  methods: {
    fetchData() {
      this.Api.get('dynamic', {
        dynamicType: this.dynamicType,
        currentPage: this.pages.currentPage
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        data.list.map(item => {
          item.sendMessage = this.Utils.entitiestoUtf16(item.sendMessage);
          item.articleType = this.ARTICLETYPE[item.articleType];
          // item.sendMessage = null;
          let comments = item.listDynamicCommentInfo;
          if (comments.length > 2) {
            item.isShowAll = false;
            item.commebtData = comments.slice(0, 2);
            item.commebtData[1].commentContent += '...';
          } else {
            item.isShowAll = true;
          }

          if (!item.badgeIcon || item.badgeIcon.indexOf(';') < 0) return;
          if (item.badgeIcon) {
            let badgeIconArr = item.badgeIcon.split(';');
            let shape = badgeIconArr[0];
            let bgColor = badgeIconArr[1];
            let bgShape = badgeIconArr[2];
            item.badgeIcon = {};
            item.badgeIcon['bgShape'] = bgShape;
            item.badgeIcon['bgColor'] = bgColor;
            item.badgeIcon['shape'] = shape;
          }
          

          // if (badgeIconArr[0].indexOf('fa') > -1) bgShape = `fa ${badgeIconArr[0]}`;
          // if (badgeIconArr[0].indexOf('bo') > -1) bgShape = `bo ${badgeIconArr[0]}`;
          // if (badgeIconArr[2].indexOf('fa') > -1) shape = `fa ${badgeIconArr[2]}`;
          // if (badgeIconArr[2].indexOf('bo') > -1) shape = `bo ${badgeIconArr[2]}`;
        })

        this.listDatas = this.listDatas.concat(data.list);
        this.pages = data.meta;
        this.loading = false;

      })
    },

    changeType(i) {
      if (this.dynamicType == i) return;
      this.listDatas = [];
      this.pages.currentPage = 1;
      this.dynamicType = i;
      this.fetchData();
    },

    giveLike(i) {
      let data = this.listDatas[i];
      this.Api.put('dynamicCoolUid', {
        uid: data.dynamicId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.listDatas = [];
        this.pages.currentPage = 1;
        this.fetchData();
      })
    },

    delDynamic(i) {
      let data = this.listDatas[i];
      MessageBox.confirm('确定删除该动态?' , '删除确认').then(action => {
         this.Api.delete('dynamicUid', {
          uid: data.dynamicId
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          this.listDatas = [];
          this.pages.currentPage = 1;
          this.fetchData();
        })
      })
      .catch(action => {
        return;
      });
    },

    delComment(comment) {
      if (this.userInfo.userId !== comment.userId) return;
      this.delCommentData.isShowComment = true;
      this.delCommentData.commentId = comment.dynamicCommentId;
    },

    delCommentCancel() {
      this.delCommentData.isShowComment = false;
    },

    delCommentSure() {
      if (!this.delCommentData.commentId) {
        this.$toast('请选择要删除的评论');
        return;
      };
      this.Api.delete('dynamicDeleteUid', {
        uid: this.delCommentData.commentId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.delCommentData.isShowComment = false;
        this.listDatas = [];
        this.pages.currentPage = 1;
        this.fetchData();
      })
    
    },

    loadMore() {
      this.loading = true;
      if (this.pages.totalPage > this.pages.currentPage) {
        ++ this.pages.currentPage;
        this.fetchData();
      }
    },

    commentDynamic(id) {
      this.isShowprompt = true;
      this.commentId = id;
    },

    sendComment() {
      if (!this.comment) {
        this.$toast('请输入评论内容');
        return;
      }
      this.Api.put('dynamicUid', {
        uid: this.commentId,
        commentContent: this.comment
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.isShowprompt = false;
        this.listDatas = [];
        this.pages.currentPage = 1;
        this.comment = '';
        this.fetchData();
      })
    },

    goSend() {
      this.$router.push({
        name: 'dynamicSend'
      })
    },

    getBullteDetil(bullet) {
      this.isShowBullet = true;
      this.bulletDetil = bullet;
    },

    showAllComment(dynamic) {
      dynamic.isShowAll = true;
      let sliceComment = dynamic.listDynamicCommentInfo[1].commentContent;
      dynamic.listDynamicCommentInfo[1].commentContent = sliceComment.slice(0, sliceComment.length - 3);
    }
  },

  created() {
    this.fetchData();
  },

  mounted() {
    if (sessionStorage.getItem('dynamicKeepPage') || sessionStorage.getItem('dynamicKeepPage') == 0) this.dynamicType = sessionStorage.getItem('dynamicKeepPage');
  },

  beforeRouteLeave (to, from, next) {
    if (to.name === 'dynamicSend') {
      sessionStorage.setItem('dynamicKeepPage', this.dynamicType)
    } else {
      sessionStorage.removeItem('dynamicKeepPage')
    }

    next()
  }
}
</script>

<style>
  /* .dynamicComment{
    padding: 10px;
  }
  .dynamicComment input {
    padding: 10px;
    width: calc(100% - 110px)
  }
  .dcPartData .dcFriend {
    width: 60px;
    height: 60px;
    position: relative;
    line-height: 60px;
    font-size: 48px;
    border-radius: 0;
    overflow: visible !important;
  }
  .dcPartData .dcFriend i:nth-child(2) {
    font-size: 54%;
    color: #fff;
    position: absolute;
    text-align: center;
    line-height: 2;
  } */

  /* .shrink{
    position: relative;
  }
  .dcDialogWord i {
    position: absolute;
    bottom: 17px;
    right: 16px;
    background: #f6f6f6;
    color: #69a2e5;
    font-size: 12px;
  }
  .dcDialogWord i b {
    color: #a4a4a4;
    margin-right: 5px;
  } */
</style>
