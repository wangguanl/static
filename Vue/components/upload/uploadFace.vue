<template>
	<el-upload
		:action="uploadUrl"
		:data="uploadData"
		:name="uploadName"
		ref="upload"
		list-type="picture-card"
		:accept="Array.isArray(accept) ? accept.toString() : accept"
		:multiple="multiple"
		:limit="limit * 1"
		:show-file-list="false"
		:file-list="fileList"
		:on-exceed="uploadMaxLength"
		:on-remove="remove"
		:on-success="successSelf"
		:on-error="error"
		:before-upload="before"
		:before-remove="beforeRemove"
	>
		<el-image v-if="fileList.length" :src="fileList[0].file_url"></el-image>
		<i v-else class="el-icon-plus"></i>
	</el-upload>
</template>

<script type="text/javascript">
import mixin from './mixin';
export default {
	mixins: [mixin],
	data() {
		return {
			// 上传文件的集合
			fileList: []
		};
	},
	methods: {
		successSelf(...arg) {
			if (this.success(...arg)) {
				let file = this.fileList[this.fileList.length - 1];
				this.fileList = [file];
			}
		}
	}
};
</script>
<style scoped="" lang="scss">
::v-deep .el-upload {
	display: flex;
	align-items: center;
	justify-content: center;
}
::v-deep .el-image {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	img.el-image__inner {
		max-width: 100%;
		max-height: 100%;
		height: unset;
		width: unset;
	}
}
</style>
