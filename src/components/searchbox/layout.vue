<template>
	<div class="searchArea">
		<div class="title" @click="open = !open" onselectstart ='return false' onselect='document.selection.empty()'><span class="icon"><i :class="{'el-icon-caret-top' : open, 'el-icon-caret-bottom' : !open}"></i></span>{{pageName}}检索<em>(点击{{open ? '收起' : '打开'}})</em></div>
		<div class="searchContent" v-show="open">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			open: false
		}
	},

	props: {
		pageName: String
	}
}
</script>