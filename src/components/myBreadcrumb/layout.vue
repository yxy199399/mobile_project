<template>
	<div class="pagePath">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/menu' }">{{Strings.Common.HOME}}</el-breadcrumb-item>
		  <el-breadcrumb-item v-for="(list, idx) in pagePath" :key="idx" :to="list.to">{{list.text}}</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>
<script>
export default {
	data() {
		return {
			
		}
	},

	props: {
		pagePath: Array
	}
}
</script>