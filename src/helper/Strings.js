/**
 * 文言
 */
const Labels = {
	ORDERSTATUS: ['正常订单', '取消订单'],
	SHIPPINGSTATUS: ['未发货', '发货中', '部分发货', '全部发货完成'],
	PAYSTATUS: ['全部', '未支付', '已支付'],
	DELIVERYTYPE: ['全部','实物','邮件发货','自动发货','无发货'],
	SHIPPINGTYPE: ['可以发货','发货安排中','发货完成'],
	SALESSTATUS: ['全部','销售中','停止中'],
	DISTRIBUTIONTYPE: ['全部','贝那','JD'],
	COMMODITYTYPE: ['全部','实物','邮件服务','系统自动','无配送'],
	PIC: ['图片'],
	COMPANY: ['全部','部分企业'],
	COMPANYLIST:['贝那商务有限公司','贝那商务有限公司','贝那商务有限公司','贝那商务有限公司','贝那商务有限公司','贝那商务有限公司'],
	OPENSTATE: ['全部','公开','非公开'],
	OPENOBJ: ['全部','全部企业','对象企业'],
	TOPFLG:['显示','不显示','全部'],
	NEWTOPFLG:['显示','不显示'],
}

const Common = {
	HOME: '首页',
	SEARCH: '检索',
	CREATE: '新增',
	EDIT: '编辑',
	LIST: '一览',
	ACTION: '操作',
	SUCCESS: '成功',
	FAIL: '失败',
	EMPTY: '暂无数据',
	PLSENTER: '请输入',
	PLSSELECT: '请选择',
	CONFIRM: '确定',
	CANCEL: '取消',
	NOTE: '提示'
}

const Buttons = {
	SEARCH: '检索',
	CREATE: '新增',
	SAVE: '保存',
	BACK: '返回',
	EDIT: '编辑',
	DELETE: '删除'
}

const Pages = {
	DELIVERY: {
		PAGENAME: '快递公司',
		DELIVERYID: 'ID',
		DELIVERYNO: '快递公司编号',
		DELIVERYNAME: '快递公司名称'
	}
}

const Strings = {
  Labels: Labels,
  Buttons: Buttons,
  Common: Common,

  Pages: Pages
}

export default Strings;