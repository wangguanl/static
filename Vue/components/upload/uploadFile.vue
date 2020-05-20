<template>
	<el-upload
		:action="uploadUrl"
		:data="uploadData"
		:name="uploadName"
		ref="upload"
		list-type="text"
		:accept="Array.isArray(accept) ? accept.toString() : accept"
		:multiple="multiple"
		:limit="limit * 1"
		:file-list="fileList"
		:on-exceed="uploadMaxLength"
		:on-remove="remove"
		:on-success="success"
		:on-error="error"
		:before-upload="before"
		:before-remove="beforeRemove"
	>
		<el-button size="mini" type="primary" plain>点击上传</el-button>
	</el-upload>
</template>

<script type="text/javascript">
import mixin from './mixin';
export default {
	mixins: [mixin],
	data() {
		return {
			fileList: []
		};
	}
};
</script>
