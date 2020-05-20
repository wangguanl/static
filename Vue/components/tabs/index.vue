<template>
	<div class="_tabs">
		<ol class="tabs-head">
			<li v-for="(obj, index) in tabs" @click="changeTab(obj.name)" :class="{ active: tab == obj.name }">{{ obj.title }}</li>
		</ol>
		<div class="tabs-body"><slot></slot></div>
	</div>
</template>

<script type="text/javascript">
export default {
	props: {
		tabs: {
			required: true,
			type: Array
		},
		tab: {
			required: true,
			type: String
		}
	},
	methods: {
		changeTab(tabName) {
			this.$emit('update:tab', tabName);
			this.$emit('change');
		}
	}
};
</script>

<style type="text/css" lang="scss">
._tabs {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	/*padding: 15px;*/
	/*padding-top: 10px;*/
	display: flex;
	flex-direction: column;
	overflow: hidden;
	& > .tabs-head {
		$height: 34px;
		height: $height;
		line-height: $height + 2;
		border-bottom: 1px solid #d2dfef;
		flex-shrink: 0;
		box-sizing: border-box;
		@include clearfix;
		& > li {
			height: $height - 1px;
			float: left;
			border-right: 1px solid #eff2f7;
			border-bottom: 1px solid transparent;
			border-radius: 2px 2px 0 0;
			padding: 0 36px;
			cursor: pointer;
			&:first-child {
				border-left: 1px solid transparent;
				margin-left: 10px;
			}
			&.active {
				color: $blue;
				font-weight: bold;
				border-color: #d2dfef;
				border-bottom-color: transparent;
				background: #fff;
				position: relative;
				&:after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 2px;
					background: $blue;
				}
			}
		}
	}
	& > .tabs-body {
		flex: 1;
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: relative;
	}
}
</style>
