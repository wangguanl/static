<template>
<div class="_select">
	<span class="label">{{label}}</span>
	<el-select v-model="value" placeholder="请选择" style="flex: 1;" @change="changeSelect">
		<el-option
		v-for="item in options"
		:key="item.value"
		:label="item.label"
		:value="item.value">
		</el-option>
	</el-select>
</div>
</template>

<script type="text/javascript">
export default{
	props: {
		label: {
			required: true,
			type: String,
		},
		options: {
			required: true,
			type: Array,
		},
		option: {
			required: true,
			type: String
		}
	},
	data () {
		return {
			value: this.option
		}
	},
	methods: {
		changeSelect (val) {
			this.$emit("update:option", val);
			this.$emit("change");
		}
	},
}
</script>

<style type="text/css" lang="scss" scoped="">
._select{
	display: flex;
	width: 180px;
	height: 32px;
	background-color: #ffffff;
	box-shadow: 0px 1px 2px 0px #e3eefb;
	border-radius: 4px;
	border: solid 1px #d2dfef;
	overflow: hidden;
	box-sizing: border-box;
	.label{
		padding: 0 16px;
		height: 100%;
		flex-shrink: 0;
		border-right: 1px solid #d2dfef;
		display: flex;
		align-items: center;
		color: #666;
	}
	/deep/ .el-select{
		.el-input__inner{
			border: none;
		}
	}
}
</style>