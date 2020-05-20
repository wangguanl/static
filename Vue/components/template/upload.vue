<template>
<div>
	<erp-upload-pic @getFile="getFile" ref="upload" limit="5" :accept="['.PNG', '.JPEG', '.JPG', '.BMP']" :params="{a: 123}"></erp-upload-pic>

	<erp-upload-face @getFile="getFile" ref="upload" limit="5" :accept="['.PNG', '.JPEG', '.JPG', '.BMP']" params="123"></erp-upload-face>

	<erp-upload-file @getFile="getFile" ref="upload" limit="5" :accept="['.PNG', '.JPEG', '.JPG', '.BMP']" params="iiiiiiii"></erp-upload-file>

</div>
</template>

<script type="text/javascript">
export default {
	data () {
		return {

		}
	},
	methods: {
		getFile({datas, params}){
			this.form[params] = datas;
		},

	}
}
</script>

<style type="text/css" lang="scss" scoped="">
	
</style>