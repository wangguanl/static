<template>
	<div class="plugin-loading" v-show="display">

		<div class="mark"></div>

	 	<div class="donut" v-if="loadingType == 1"></div>

		<div class="bouncing-loader" v-if="loadingType == 2">
			<div></div>
			<div></div>
			<div></div>
		</div>

	</div>
</template>


	<style>
	</style>
<script>
export default {
  	name: 'loading',
	data () {
		return {
			display: true,
			loadingType : 1
		}
	}
}
</script>

<style scoped lang="scss">
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

.bouncing-loader {
  	display: flex;
  	justify-content: center;
  	position: absolute;
  	top: 50%;
  	left: 0;
  	width: 100%;
	z-index: 999;
	& > div {
		width: 12px;
		height: 12px;
		margin: 6px 4px;
		background: #8385aa;
		border-radius: 50%;
		animation: bouncing-loader 0.6s infinite alternate;

		&:nth-child:nth-child(2) {
		  	animation-delay: 0.2s;
		};
		&:nth-child:nth-child(3) {
		  	animation-delay: 0.4;
		}
	}

}
@keyframes bouncing-loader {
  	from {
    	opacity: 1;
    	transform: translateY(0);
  	}
  	to {
    	opacity: 0.1;
    	transform: translateY(-12px);
  	}
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
	
