<template>
	<div class="plugin-loading" v-show="display">
		<div class="mark"></div>
	 	<div class="donut"></div>
 	</div>
</template>

<script>
export default {
  	name: 'loading',
	data () {
		return {
			display: true,
		}
	}
}
</script>

<style scoped>
.mark{
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: transparent;
	z-index: 998;
}
.donut {
	display: inline-block;
	border: 4px solid rgba(0, 0, 0, 0.1);
	border-left-color: #7983ff;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	animation: donut-spin 1.2s linear infinite;
	position: fixed;
	top: 50%;
	left: 50%;
	margin-top: -15px;
	margin-left: -15px;
	z-index: 999;
}
@keyframes donut-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
	
