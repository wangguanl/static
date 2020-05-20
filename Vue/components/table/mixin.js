import generateUUID from '@/utils/unique';
import { scroll } from '@/utils/debounce';
export default{
	props: {
		data: {
			required: true,
			type: Array,
		},
		columns: {
			required: true,
			type: Array,
		},
		tfoot: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '100%'
		},
		tfootData: {
			type: Object,
		},
		control: {
			type: Object,
			default: () => {
				return {}
			}
		},
		defaultCheckedRow: {
			type: Object,
			default: () => {
				return {}
			}
		} 
	},
	mounted () {
		scroll({
			el: this.$refs.scollBar.$refs.wrap,
			fn: () => {
				this.$emit('handleScroll');
			}
		});
	},
	methods: {

		// 处理数据
		filterTableData () {
			let hasId = this.data.length && this.data[0].hasOwnProperty('id');
			let data = this.data.map((val, index) => {
				return Object.assign({
					index: index+1,
					id: hasId && generateUUID()
				}, val);
			});
			return data;
		},


		initScrollTop () {
			this.$refs.scollBar.$refs.wrap.scrollTop = 0;
			if (this.tableData.length) {
				this.checkedRow = Object.assign({}, this.tableData[0]);
			}
		},

		// 获取父元素的高度， 计算出最大展示容量
		calcHeight () {

			let $erpTable = this.$refs.erpTable;

			// 净宽高 + 父元素1px border
			let theadHeight = this.$refs.thead.getElementsByTagName('tr')[0].clientHeight + 1,
				
				// 净宽高 + 父元素1px border
				tfootHeight = this.$refs.tfoot ? this.$refs.tfoot.getElementsByTagName('tr')[0].clientHeight + 1 : 1;

			if (!this.tableData.length) {

				$erpTable.style.height =  theadHeight + tfootHeight + 'px';

			} else {


				let rows = this.$refs.tbody.getElementsByTagName('tr');

				let rowHeight = rows.length > 1 ? rows[1].clientHeight + 1 : rows[0].clientHeight + 1;

				let maxLen = Math.ceil(($erpTable.parentNode.clientHeight - theadHeight - tfootHeight) / rowHeight);

				if ( this.tableData.length > maxLen ) {
					$erpTable.style.height = '100%';
				} else {
					$erpTable.style.height =  this.tableData.length * rowHeight + theadHeight + tfootHeight + 'px';
				}
			}
		},

	},
	watch: {
		data (val) {

			// 格式化数据
			this.tableData = this.filterTableData();
			this.$nextTick().then(_ => {
				// 计算高度
				this.calcHeight();

				this.loadingVisible = false;
				// 全选
				this.checkedAll && this.handleCheckAll();
			})
		}
	}
}