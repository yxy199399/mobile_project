<template>
  <div id="container">
    <div class="gHeader">
        <div class="back" @click="doBack"></div>
        <h1>我的收货地址</h1>
    </div>
    <div id="main">
        <div class="addressBg"></div>
        <div class="addressWrap">
          <ul>
              <li v-for="(address, idx) in datas" :key="idx" @click="goOrder(address.addressId)">
                <div class="addressItem" >
                    <p class="addressTitle">{{address.addressName}}</p>
                    <div class="addressWord">
                        <div class="addressRow">
                            <span>手机号：</span>
                            <p>{{address.mobile}}</p>
                        </div>
                        <div class="addressRow">
                            <span>收货地址：</span>
                            <p>{{address.provinceName}}{{address.cityName}}{{address.countyName}}{{address.townName}}{{address.address}}</p>
                        </div>
                    </div>
                    <div class="addressOperation clearfix">
                        <div  @click.stop="addressDefualt(address.addressId)" class="operationLeft">
                            <!-- <input ref="defaultAddress" id="defaultAddress" name="defaultAddress" type="radio" checked="address.defaultFlg"> -->
                            <input name="defaultAddress" type="radio" :checked="!address.defaultFlg">
                            <label for="defaultAddress">默认地址<i class="centerChoice centerChoice02"><svg><use xlink:href="#choice"/></svg></i></label>
                        </div>
                        <div class="operationRight">
                            <button class="addressEdit" @click.stop="editAddress(address.addressId)">编辑</button>
                            <button class="addressDelete" @click="delAddress(address.addressId)">删除</button>
                        </div>
                    </div>
                </div>
              </li>
          </ul>
          
        </div>
        <div class="btnWrapFix">
          <button class="btnTemplate btnNew" @click="editAddress(0)">新增地址</button>
        </div>
    </div>
    
</div>
</template>

<script>
import { MessageBox  } from 'mint-ui';
export default {
	data() {
		return {
      datas: [],
      routerFrom: ''
		}
	},

	created(){
		this.fetchData();
	},

	methods: {
		fetchData() {
			this.Api.get('userAddress')
			.then(res => {
				if (res.data.code) {
					  this.$toast(res.data.errors.message);
					  return;
					}
        this.datas = res.data.data;
			})
		},

    editAddress(id) {
      if (this.routerFrom === 'orderComfirm') {
        let newFilter = 'orderComfirm'
        this.Session.set('orderComfirmAddress', newFilter);
      }
      this.$router.push({
        name: 'addressEdit',
        params: {
          id: id
        }
      });
    },

    delAddress(id) {
      MessageBox.confirm('确定删除该地址?' , '删除确认').then(action => {
        this.Api.delete('userAddress', {
          uid: id
        })
        .then(res => {
          if (res.data.code) {
            this.$toast(res.data.errors.message);
            return;
          }
          this.fetchData();
        })
      })
      .catch(action => {
        return;
      });
    },

    addressDefualt(id) {
      this.Api.put('userAddressDefaultUid', {
        uid: id,
      })
      .then(res => {
        if (res.data.code) {
          this.$toast(res.data.errors.message);
          return;
        }
        if (this.routerFrom === 'orderComfirm') {
          this.$router.back(-1)
        } else {
          this.fetchData();
        }
      })
    },

    goOrder(id) {
      if (this.routerFrom === 'orderComfirm') {
        this.addressDefualt(id);
      }
    },

    doBack() {
      if (this.routerFrom === 'orderComfirm') {
        this.$router.back(-1)
      } else {
        this.$router.push({
          name: 'userCenter'
        })
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.routerFrom = from.name;
    })
  }

}
</script>