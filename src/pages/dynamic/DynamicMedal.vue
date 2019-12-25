<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1  @click="moveNext">定制勋章</h1>
      </div>
      <div id="main">
          <div ref="medalContainer" class="medal" @touchstart="moveStart($event)" @touchend.prevent="moveEnd($event)" @touchmove.prevent="touchmoveStop($event)">
              <img src="../../assets/dynamic/img_medal_pic.png">
              <ul ref="medalIcon" class="medalIcon">
                <li :data-title="icon.name" v-for="(icon, iIndex) in iconList" :key="iIndex" class="iconMedal" :style="{color: icon.color}">
                  <i class="fa fa-circle badgeBg"></i>
                  <i :class="icon.shape" class="badgeCon"></i>
                </li>
              </ul>
              <div class="medalMask01"></div>
              <div class="medalMask02"></div>
              <div class="iconsSwitch">
                  <b @touchstart="movePrev" class="switchPrev"><a><svg><use xlink:href="#iconSwitch"/></svg></a></b>
                  <span>{{medalName}}</span>
                  <b @touchstart="moveNext" class="switchNext"><a><svg><use xlink:href="#iconSwitch"/></svg></a></b>
              </div>
          </div>
          <div class="iconInfoChoice iconInfoChoice01">
              <p>选择颜色</p>
              <ul class="clearfix">
                  <li v-for="(color, cIndex) in colorArr" :key="cIndex" @click="selectColor(color)" :class="{medalOn: bgColor === color}">
                      <i class="fa fa-circle badgeBg"></i>
                      <i class="fa fa-check badgeCon"></i>
                  </li>
              </ul>
          </div>
          <div class="iconInfoChoice iconInfoChoice02">
              <p>选择形状</p>
              <ul class="clearfix">
                  <li v-for="(shape, sIndex) in shapeArr" :key="sIndex" @click="selectBgShape(sIndex)" :class="{medalOn: bgShape === shape}">
                      <i class="badgeBg" :class="shape"></i>
                      <i class="fa fa-check badgeCon"></i>
                  </li>
              </ul>
          </div>
          <div ref="btnWrap" class="btnWrap">
              <button @click="doSure" class="btnTemplate btnNew">确定</button>
          </div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      iconList: [
        {
          shape: 'bo bo-passion',
          color: '#fd6b07',
          name: "Engagement"
        },
        {
          shape: 'bo bo-speed',
          color: '#7bcfb5',
          name: "Speed"
        },
        {
          shape: 'bo bo-problemsolver',
          color: '#9b57b5',
          name: "Problem Solver"
        },
        {
          shape: 'bo bo-leadership',
          color: '#44a0dd',
          name: "Leadership"
        },
        {
          shape: 'bo bo-idea',
          color: '#3bc870',
          name: "Idea"
        },
        {
          shape: 'bo bo-powerful',
          color: '#fcc354',
          name: "Powerful"
        },
        {
          shape: 'fa fa-star',
          color: '#f88461',
          name: 'Golden Star'
        },
        {
          shape: 'bo bo-enthusiast',
          color: '#fd6b07',
          name: "Enthusiast"
        },
        {
          shape: 'bo bo-ambassador',
          color: '#7bcfb5',
          name: 'Ambassador'
        },
        {
          shape: 'bo bo-efficient',
          color: '#9b57b5',
          name: 'Efficient'
        },
        {
          shape: 'bo bo-competitoncrusher',
          color: '#44a0dd',
          name: 'Competitoncrusher'
        },
        {
          shape: 'bo bo-creativity',
          color: '#3bc870',
          name: 'Creativity'
        },
        {
          shape: 'bo bo-dedicated',
          color: '#fcc354',
          name: 'Dedicated'
        },
        {
          shape: 'bo bo-empowerment',
          color: '#fd6b07',
          name: 'Empowerment'
        },
        {
          shape: 'bo bo-hero',
          color: '#f88461',
          name: 'Hero'
        },
        {
          shape: 'bo bo-holiday',
          color: '#fd6b07',
          name: 'Holiday'
        },
        {
          shape: 'bo bo-hotshot',
          color: '#9b57b5',
          name: 'Hotshot'
        },
        {
          shape: 'bo bo-organized',
          color: '#44a0dd',
          name: 'Organized'
        },
        {
          shape: 'bo bo-inspiration',
          color: '#3bc870',
          name: 'Inspiration'
        },
        {
          shape: 'bo bo-onfire',
          color: '#fd6b07',
          name: 'Onfire'
        },
        {
          shape: 'bo bo-peacemaker',
          color: '#f88461',
          name: 'Peacemaker'
        },
        {
          shape: 'bo bo-pioneer',
          color: '#fcc354',
          name: 'Pioneer'
        },
        {
          shape: 'bo bo-punctual',
          color: '#3bc870',
          name: 'Punctual'
        },
        {
          shape: 'bo bo-responsive',
          color: '#44a0dd',
          name: 'Responsive'
        },
        {
          shape: 'bo bo-rockstar',
          color: '#9b57b5',
          name: 'Rockstar'
        },
        {
          shape: 'bo bo-smile',
          color: '#9b57b5',
          name: 'Smile'
        },
        {
          shape: 'bo bo-teamplayer',
          color: '#7bcfb5',
          name: 'Teamplayer'
        }
      ],
      vuexMessage: {},
      colorRandom: 0,
      colorArr: ['#fd6b07', '#7bcfb5', '#9b57b5', '#44a0dd', '#3bc870', '#fcc354', '#f88461'],
      shapeArr: ['fa fa-circle', 'fa fa-square', 'fa fa-star', 'fa fa-certificate'],
      bgColor: '#fcc354',
      bgShape: 'fa fa-certificate',
      internalShape: '',
      badge: '',
      medalName: '',
      isTouch: false,
      touchDirection: {
        startX: 0
      }
    }
  },

  methods: {
    ...mapMutations({
      dynamicMessage: 'DYNAMIC_MEASSGE'
    }),

    selectBgShape(index) {
      this.bgShape = this.shapeArr[index];
      let medalDom = this.$refs.medalIcon;
      let selectedChild = medalDom.children[3];
      let shape = selectedChild.children[0].attributes.class.nodeValue;
      let shapeArr = shape.split(' ');
      shapeArr[1] = this.bgShape;
      selectedChild.children[0].attributes.class.nodeValue = `${shapeArr[1]} ${shapeArr[2]}`;
    },

    selectColor(color) {
      this.bgColor = color;
      let medalDom = this.$refs.medalIcon;
      let selectedChild = medalDom.children[3];
      selectedChild.children[0].style.color = color;
    },

    movePrev() {
      let medalDom = this.$refs.medalIcon;
      let medalDomChild = medalDom.children;
      let firstChild = medalDomChild[0];
      let firstChildClone = firstChild.cloneNode(true);
      firstChild.remove();
      medalDom.appendChild(firstChildClone);
      this.modifiMedal();
    },

    moveNext() {
      let medalDom = this.$refs.medalIcon;
      let medalDomChild = medalDom.children;
      let lastChild = medalDomChild[medalDomChild.length - 1];
      let lastChildClone = lastChild.cloneNode(true);
      lastChild.remove();
      medalDom.prepend(lastChildClone);
      this.modifiMedal();
    },

    moveStart(e) {
      if(this.isTouch) return;
      this.isTouch = true;
      this.touchDirection.startX = e.targetTouches[0].pageX;
    },

    moveEnd(e) {
      let endX = e.changedTouches[0].pageX;
      if ((endX -10) > this.touchDirection.startX) {
        this.moveNext();
      } else if (endX < (this.touchDirection.startX - 10)) {
        this.movePrev();
      }
      this.isTouch = false;
    },

    touchmoveStop(e) {
      // console.log(e);
    },

    modifiMedal() {
      let medalDom = this.$refs.medalIcon;
      // let length = medalDom.children.length;
      // let middleNum = this.getMiddle(length);
      let selectedChild = medalDom.children[3];
      let getColorDom = selectedChild.children[0];
      let getShapeDom = selectedChild.children[0];
      let css = {};
      if (window.getComputedStyle) {
        css = window.getComputedStyle(getColorDom, null)
      } else {
        css = getColorDom.currentstyle;
      }

      if (css.color.indexOf('#') > -1) {
        this.bgColor = css.color;
      } else {
        let color = css.color;
        let rgb = color.split(',');
        let r = parseInt(rgb[0].split('(')[1]);
        let g = parseInt(rgb[1]);
        let b = parseInt(rgb[2].split(')')[0]);
        let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        this.bgColor = hex;
      }

      let shape = getShapeDom.attributes.class.nodeValue;
      let shapeDomArr = shape.split(' ');
      this.bgShape = `${shapeDomArr[0]} ${shapeDomArr[1]}`;
      this.getSelectMedalName();
    },

    doSure() {
      let medalDom = this.$refs.medalIcon;
      let selectedChild = medalDom.children[3];
      let getShapeDom = selectedChild.children[1];
      let internalClass = getShapeDom.attributes.class.nodeValue;
      let classArr = internalClass.split(' ');
      this.internalShape = `${classArr[1]} ${classArr[2]}`;
      this.badge = `${this.internalShape};${this.bgColor};${this.bgShape}`;
      // this.badge = encodeURI(this.badge);
      this.vuexMessage.messageBadgeIcon = this.badge;
      this.dynamicMessage(this.vuexMessage);
      this.$router.push({
        name: 'dynamicSend'
      })
    },

    // getMiddle(num) {
    //   let minNum = 0; 
    //   if (num % 2 == 0) {
    //     minNum = num / 2 - 1;
    //   } else {
    //     minNum = (num - 1) / 2;
    //   }
    //   return minNum;
    // },

    getColorRandom () {
      let colorLength = this.colorArr.length;
      this.colorRandom =  Math.ceil(Math.random()*6);
    },

    getSelectMedalName() {
      let medalDom = this.$refs.medalIcon;
      this.medalName = medalDom.children[3].attributes['data-title'].nodeValue;
    },

    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      let setHeight = clientHeight - htmlHeight;
      let btnWrapDom = this.$refs['btnWrap'];
      if (setHeight > 0) {
        btnWrapDom.attributes.class.value = 'btnWrapFix';
      } else {
        btnWrapDom.attributes.class.value = 'btnWrap';
      }
    },

    doBack() {
      this.$router.back(-1)
    }
  },

  mounted() {
    this.setHeight();
    this.vuexMessage = this.$store.state.dynamicMsg;
    this.modifiMedal();
    this.getSelectMedalName();

    window.onresize = () => {
      return(() => {
        this.setHeight();
      })()
    }
  },

   destroyed() {
     window.onresize = null;
   }
}
</script>