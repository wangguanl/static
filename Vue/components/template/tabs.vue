<erp-tabs
	style="flex: 1; margin-left: 6px;"
	:tabs="tabs"
	:tab.sync="curTab">
	<component :is="curTab" ref="tabComponent"></component>
</erp-tabs>

<script type="text/javascript">
export default {
	
	data () {
		return {

			// tab切换
			curTab: '',
			tabs: [
				{
					title: '项目信息',
					name: 'productInformation',
				},
				{
					title: '配置信息',
					name: 'configInformation',
				},
				{
					title: '管理员',
					name: 'administrators',
				},
				{
					title: '功能开通',
					name: 'functional',
				},
			],
		}
	},
	methods: {
		handleSelectRow (row) {
			this.checkedAuthentication = row;
			components[this.curTab]().then( _ => {
				this.$nextTick().then(_ => {
					this.$refs.tabComponent.initData();
				})
			})
		},
	},
	components,
}
</script>