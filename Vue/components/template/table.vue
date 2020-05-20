<erp-table
	style="flex: 1;"
	ref="erpTable"
	:data="tableData"
	:columns="columns"
	:control="control"
	@handleCheck="handleCheck"
	@handleCheckAll="handleCheckAll"
	@handleSelectRow="handleSelectRow">

	<template v-slot="row">
		<span class="table-btn" @click="editAuthentication(row)">编辑</span>
		<span class="table-btn" @click="deleteAuthentication(row)">删除</span>
	</template>
</erp-table>

<script type="text/javascript">
export default{
	data () {
		return {
			tableData: [],
			columns: [
				{
					thead: '序号',
					key: '_index',
					checkbox: true,
					class: 'index',
				},
				{
					thead: '设备名称',
					key: 'resource_name',
					class: 'left',
				},
			],
			control: {
				flag: true,
				style: {
					width: '50px',
				}
			},
			checkedAuthentication: {},
		}
	},
	methods: {
		initData ({id}) {
			this.getTable().then( ({data}) => {
				let colors = ['color-red', 'color-blue'];
				this.tableData = data.map(val => {
					return Object.assign(val, {
						_checked: Math.random() > 0.5,
						_class: [
							{
								key: 'resource_name',
								class: colors[Math.floor(Math.random() * 2)]
							}
						],
						_tr_class: {},	// 行类
						_tr_style: {},	// 行样式
						_td_class: {},	// 单列类
						_td_style: {},	// 单列样式
						_style: [],	// 文案类
						_class: [],	// 文案样式
						/*
							_tr_style: {background: 'yellow'},	// 行样式
							_tr_class: '随意',	// 行类
							_style: [
								{
									key: 'resource_name',
									style: {background: 'red'},
									parent: true,
								}
							],
							_class: [
								{
									key: 'resource_name',
									class: colors[Math.floor(Math.random() * 2)]
								}
							]
						*/
					})
				})
			})
		},
		getTable (sendData) {
			return new Promise(resolve => {
				getPrecisionInstrumentTable(Object.assign({
					resource_type_id: this.$parent.checkedAuthentication.id,
					key_words: this.searchConditons.key_words
				}, sendData)).then( (res) => {
					resolve(res);
				})
			})
		},
		handleCheck (row) {
		},
		handleCheckAll ({rowIds, rowList}) {
		},
		
		handleSelectRow (row) {
			this.checkedAuthentication = row;
			this.$refs.information.initData(row);
		},
		editAuthentication (row) {
			this.editAuthenticationDialogName = 'editAuthentication';
			editAuthentication().then(_ => {
				this.$nextTick().then( _ => {
					this.$refs.editAuthentication.openDialog(row);
				})
			})
		},
		deleteAuthentication ({row, index}) {
			this.$confirm('确定要删除吗？', '提示', {
				type: 'warning'
			}).then(() => {
				deleteAuthentication({
					auth_id: row.id,
				}).then( ({code}) => {
					if (code === 200200) {
						this.$message.success('删除成功！');
						this.initData();
					}
				})
			})
		},
	}
}
</script>