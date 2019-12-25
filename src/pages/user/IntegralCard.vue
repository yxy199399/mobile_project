<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>积分卡券</h1>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <div v-if="userMessage.expireCardNum > 0" class="centerNews integralNews">
              <img src="../../assets/common/icon_news.png" alt="">
              <span>你的账户内有{{userMessage.expireCardNum}}张积分卡将过期</span>
          </div>
          <div class="integralNum">
              <b>剩余积分卡券</b>
              <p>{{userMessage.cardNum}}<i>张</i></p>
              <span><router-link :to="{name: 'integral'}">查看我的积分></router-link></span>
          </div>
          <ul class="integralTab clearfix">
              <li @click="isCanUse(1)" :class="{integralTabOn: cartStatus == 1}">有效可用</li>
              <li @click="isCanUse(2)" :class="{integralTabOn: cartStatus == 2}">已使用/失效</li>
          </ul>
          <ul class="cardList clearfix" :class="{cardPast: cartStatus == 2}">
              <li class="cardListOn" v-for="(card, index) in cardList" :key="index">
                  <div class="cardListItem">
                      <div class="cardTitle clearfix">
                          <div class="cardLogo" :class="{imgMask: cartStatus == 2}">
                            <img :src="card.iconImgUrl">
                          </div>
                          <div class="cardMess">
                              <div class="cardName">
                                  <p>{{card.pointCardName}}</p>
                              </div>
                              <div class="cardVal clearfix">
                                  <p class="cardTotal">面值:<span>{{card.issuePoint | NumberFormat}}{{pointUnit}}</span></p>
                                  <p class="cardDate">{{card.usedEndDate | Date}}到期</p>
                              </div>
                          </div>
                      </div>
                      <div class="cardBox">
                          <div class="cardBalance clearfix">
                              <p v-if="card.remainderPoint > 0" class="cardBalanceNum">余额<span><i>{{card.remainderPoint | NumberFormat}}</i>{{pointUnit}}</span></p>
                              <p v-if="card.remainderPoint == 0" class="cardBalanceNum">余额<span><i>{{card.remainderPoint}}</i>{{pointUnit}}</span></p>
                              <p v-if="cartStatus == 1" class="toUse"><router-link :to="{name: 'homeIndex'}">去使用></router-link></p>
                              <p v-if="cartStatus == 2" class="toUse">{{card.remainderPoint > 0 ? '已过期' : '已使用'}}</p>
                          </div>
                          <div class="cardUse">
                              <p>使用说明：{{card.pointCardDescription}}</p>
                          </div>
                          <div class="cardrecord" @click="getRecord(card)">
                              <a @click.prevent="card.isShowRecord = !card.isShowRecord">
                                使用记录
                              <img v-if="cartStatus == 1" src="../../assets/center/img_arrow_record01.png">
                              <img v-if="cartStatus == 2" src="../../assets/center/img_arrow_record02.png">
                            </a>
                          </div>
                      </div>
                  </div>
                  <div class="cardListDetails" v-if="card.isShowRecord">
                      <ul>
                        <li v-if="card.useRecord.length == 0">暂无记录</li>
                        <li v-for="(record, rIndex) in card.useRecord" :key="rIndex"><span>{{record.usedDate | Date}}</span><p>-{{record.usedPoint}}<b>{{pointUnit}}</b></p></li>
                      </ul>
                  </div>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartStatus: 1,
      IFUSE: ['有效可用', '已使用/失效'],
      cardList: [],
      userMessage: {},
      isUseCardLength: 0,
      pointUnit: this.$store.state.userInfo.pointSuffixName
    }
  },

  methods: {
    fetchData() {
      this.Api.get('userPointMyCard', {
        cartStatus: this.cartStatus,
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        res.data.data.map(item => {
          item.isShowRecord = false;
          item.useRecord = [];
        });
        this.cardList = res.data.data;
        this.isUseCardLength = res.data.data.length;
      })
    },

    isCanUse(type) {
      if (type == this.cartStatus) {
        return;
      }
      this.cartStatus = type;
      this.fetchData();
    },

    getRecord(card) {
      if (card.useRecord.length > 0) {
        return;
      }
      this.Api.get('userUsedHistoryPointCardUid', {
        uid: card.userPointId
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        card.useRecord = res.data.data;
      })
    },

    fetchAllPointCard() {
     this.Api.get('userMyPage')
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        this.userMessage = res.data.data;
      })
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  created() {
    this.fetchData();
    this.fetchAllPointCard();
  }
}
</script>