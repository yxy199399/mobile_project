<template>
  <div id="container">
    <div class="gHeader">
      <div @click="doBack" class="back"></div>
      <h1>地址管理</h1>
    </div>

    <div class="main">
      <div class="formPage">
        <div class="formPart">
          <p class="headLine01">{{!id ? '新增' : '编辑'}}地址</p>
          <div class="formItem">
            <div class="formRow">
              <div class="formName">
                <p>收货人<i></i></p>
              </div>
              <div class="formFill">
                <input maxlength="20" type="text" v-model="item.addressName" placeholder="请填写收货人姓名">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>手机号码<i></i></p>
              </div>
              <div class="formFill">
                <input maxlength="11" type="tel" v-model="item.mobile" placeholder="请填写收货人手机号码">
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>选择省份<i></i></p>
              </div>
              <div class="formFill">
                <select @change="getCityArr" v-model="item.provinceNo">
                  <option value="0">请选择</option>
                  <option :value="province.provinceNo" v-for="(province, pIdx) in provinceArr" :key="pIdx">{{province.provinceName}}</option>
                </select>
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>选择市<i></i></p>
              </div>
              <div class="formFill">
                <select @change="getCountyArr" v-model="item.cityNo">
                  <option value="0">请选择</option>
                  <option :value="city.cityNo" v-for="(city, cIdx) in cityArr" :key="cIdx">{{city.cityName}}</option>
                </select>
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>选择县区<i></i></p>
              </div>
              <div class="formFill">
                <select @change="getTownArr" v-model="item.countyNo">
                  <option value="0">请选择</option>
                  <option :value="county.countyNo" v-for="(county, coIdx) in countyArr" :key="coIdx">{{county.countyName}}</option>
                </select>
              </div>
            </div>
            <div class="formRow" v-if="townArr.length > 0">
              <div class="formName">
                <p>选择镇<i></i></p>
              </div>
              <div class="formFill">
                <select v-model="item.townNo">
                  <option value="0">请选择</option>
                  <option :value="town.townNo" v-for="(town, coIdx) in townArr" :key="coIdx">{{town.townName}}</option>
                </select>
              </div>
            </div>
            <div class="formRow">
              <div class="formName">
                <p>详细地址<i></i></p>
              </div>
              <div class="formFill">
                <textarea v-model="item.address" placeholder="街道、门牌号"></textarea>
              </div>
            </div>
          </div>
          <div class="operationLeft setDefault">
              <input :disabled="isDefaultFlag" v-model="defaultFlg" id="setDefault01" type="checkbox">
              <label for="setDefault01">设为默认地址<i class="centerChoice centerChoice02"><svg><use xlink:href="#choice"/></svg></i></label>
          </div>
        </div>
      </div>
      <div ref="btnWrap" class="btnWrap" >
        <button @click="doSave" class="btnTemplate btnDelete">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const id = this.$route.params.id;
    return {
      id: id,
      item: {
        addressName: '',			
        provinceNo: 0,				
        cityNo: 0,				
        countyNo: 0,				
        townNo: 0,				
        address: '',				
        mobile: '',				
        defaultFlg: 1			
      },
      isDefaultFlag: false,
      provinceArr: [],
      cityArr: [],
      countyArr: [],
      townArr: [],
      defaultFlg: 0,
      docmHeight: document.documentElement.clientHeight,
      showHeight: 0,
      hidshow: true,
      isResize: false,
      addressEditFrom: ''
    }
  },

  methods: {
    fetchData() {
      if (!this.id) {
        return;
      };
      this.Api.get('userAddress', {
        uid: this.id
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
				  return;
        }
        let data = res.data.data;
        this.item = data;
        if (this.item.defaultFlg == 0) {
          this.defaultFlg = 1;
        } else {
          this.defaultFlg = 0;
        }
        let provinceNo = data.provinceNo;
        let cityNo = data.cityNo;
        let countyNo = data.countyNo;
        let townNo = data.townNo;
        this.isDefault();
        this.getCityArr(this ,cityNo, countyNo, townNo);
      })
      
    },

    getProvinceArr() {
      this.Api.get('address', {
        searchType: 1
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
				  return;
        }
        this.provinceArr = res.data.data;
      })
    },

    getCityArr(e, cityNo, countyNo, townNo) {
      this.item.cityNo = 0;
      this.item.countyNo = 0;
      this.item.townNo = 0;
      this.cityArr = [];
      this.countyArr = [];
      this.townArr = [];
      this.Api.get('address', {
        searchType: 2,
        provinceNo: this.item.provinceNo
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
				  return;
        }
        this.cityArr = res.data.data;
        if (cityNo) {
          this.item.cityNo = cityNo;
          this.getCountyArr(this, countyNo, townNo);
        };
      })
    },

    getCountyArr(e, countyNo, townNo) {
      this.item.countyNo = 0;
      this.item.townNo = 0;
      this.countyArr = [];
      this.townArr = [];
      this.Api.get('address', {
        searchType: 3,
        provinceNo: this.item.provinceNo,
        cityNo: this.item.cityNo
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
				  return;
        }
        this.countyArr = res.data.data;
        if (countyNo) {
          this.item.countyNo = countyNo;
          this.getTownArr(this, townNo);
        };
      })
    },

    getTownArr(e, townNo) {
      this.item.townNo = 0;
      this.townArr = [];
      this.Api.get('address', {
        searchType: 4,
        provinceNo: this.item.provinceNo,
        cityNo: this.item.cityNo,
        countyNo: this.item.countyNo
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
				  return;
        }
        this.townArr = res.data.data;
        if (townNo) this.item.townNo = townNo;
      })
    },

    doSave () {
      let msg = '';
      if (!this.item.addressName) {
        msg += '请填写收货人姓名\n';
      }

      if (!this.item.mobile) {
        msg += '请填写收货人手机号\n';
      } else if (!this.Utils.validateMobile(this.item.mobile)){
        msg += '请输入正确的手机号\n'
      }

      if (!this.item.countyNo || (this.townArr.length > 0 && !this.item.townNo)) {
        msg += '请填写收货人所在地区\n';
      }

      if (!this.item.address) {
        msg += '请填写收货人详细地址\n';
      }

      if (msg) {
        this.$toast(msg);
        return;
      }
      this.defaultFlg ? this.item.defaultFlg = 0 : this.item.defaultFlg = 1;
      if (this.addressEditFrom === 'orderComfirm') {
        this.item.defaultFlg = 0;
      }
      if (!this.id) {
        this.Api.post('userAddress', this.item)
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          if (this.addressEditFrom === 'orderComfirm') {
            this.$router.go(-2)
            return;
          }
          this.$router.push({
            name: 'addressList'
          })
        })
      } else {
        this.item.uid = this.id;
        this.Api.put('userAddress', this.item)
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          if (this.addressEditFrom === 'orderComfirm') {
            this.$router.go(-2)
            return;
          }
          this.$router.push({
            name: 'addressList'
          });
        })
      }
    },

    setHeight() {
      let clientHeight = document.documentElement.clientHeight;
      let htmlHeight = document.querySelector('html').offsetHeight;
      let setHeight = clientHeight - htmlHeight;
      if (setHeight > 0) this.$refs['btnWrap'].style.marginTop = setHeight  + 'px';
    },

    isDefault() {
      if (this.id) {
        if (this.item.defaultFlg == 0) {
          this.isDefaultFlag = true;
        } else {
          this.isDefaultFlag = false;
        }
      }
    },

    doBack() {
      this.$router.back(-1);
    }
  },

  created(){
    this.fetchData();
    this.getProvinceArr();
  },
  
  mounted() {
    this.setHeight();
    this.addressEditFrom = this.Session.get('orderComfirmAddress');
  }
}
</script>