<template>
  <div>
    <el-upload
      ref="upload"
      list-type="picture-card"
      :action="uploadUrl"
      :headers="uploadHeader"
      :data="uploadData"
      :name="fieldname"
      :accept="accept === '*' ? 'image/*' : accept.toString()"
      :multiple="multiple"
      :limit="limit * 1"
      :file-list="fileList"
      :before-upload="onBeforeUpload"
      :on-change="onChange"
      :on-success="onSuccess"
      :on-exceed="onExceed"
      :on-error="onError"
    >
      <i slot="default" class="el-icon-plus"></i>

      <template v-slot:file="{ file }">
        <el-image
          :src="file.url"
          class="el-upload-list__item-thumbnail"
          v-loading="file.status !== 'success'"
        ></el-image>
        <span class="el-upload-list__item-actions">
          <span @click="onPictureCardPreview(file)"
            ><i class="el-icon-zoom-in" title="预览"></i
          ></span>
          <span @click="onPictureCardRemove(file)"
            ><i class="el-icon-delete" title="删除"></i
          ></span>
        </span>
      </template>
    </el-upload>

    <el-image-viewer
      v-show="previewVisible"
      :on-close="onClosePictureCardViewer"
      :url-list="previewList"
    />
  </div>
</template>

<script type="text/javascript">
import mixin from "./mixin";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  mixins: [mixin],
  data() {
    return {
      /* dialog弹出框状态 */
      previewVisible: false,
      previewList: [],
    };
  },
  watch: {
    fileList() {
      let visible = "inline-block";
      if (this.fileList.length >= this.limit) {
        visible = "none";
      }
      this.$nextTick().then(() => {
        this.$refs.upload.$el.getElementsByClassName(
          "el-upload--picture-card"
        )[0].style.display = visible;
      });
    },
  },
  methods: {
    // 点击文件后 查看文件
    onPictureCardPreview(file) {
      this.previewVisible = true;
      let startIndex = this.fileList.indexOf(file);
      let arr = [...this.fileList];
      this.previewList = [...arr.splice(startIndex), ...arr].map(
        (val) => val.url
      );
      // 服务器图片
      // this.fileUrl + val.response.result[0].file_url
    },
    // 关闭图片弹出框
    onClosePictureCardViewer() {
      this.previewVisible = false;
    },
    // 删除图片
    onPictureCardRemove(file) {
      this.onBeforeRemove().then(() => this.onRemove(file));
    },
  },
  components: {
    ElImageViewer,
  },
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
.hidden .el-upload--picture-card {
  display: none;
}
::v-deep .el-image-viewer__wrapper {
  .el-icon-circle-close {
    color: #fff;
  }
}
</style>
