<template>
	<div style="height: 100%;width: 100%;">
		<el-upload
			:action="uploadUrl"
			:data="uploadData"
			:name="uploadName"
			ref="upload"
			list-type="picture-card"
			:accept="Array.isArray(accept) ? accept.toString() : accept"
			:multiple="multiple"
			:limit="limit * 1"
			:file-list="fileList"
			:on-exceed="uploadMaxLength"
			:on-success="success"
			:on-error="error"
			:before-upload="before"
		>
			<i slot="default" class="el-icon-plus"></i>

			<div slot="file" slot-scope="{ file }" style="height: 100%; width: 100%;">
				<template v-if="file.response">
					<el-image :src="fileUrl + file.response.result[0].file_url" class="el-upload-list__item-thumbnail"></el-image>
					<span class="el-upload-list__item-actions">
						<span v-if="btns.some(val => val === 1)" @click="handlePictureCardPreview(file)"><i class="el-icon-zoom-in" title="预览"></i></span>
						<span v-if="btns.some(val => val === 3)" @click="handleFirst(file)"><i class="el-icon-thumb" title="设置为首选图"></i></span>
						<span v-if="btns.some(val => val === 4)" @click="handleRemark(file)"><i class="el-icon-info" :title="file.response.result[0].remark || '备注'"></i></span>
						<span v-if="btns.some(val => val === 2)" @click="handleRemove(file)"><i class="el-icon-delete" title="删除"></i></span>
					</span>
				</template>
				<div v-else class="el-loading-mask">
					<div class="el-loading-spinner">
						<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
					</div>
				</div>
			</div>
		</el-upload>

		<el-image-viewer v-if="previewVisible" :on-close="closeViewer" :url-list="previewList" />
	</div>
</template>

<script type="text/javascript">
import mixin from './mixin';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
export default {
	mixins: [mixin],
	data() {
		return {
			// 上传文件的集合
			fileList: [],
			/* dialog弹出框状态 */
			previewVisible: false,
			previewList: []
		};
	},
	methods: {
		// 点击文件后 查看文件
		handlePictureCardPreview(img) {
			this.previewVisible = true;
			let startIndex = this.fileList.indexOf(img);
			let arr = [...this.fileList];
			this.previewList = [...arr.splice(startIndex), ...arr].map(val => val.url);
		},
		// 关闭图片弹出框
		closeViewer() {
			this.previewVisible = false;
		},
		// 设置首选图片
		handleFirst(img) {
			let startIndex = this.fileList.indexOf(img);
			let arr = [...this.fileList];
			this.fileList = [...arr.splice(startIndex, 1), ...arr];
			this.transmitData();
		},
		// 设置图片备注
		handleRemark(img) {
			this.$prompt(' ', '请输入备注').then(({ value }) => {
				this.$set(img.response.result[0], 'remark', value);
				this.$message.success('设置成功！');
				this.transmitData();
			});
		},
		// 删除图片
		handleRemove(img) {
			this.beforeRemove(img).then(_ => {
				this.fileList.splice(this.fileList.indexOf(img), 1);
				this.transmitData();
			});
		}
	},
	components: {
		ElImageViewer
	}
};
</script>

<style lang="scss" scoped="">
::v-deep .el-image {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	.el-image__inner {
		max-width: 100%;
		max-height: 100%;
		height: unset;
		width: unset;
	}
}
</style>
