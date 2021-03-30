<template>
	<div class="plugins-tips2">
		<div class="tips" :class="tipsDisplay">
			<span>{{msg}}</span>
		</div>
	</div>
</template>

<script>
export default{
	props: ['msg'],
	data () {
		return {
			tipsDisplay: '',
		}
	},
	mounted () {

		setTimeout( () => {
			this.tipsDisplay = 'tips-show'
		}, 300);

		new Promise( (resolve, reject) => {
			setTimeout( () => {
				this.tipsDisplay = '';
				resolve();
			}, 5000);
		}).then(() => {
			setTimeout( ()=> {
				// 调用父组件的关闭事件
				this.$emit('closetips');
			}, 1000)
		})

	}
}
</script>

<style scoped lang="scss">
.plugins-tips2{
	position: fixed;
	top: 110px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	z-index: 999;
}

.tips{
	min-width: 150px;
	max-width: 260px;
	padding: 10px 14px;
	border-radius: 5px;
	font-size: 16px;
	text-align: center;
	color: #fff;
	background: rgba(0,0,0,0.6);
	opacity: 0;
	transition: all 0.3s linear;
	&.tips-show{
		opacity: 1;
	}
}
</style>