<template>
  <div class="timeOver">
    <span>{{h}}</span><span>{{m}}</span><span>{{s}}</span>
  </div>
</template>

<script>
export default {
  props: ['time'],
  data() {
    return {
      h:'00',
      m:'00',
      s:'00',
    };
  },

  created() {
    this.countTime();
  },

  methods: {
    countTime() {
      //获取当前时间
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      // var endDate = new Date(this.time);
      // var end = endDate.getTime();
      //时间差
      var leftTime = this.time - now;
      //定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        this.h = Math.floor(leftTime / 1000 / 60 / 60);
        this.m = Math.floor((leftTime / 1000 / 60) % 60);
        this.s = Math.floor((leftTime / 1000) % 60);
        if (this.s < 10) {
          this.s = "0" + this.s;
        }
        if (this.m < 10) {
          this.m = "0" + this.m;
        }
      }
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(this.countTime, 1000);
    }
  }
};
</script>
