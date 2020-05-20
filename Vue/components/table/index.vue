<template>
<div class="erp-table erp-table-select" :style="{width}" ref="erpTable">
	<table class="thead">
		<thead ref="thead">
			<tr>
				<th v-for="(val, index) in columns" :style="val.style" :key="val.key" :title="val.thead" :class="val.class">
					<div class="td">
						<el-checkbox v-if="val.checkbox" size="mini" v-model="checkedAll" @change="handleCheckAll">
							<span style="color: #fff;">{{val.thead}}</span>
						</el-checkbox>
						<span v-else>{{val.thead}}</span>
					</div>
				</th>
				<th :style="control.style" v-if="control.flag">
					<div class="td">操作</div>
				</th>
			</tr>
		</thead>
	</table>
	<el-scrollbar ref="scollBar" v-loading="loadingVisible" :class="{borderBottomNone: tfoot}">
		<table class="tbody">
			<tbody ref="tbody">
				<tr v-for="(item, index) in tableData" :class="{active: checkedRow.id == item.id}" :key="item.id" @click="handleSelectRow(item)">
					<td v-for="(val, ind) in columns" :style="val.style" :class="val.class" :key="val.key" :title="val.img ? '' : item[val.key]">
						<div class="td flex center" v-if="val.img" style="padding: 0;">
							<img :src="item[val.key] ? imgBaseUrl + item[val.key] : timg" style="width: 21px; height: 21px;">
						</div>
						<div class="td" v-else>
							<el-checkbox v-if="val.checkbox" size="mini" v-model="checkedRowIds" :label="item.id" @change="handleCheck(item)">
								<span>{{item[val.key]}}</span>
							</el-checkbox>
							<span v-else>{{item[val.key]}}</span>
						</div>
					</td>
					<slot name="control"></slot>
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
	<table class="tfoot" v-if="tfoot">
		<tfoot ref="tfoot">
			<tr>
				<td v-for="(val, index) in columns" :style="val.style" :class="val.class" :key="val.key" :title="val.tfoot && tfootData[val.tfoot]">
					<div class="td">{{val.tfoot && tfootData[val.tfoot]}}</div>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
</template>

<script type="text/javascript">
import mixin from './mixin';
import { imgBaseUrl } from '@/utils/baseUrl';
import timg from '@/assets/images/timg.png';
export default{
	mixins: [mixin],
	data () {
		return {
			tableData: [],
			checkedRow: {},
			checkedAll: false,
			checkedRowIds: [],
			checkedRowList: [],
			loadingVisible: true,
			imgBaseUrl,
			timg
		}
	},
	mounted () {
		setTimeout(_ => {
			this.checkedRow = Object.assign({}, this.defaultCheckedRow);
		}, 300)
	},
	methods: {
		// 选择行
		handleSelectRow (row) {
			this.checkedRow = Object.assign({}, row);
			this.$emit('handleSelectRow', Object.assign({}, row));
		},

		// 全选
		handleCheckAll () {
			if (this.checkedAll) {
				this.checkedRowIds = this.tableData.map( val => {
					return val.id;
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

			let index = this.checkedRowIds.indexOf(row.id);
			// 已选中
			if ( index !== -1 ) {

				this.checkedRowList[index] = row;

			// 已移除
			} else {
				for (let i = 0; i < this.checkedRowList.length; i++) {
					if (this.checkedRowList[i].id == row.id) {
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
	}
}
</script>

<style type="text/css" lang="scss">
@import './mixin.scss';
/*$borderColor: #ebeef5;*/
$borderColor: #EFF2F7;
$theadBgColor: #F9FAFC;
$tfootBgColor: #eef5fe;

.erp-table.erp-table-select{
	table{
		td, th{
			border-right: 1px solid $borderColor;
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
			border: 1px solid $borderColor;
			tr{
				height: 40px;
				background-color: $theadBgColor;
				/*color: #fff;*/
			}
			.el-checkbox{
				.el-checkbox__inner{
					border-color: #fff;
				}
			}
		}
		&.tbody{
			tr{
				cursor: pointer;
				&:not(:last-child){
					border-bottom: 1px solid $borderColor;
				}
				&:hover{
					background-color: #F5F7FA;
				}
				&.active{
					background-color: #deebfd;
					color: #2fa6ed;
					& > td:first-child{
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
					}
				}
			}
			td{
				&.checkbox{
					padding: 0;
				}
			}
		}
		&.tfoot{
			border: 1px solid $borderColor;
			tr{
				height: 30px;
				background-color: $tfootBgColor;
			}
		}
	}
	& > .el-scrollbar{
		border: 1px solid $borderColor;
	}
}
</style>