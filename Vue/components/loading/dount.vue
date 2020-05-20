<template>
	<div class="_plugin-loading">
		<div class="mark" :class="markShow"></div>
		<div class="el-loading-spinner donut" :class="donutShow">
			<svg viewBox="25 25 50 50" class="circular">
				<circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
			</svg>
		</div>
	</div>
</template>
<script type="text/javascript">
export default{
	data () {
		return {
			markShow: '',
			donutShow: ''
		}
	},
	mounted () {
		setTimeout( () => {
			this.markShow = 'mark-show';
			this.donutShow = 'donut-show';
		}, 3000);
	}
}
</script>
<style type="text/css" lang="scss" scoped="">
	
._plugin-loading{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	.mark{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		background: #fff;
		transition: all 0.15s linear;
		opacity: 0;
		&.mark-show{
			opacity: 0.9;
		}
	}
	.donut {
		opacity: 0;
		transition: all 0.15s linear;
		&.donut-show{
			opacity: 1;
		}
	}
}
</style>