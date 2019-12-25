<template>
	<div class="dataTable">
		<table>
			<thead>
				<tr>
					<th v-for="model in models">{{model.label}}</th>
					<th class="actionColumn notSort">{{Strings.Common.ACTION}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(data, idx) in datas">
					<td v-for="model in models">
						<p v-if="model.prop">{{data[model.prop]}}</p>
					</td>
					<td class="actionColumn">
						<el-button v-if="!data.hideEditAction" type="primary" size="mini" plain @click="doEditAction(idx)">{{Strings.Buttons.EDIT}}</el-button>
						<el-button v-if="data.showDetailAction" type="primary" size="mini" plain @click="doDetailAction(idx)">{{Strings.Buttons.DETAIL}}</el-button>
						<el-button v-if="!data.hideDelAction" size="mini" type="danger" plain @click="doDelAction(idx)">{{Strings.Buttons.DELETE}}</el-button>

						<el-button
							size="mini"
							v-for="(btn, bIdx) in data.extActions"
							:plain="btn.plain || false"
							:type="btn.type || 'primary'"
							:key="bIdx"
							@click="doExtAction(idx, bIdx)">
								{{btn.text}}
						</el-button>
					</td>
				</tr>
			</tbody>

			<tfoot v-show="!datas.length">
				<tr>
					<th :colspan="models.length + 1">{{Strings.Common.EMPTY}}</th>
				</tr>
			</tfoot>
		</table>

		<div class="pageBar">
			<el-pagination
				background
				layout="prev, pager, next"
				:current-page="this.meta.currentPage"
				:total="this.meta.totalNum"
				:page-size="pageSize"
				@current-change="handleCurrentChange" 
				>
			</el-pagination>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			pageSize: 10,
		}
	},

	/**
		* 参数说明
		data.hideEditAction:  隐藏编辑按钮
		data.hideDelAction:   隐藏删除按钮
		data.showDetailAction 显示详细按钮
	*/
	props: {
		models: Array,
		datas: Array,
		meta: Object
	},

	methods: {
		//编辑
		doEditAction(idx) {
			this.$emit('edit-action', idx);
		},

		//详细 
		doDetailAction(idx) {
			this.$emit('detail-action', idx);
		},

		//删除
		doDelAction(idx) {
			this.$emit('del-action', idx);
		},

		//扩展
		doExtAction(idx, bIdx) {
			this.$emit('ext-action', idx, bIdx);
		},

		//分页
		handleCurrentChange(page) {
			this.$emit('page-change', page);
		}
	}
}
</script>