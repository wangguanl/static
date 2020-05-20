<template>
<div class="erp-table erp-table-show" :style="{width}" ref="erpTable">
	<table class="thead">
		<thead ref="thead">
			<tr>
				<th v-for="(val, index) in columns" :style="val.style" :key="val.key" :title="val.thead" :class="val.class">
					<div class="td">
						<span>{{val.thead}}</span>
					</div>
				</th>
			</tr>
		</thead>
	</table>
	<el-scrollbar ref="scollBar" v-loading="loadingVisible" :class="{borderBottomNone: tfoot}">
		<table class="tbody">
			<tbody ref="tbody">
				<tr v-for="(item, index) in tableData">
					<td v-for="(val, ind) in columns" :style="val.style" :class="val.class" :key="val.key" :title="item[val.key]">
						<div class="td">
							<span>{{item[val.key]}}</span>
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
export default{
	mixins: [mixin],
	data () {
		return {
			tableData: [],
			loadingVisible: true
		}
	},
}
</script>

<style type="text/css" lang="scss">
@import './mixin.scss';
$borderColor: #ebeef5;
$theadBgColor: #dce7ff;
$tfootBgColor: #f5f7fa;
.erp-table.erp-table-show{
	table{
		td, th{
			border-right: 1px solid $borderColor;
		}
		&.thead{
			border: 1px solid $borderColor;
			tr{
				height: 36px;
				background-color: $theadBgColor;
			}
		}
		&.tbody{
			tr{
				&:not(:last-child){
					border-bottom: 1px solid $borderColor;
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