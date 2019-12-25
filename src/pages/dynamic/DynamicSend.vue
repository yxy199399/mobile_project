<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>发送动态信息</h1>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <div class="dynamicItem dynamicItem01">
              <div class="dynamicHeadBox dynamicHeadBox01 clearfix">
                  <div @click="choosePerson" class="dynamicHead dynamicHead03">
                      <div :style="{backgroundImage: `url(${sendObject.userPhoto})`}">
                          <!-- <img v-if="sendObject.userPhoto" :src="sendObject.userPhoto"> -->
                      </div>
                      <p>
                          <span v-if="sendObject.userName">{{sendObject.userName}}</span>
                          <b v-if="sendObject.mobile">{{sendObject.mobile}}</b>
                          <b v-if="!sendObject.userId">选择发布人</b>
                      </p>
                  </div>
              </div>
              <div class="dcAward dcAward01">
                  <div @click="doMedal" class="messageIcon badgeWrap">
                      <i :style="{'-webkitTextFillColor': selectIcon.bgColor}" :class="selectIcon.bgShape" class="badgeBg"></i>
                      <i ref="selectShape" :class="selectIcon.shape" class="badgeCon"></i>
                  </div>
                  <p @click="addMedal" class="messageTitle">我想给{{sendObject.userName ? sendObject.userName : '朋友'}}一个勋章</p>
                  <p class="messageWord">点击<span class="badgeWrap"><i :style="{'webkitTextFillColor': selectIcon.bgColor}" :class="selectIcon.bgShape" class="fa badgeBg"></i><i :class="selectIcon.shape" class="badgeCon"></i></span>可定制勋章</p>
              </div>
              <div class="dcDialog dcDialog01">
                  <div class="dcIcon clearfix">
                      <!-- <div class="dcDialogImg wordOpen">
                        <select v-model="item.publishRange">
                          <option value="0">公开</option>
                          <option value="1">群组</option>
                          <option value="2">个人</option>
                        </select>
                      </div> -->
                      <div @click="choicePublishRange(0)" class="dcDialogImg wordOpen" :class="{wordOn: item.publishRange == 0}">公开</div>
                      <div @click="choicePublishRange(2)" class="dcLikeImg wordPrivately" :class="{wordOn: item.publishRange == 2}">悄悄话</div>
                      <div class="dcDeleteImg expression" @click="isEmoji = !isEmoji">
                          <svg @click="sendBadgeIcon">
                              <use xlink:href="#expression"/>
                          </svg>
                      </div>
                  </div>
                  <div class="dcDialogSpace">
                      <div class="dcDialogBox dcDialogBox01">
                        <div class="emojiContainer" v-if="isEmoji">
                          <ul>
                            <li @click="insertText(eIdx)" class="emoji" v-for="(emoji, eIdx) in EMOJI" :key="eIdx">{{emoji}}</li>
                          </ul>
                        </div>
                        <textarea rows="1" @click="getText($event)" v-model="item.sendMessage" placeholder="我想对Ta说..."></textarea>
                      </div>
                  </div>
              </div>
          </div>
          <div class="sendPoints">
              <p class="sendPointsTitle">送Ta积分</p>
              <ul class="clearfix">
                  <li @click="seletPoint(10)" :class="{sendPointOn: item.pointNum == 10}">
                      <p>10</p>
                      <span>{{pointUnit}}</span>
                  </li>
                  <li @click="seletPoint(25)" :class="{sendPointOn: item.pointNum == 25}">
                      <p>25</p>
                      <span>{{pointUnit}}</span>
                  </li>
                  <li @click="seletPoint(50)" :class="{sendPointOn: item.pointNum == 50}">
                      <p>50</p>
                      <span>{{pointUnit}}</span>
                  </li>
                  <li @click="seletPoint(100)" :class="{sendPointOn: item.pointNum == 100}">
                      <p>100</p>
                      <span>{{pointUnit}}</span>
                  </li>
                  <li @click="seletPoint(500)" :class="{sendPointOn: item.pointNum == 500}">
                      <p>500</p>
                      <span>{{pointUnit}}</span>
                  </li>
                  <li @click="promptPoint" class="sendNum" :class="{sendPointOn: item.pointNum === 0}">
                      <input @blur="proptValid" maxlength="8" v-model="pointSelf" type="text" placeholder="自定义">
                      <span>{{pointUnit}}</span>
                  </li>
              </ul>
          </div>
          <div class="footerSpace footerSpace04"></div>
          <div ref="btnWrap" class="btnWrap">
              <button @click="dynamicSub" class="btnTemplate btnNew">发布</button>
          </div>
          
          <mt-popup class="mtPopupNoBg"
            v-model="medalShow"
            popup-transition="popup-fade">
              <div class="orderLayerWrap">
              <div class="orderLayer05">
                  <img src="../../assets/dynamic/img_choice_space.png" alt="">
                  <div @click="medalCancel" class="choiceBadge choiceBadge01 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="fa fa-times badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-leadership;#fd6b07;fa fa-circle')" class="choiceBadge choiceBadge02 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-leadership badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-smile;#7bcfb5;fa fa-circle')" class="choiceBadge choiceBadge03 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-smile badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-idea;#fe6b07;fa fa-circle')" class="choiceBadge choiceBadge04 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-idea badgeCon"></i>
                  </div>
                  <div @click="medalSure('fa fa-star;#fcc354;fa fa-circle')" class="choiceBadge choiceBadge05 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="fa fa-star  badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-speed;#f88461; fa fa-circle')" class="choiceBadge choiceBadge06 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-speed badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-passion;#3bc870;fa fa-circle')" class="choiceBadge choiceBadge07 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-passion badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-powerful;#44a0dd;fa fa-circle')" class="choiceBadge choiceBadge08 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-powerful badgeCon"></i>
                  </div>
                  <div @click="medalSure('bo bo-hero;#9b57b5;fa fa-circle')" class="choiceBadge choiceBadge09 badgeWrap">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="bo bo-hero badgeCon"></i>
                  </div>
                  <p class="messageTips">点击按钮选择勋章</p>
              </div>
            </div>
          </mt-popup>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    let query = this.$route.query;
    return {
      query: query,
      sendObject: {},
      medalMessage: {},
      vuexMessage: {},
      pointSelf: null,
      medalShow: false,
      item: {
        userId: 0,				
        publishRange: 0,				
        pointNum: '',				
        sendMessage: '',				
        badgeIcon: ''
      },
      selectIcon: {
        bgShape: 'fa fa-circle',
        bgColor: '#c79f79',
        shape: 'fa fa-bars'
      },
      EMOJI: [
        '😀', '😁', '😂', '😅', '😆', '😉', '😊', '😋',
        '😎', '😍', '😘', '🙂', '😚', '🤗', '🤔', '😐', '😶', 
        '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', 
        '😴', '😌', '😛', '😜', '😺', '🔥', '💪', '🐻', '⚽', 
        '👌', '😿', '😾', '🤓', '😈'
      ],
      isEmoji: false,
      pointUnit: this.$store.state.userInfo.pointSuffixName,
      len:0
    }
  },

  methods: {
    ...mapMutations({
      dynamicMessage: 'DYNAMIC_MEASSGE'
    }),

    choosePerson() {
      this.$router.push({
        name: 'dynamicObject'
      })
    },

    sendBadgeIcon() {

    },

    addMedal() {
      this.medalShow = true;
    },

    medalCancel() {
      this.medalShow = false;
    },

    medalSure(badgeIcon) {
      this.vuexMessage.messageBadgeIcon = badgeIcon;
      this.dynamicMessage(this.vuexMessage);
      this.medalShow = false;
      this.selectIconShow();
    },

    doMedal() {
      this.$router.push({
        name: 'dynamicMedal'
      })
    },
    
    seletPoint(point) {
      this.pointSelf = null;
      if (this.item.pointNum == point) return;
      this.item.pointNum = point;
    },

    promptPoint() {
      this.item.pointNum = 0;
    },

    choicePublishRange(type) {
      this.item.publishRange = type;
    },

    dynamicSub() {
      if (!this.vuexMessage.messageObject) {
        this.$toast('请选择发布对象');
        return;
      }

      this.item.badgeIcon = this.vuexMessage.messageBadgeIcon;
      if (this.pointSelf) this.item.pointNum = this.pointSelf;

      if (!this.item.sendMessage && !this.item.badgeIcon && !this.item.pointNum) {
        this.$toast('请选择或输入发布内容');
        return;
      }
      this.item.userId = this.vuexMessage.messageObject.userId;
      this.item.sendMessage = this.Utils.utf16toEntities(this.item.sendMessage);
      this.Api.post('dynamic', this.item)
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.$router.push({
          name: 'dynamicList'
        })
      })
    },

    getSession() {
      // let sessionMessage = {};
      // if (this.Session.get('sendDynamicMessage')) sessionMessage = JSON.parse(this.Session.get('sendDynamicMessage'));
      // let sessionMessageArr = Object.keys(sessionMessage);
      // let queryMessage = this.query;
      // let queryMessageArr = Object.keys(queryMessage);
      // if (sessionMessageArr.length == 0) {
      //   if (queryMessageArr.length == 0) return;
      // };
      // if (sessionMessage.userId) this.sendObject = sessionMessage;
      // if (sessionMessage.badge) this.medalMessage = sessionMessage;
      // if (queryMessage.userId) this.sendObject = queryMessage;
      // if (queryMessage.badge) this.medalMessage = queryMessage;
      // if (this.medalMessage.badge) this.item.badgeIcon = this.medalMessage.badge;
      this.selectIconShow();
    },

    proptValid() {
      if (isNaN(this.pointSelf)) {
        this.$toast('请输入正确的积分数量');
        this.pointSelf = '';
        return;
      }
      else if (this.pointSelf < 1) {
        // this.$toast('赠送积分必须是大于0的数');
        this.pointSelf = '';
        return;
      }
    },

    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      let setHeight = clientHeight - htmlHeight;
      if (setHeight > 0) this.$refs['btnWrap'].style.marginTop = setHeight  + 'px';
    },

    insertText(emoji) {
      let msgArr = this.item.sendMessage.split('');
      let len = this.item.sendMessage.length;
      msgArr.splice(len-this.len, 0, this.EMOJI[emoji]);
      this.item.sendMessage = msgArr.join('');
    },

    getText(e) {
      let startLength = e.target.selectionStart;
      let len = this.item.sendMessage.length;
      this.len = len - startLength
    },

    selectIconShow() {
      if (this.vuexMessage.messageBadgeIcon) {
        let showIcon = this.vuexMessage.messageBadgeIcon;
        let showIconArr = showIcon.split(";");
        this.selectIcon.shape = showIconArr[0];
        this.selectIcon.bgColor = showIconArr[1];
        this.selectIcon.bgShape = showIconArr[2];
      }
      
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    // this.getSession();
  },

  mounted() {

    this.vuexMessage = this.$store.state.dynamicMsg;
    if (this.vuexMessage.messageObject) this.sendObject = this.vuexMessage.messageObject;
    this.setHeight();
    this.selectIconShow();
  },

  beforeRouteLeave (to, from, next) {
    if (to.name === 'dynamicMedal' || to.name === 'dynamicObject') {
      next()
      return;
    }
    let dynamicMsg = {};
    this.dynamicMessage(dynamicMsg)
    next();
  }
}
</script>

<style>
  /* .fa-bars{
    font-size: 54%;
    top: 20%;
  } */
</style>
