<template>
<div class="_table" ref="erpTable">
	<table class="thead" ref="thead">
		<thead>
			<tr>
				<th v-for="(val, index) in columns" :style="val.style" :title="val.thead" :class="val.class" :key="val.key">
					<div class="th">
						<el-checkbox v-if="val.checkbox" size="mini" v-model="checkedAll" @change="handleCheckAll">
							<span>{{val.thead}}</span>
						</el-checkbox>
						<span v-else>{{val.thead}}</span>
					</div>
				</th>
				<th v-if="control.flag" :style="control.style">
					<div class="th">操作</div>
				</th>
			</tr>
		</thead>
	</table>
	<el-scrollbar ref="scollBar" v-loading="loadingVisible" :class="{borderBottomNone: tfoot}">
		<table class="tbody">
			<tbody ref="tbody">
				
				<tr 
					v-for="(item, index) in tableData"
					:class="[{active: checkedRow._id == item._id}, item._tr_class]"
					:style="[item._tr_style]"
					:key="item._id"
					@click="handleSelectRow(item)">

					<td
						v-for="(val, ind) in columns"
						:key="val.key"
						:title="!val.img ? item[val.key] : ''"
						:class="[val.class, val._td_class]"
						:style="[val.style, item._td_style.some(_s => _s.key === val.key) && item._td_style.filter(_s => _s.key === val.key)[0].style, {padding: val.img ? 0 : ''}]">

						<img v-if="val.img" :src="fileBaseUrl + item[val.key]" :class="item._class.some(_c => _c.key === val.key) && item._class.filter(_c => _c.key === val.key)[0].class"
						:style="item._style.some(_s => _s.key === val.key) && item._style.filter(_s => _s.key === val.key)[0].style">


						<div v-else class="td">

							<el-checkbox
								v-if="val.checkbox"
								v-model="checkedRowIds"
								size="mini"
								:label="item._id"
								:disabled="item._disabled"
								@change="handleCheck(item)">

								<span :class="item._class.some(_c => _c.key === val.key) && item._class.filter(_c => _c.key === val.key)[0].class" :style="item._style.some(_s => _s.key === val.key) && item._style.filter(_s => _s.key === val.key)[0].style">{{item[val.key]}}</span>

							</el-checkbox>

							<span v-else :class="item._class.some(_c => _c.key === val.key) && item._class.filter(_c => _c.key === val.key)[0].class" :style="item._style.some(_s => _s.key === val.key) && item._style.filter(_s => _s.key === val.key)[0].style">{{item[val.key]}}</span>

						</div>

					</td>
					<td v-if="control.flag" :style="control.style" style="padding: 0;">
						<div class="flex align-center evenly pointer">
							<slot :row="item, index"></slot>
						</div>
					</td>
				</tr>
				<tr v-if="!tableData.length">
					<td>
						<div class="td">
							暂无数据
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</el-scrollbar>
	<table class="tfoot" v-if="tfoot" ref="tfoot">
		<tfoot>
			<tr>
				<td v-for="(val, index) in columns" :style="val.style" :class="val.class" :title="val.tfoot && tfootData[val.tfoot]" :key="val.key">
					<div class="td">{{val.tfoot && tfootData[val.tfoot]}}</div>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
</template>

<script type="text/javascript">
import generateUUID from '@/utils/unique';
import { scroll } from '@/utils/debounce';
import { fileBaseUrl } from '@/utils/baseUrl';
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
		}
	},
	data () {
		return {
			tableData: [],
			checkedRow: {},
			checkedAll: false,
			checkedRowIds: [],
			checkedRowList: [],
			loadingVisible: true,
			fileBaseUrl
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
	beforeDestroy () {
		this.$refs.scollBar.$refs.wrap.removeEventListener('scroll', () => {
			this.$emit('handleScroll');
		});
	},
	methods: {


		initTable (checked) {
			this.$refs.scollBar.$refs.wrap.scrollTop = 0;
			if (!checked && this.tableData.length) {
				let row = this.tableData[0];
				this.checkedRow = Object.assign({}, row);
				this.handleSelectRow(row);
			}
		},

		// 全选
		handleCheckAll () {
			if (this.checkedAll) {
				this.checkedRowIds = this.tableData.map( val => {
					return val._id;
				})
			} else {
				this.checkedRowIds = [];
			}
			this.$emit('handleCheckAll', {
				rowIds: [...this.checkedRowIds],
				rowList: [...this.tableData],
			});
		},

		// 单选
		handleCheck (row) {
			// 控制全选
			if (this.checkedRowIds.length == this.tableData.length) {
				this.checkedAll = true;
			} else {
				this.checkedAll = false;
			}

			let index = this.checkedRowIds.indexOf(row._id);
			// 已选中
			if ( index !== -1 ) {

				this.checkedRowList[index] = row;

			// 已移除
			} else {
				for (let i = 0; i < this.checkedRowList.length; i++) {
					if (this.checkedRowList[i]._id == row._id) {
						this.checkedRowList.splice(i, 1);
						break;
					}
				}
			}

			this.$emit('handleCheck', {
				row: Object.assign({}, row),
				rowIds: [...this.checkedRowIds],
				rowList: [...this.checkedRowList],
			});
		},
		
		// 选择行
		handleSelectRow (row) {
			this.checkedRow = Object.assign({}, row);
			this.$emit('handleSelectRow', Object.assign({}, row));
		},

		// 处理数据
		filterTableData () {
			let data = this.data.map((val, index) => {
				return Object.assign({
					_index: index+1,	// 序号
					_id: generateUUID(),
					_tr_class: {},	// 行类
					_tr_style: {},	// 行样式
					_td_class: {},	// 单列类
					_td_style: [],	// 单列样式
					_style: [],	// 文案类
					_class: [],	// 文案样式
				}, val);
			});
			let checkedData = data.filter(val => val._checked);
			this.checkedRowIds = checkedData.map(val => val._id);
			this.checkedRowList = [...checkedData];
			return data;
		},

		// 获取父元素的高度， 计算出最大展示容量
		calcHeight () {

			let $erpTable = this.$refs.erpTable;

			// 净宽高 + 父元素1px border
			let theadHeight = this.$refs.thead.offsetHeight,
				
				// 净宽高 + 父元素1px border
				tfootHeight = this.$refs.tfoot ? this.$refs.tfoot.offsetHeight : 0;

			let parentHeight = $erpTable.parentNode.clientHeight;

			if (this.tableData.length) {	// 有数据
				
				let rows = this.$refs.tbody.getElementsByTagName('tr');

				let rowHeight = rows.length > 1 ? rows[1].offsetHeight : rows[0].offsetHeight;


				if (parentHeight == 0) {

					$erpTable.style.height = this.tableData.length * 33 + 33 + 'px';

				} else {

					let maxLen = Math.ceil((parentHeight - theadHeight - tfootHeight) / rowHeight);

					$erpTable.style.height = this.tableData.length > maxLen ? '100%' : this.tableData.length * rowHeight + theadHeight + tfootHeight + 'px';
				}

			} else {	// 无数据

				if (parentHeight == 0) {
					$erpTable.style.height = '66px';

				} else {
					$erpTable.style.height =  theadHeight + 33 + tfootHeight + 'px';
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
</script>

<style type="text/css" lang="scss">
$borderColor: #ebeef5;
/*$theadBgColor: #489ef1;*/
$theadBgColor: $blue;
$tfootBgColor: #f5f7fa;

$theadHeight: 32px;
$tdHeight: 32px;
$tfootHeight: 30px;
._table{
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	background: #fff;
	overflow: hidden;
	font-size: 12px;
	height: 68px;
	table{
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		th, td{
			border-right: 1px solid $borderColor;
			&:last-child{
				border-right: none;
			}
		}
		.th, .td{
			height: 16px;
			line-height: 16px;
			width: 100%;
			box-sizing: border-box;
		}
		.el-checkbox{
			color: unset;
			font-weight: normal;
			display: flex;
			justify-content: center;
			align-items: center;
			.el-checkbox__label{
				line-height: unset;
				font-size: 12px;
			}
		}
		&.thead{
			flex-shrink: 0;
			tr{
				height: $theadHeight;
				background-color: $theadBgColor;
				color: #fff;
			}
			th{
				font-weight: normal;
				border-right-color: #4ea8ff;
			}
			.el-checkbox__label{
				color: #fff;
			}
			.el-checkbox__inner{
				border-color: #fff;
			}
		}
		&.tbody{
			height: 100%;
			tr{
				cursor: pointer;
				&:not(:last-child){
					border-bottom: 1px solid $borderColor;
				}
				&:nth-child(odd){
					background-color: #fafbfd;
				}
				&:hover{
					background-color: #F5F7FA;
				}
				&.active{
					background-color: #deebfd;
					color: #2fa6ed;
					/*& > td:first-child{
						position: relative;
						&:before{
							content: "";
							height: 12px;
							width: 2px;
							background-color: #2d91e9;
							display: block;
							border-radius: 1px;
							position: absolute;
							top: 50%;
							left: 0;
							margin-top: -6px;
						}
					}*/
				}
			}
			td{
				text-align: center;
				padding: 8px 0;
				.td{
					padding: 0 14px;
					@include text-ellipsis;
				}
				&.pre{
					.td{
						white-space: pre-wrap;
					}
				}
			}
		}
		&.tfoot{
			flex-shrink: 0;
			text-align: center;
			tr{
				height: $tfootHeight;
				background-color: $tfootBgColor;
				.td{
					height: 12px;
					box-sizing: border-box;
				}
			}
		}

		%index{
			width: 60px;
		}
		%name{
			width: 80px;
		}
		%status{
			width: 80px;
		}
		%date{
			width: 82px;
		}
		%lang-date{
			width: 135px;
		}
		&.thead{
			th{
				&.index{
					@extend %index;
				}
				&.name{
					@extend %name;
				}
				&.status{
					@extend %status;
				}
				&.date{
					@extend %date;
				}
				&.lang-date{
					@extend %lang-date;
				}
			}
		}
		&.tbody, &.tfoot{
			td{
				&.index{
					@extend %index;
				}
				&.name{
					@extend %name;
				}
				&.status{
					@extend %status;
				}
				&.date{
					@extend %date;
				}
				&.lang-date{
					@extend %lang-date;
				}
				&.left{
					text-align: left;
				}
				&.right{
					text-align: right;
					.td{
						padding-left: 0px;
						padding-right: 6px;
					}
				}
			}

		}
	}
	& > .el-scrollbar{
		flex: 1;
		&.borderBottomNone{
			border-bottom: none;
		}
		.el-scrollbar__wrap{
			overflow-x: hidden;
		}
	}
	& > .thead, & > .el-scrollbar, & > .tfoot{
		/*border: 1px solid transparent;*/
	}
	& > .thead{
		border-top: 1px solid $theadBgColor;
	}
	& > .el-scrollbar{
		/*border-bottom: 1px solid transparent;*/
	}

	&.border{
		& > .thead, & > .el-scrollbar, & > .tfoot{
			border: 1px solid $borderColor;
			/*border-color: $borderColor;*/
		}
	}
}

</style>