<template>
  <div id="container">
      <div class="gHeader">
          <div @click="doBack" class="back"></div>
          <h1>物流查询</h1>
      </div>
      <div id="main">
          <div class="addressBg"></div>
          <div class="addressWrap">
              <div class="addressItem" v-for="(shippingNum, oIdx) in shippingData" :key="oIdx">
                <p class="addressTitle">快递公司名称: {{shippingNum.deliveryName}}</p>
                <p class="addressTitle">快递单号: {{shippingNum.expressNumber}}</p>
                <ul class="centerList01 centerList03 centerList05">
                    <li class="clearfix" v-for="(shipping, idx) in shippingNum.logisticInfo" :key="idx">
                        <div class="orderText01 shippingList">
                          <span>{{shipping.msgTime}}</span> 
                          <p>{{shipping.content}}</p>               
                        </div>
                    </li>
                </ul>  
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    const id = this.$route.params.id;
    return {
      id: id,
      shippingData: []
    }
  },

  methods: {
    fetchData() {
      this.Api.get('myOrderLogistics', {
        uid: this.id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        let data = res.data.data;
        this.shippingData = data;
      })
    },

    doBack() {
      this.$router.back(-1);
    }
  },

  created() {
    this.fetchData();
  }
}
</script>