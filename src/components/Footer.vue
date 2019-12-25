<template>
  <div class="footer">
  	  <footer class="gFooter">
        <ul class="clearfix">
            <li :class="{footerOn: active === 'homeIndex'}">
                <a @click="doSeletMenu('homeIndex')" href="#">
                    <span class="home">
                        <svg><use xlink:href="#home"/></svg>
                    </span>
                    <p>首页</p>
                </a>
            </li>
            <li :class="{footerOn: active === 'categoryType'}">
                <a @click="doSeletMenu('categoryType')" href="#">
                    <span class="classify">
                        <svg><use xlink:href="#classify"/></svg>
                    </span>
                    <p>分类</p>
                </a>
            </li>
            <li :class="{footerOn: active === 'dynamicList'}">
                <a @click="doSeletMenu('dynamicList')" href="#">
                    <span class="dynamic">
                        <svg><use xlink:href="#dynamic"/></svg>
                    </span>
                    <p>动态</p>
                </a>
            </li>
            <li class="foooterCart" :class="{footerOn: active === 'shoppingCart'}">
                <a @click="doSeletMenu('shoppingCart')" href="#">
                    <span class="cart">
                        <svg><use xlink:href="#cart"/></svg>
                    </span>
                    <p>购物车</p>
                </a>
            </li>
            <li :class="{footerOn: active === 'userCenter'}">
                <a @click="doSeletMenu('userCenter')" href="#">
                    <span class="center">
                       <svg><use xlink:href="#center"/></svg>
                    </span>
                    <p>我的</p>
                </a>
            </li>
        </ul>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    active: String
  },
  
  methods: {
    doSeletMenu(type) {
      this.$router.push({
        name: type
      });
    }
  }
}
</script>