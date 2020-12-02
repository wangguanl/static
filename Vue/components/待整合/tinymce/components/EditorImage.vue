<template>
  <div>
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
      >上传图片
    </el-button>
    <el-dialog width="670px;" title="上传图片" :visible.sync="dialogVisible">
      <com-upload-pic ref="uploadPic" v-model="fileList"></com-upload-pic>
      <div style="display: flex; justify-content: flex-end; margin-top: 12px">
        <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        <el-button @click="onCloseDialog"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import comUploadPic from "@/components/upload/uploadPic";
export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff",
    },
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
    };
  },
  methods: {
    onSubmit() {
      if (!this.fileList.length) {
        this.$message.warning("请上传图片");
      } else if (!this.$refs.uploadPic.useCheckUploadStatus()) {
        this.$message.warning("文件正在上传，请稍等");
      } else {
        this.$emit("successCBK", this.fileList);
        this.onCloseDialog();
      }
    },
    onCloseDialog() {
      this.dialogVisible = false;
      this.fileList = [];
      this.$refs.uploadPic.useClearFiles();
    },
  },
  components: {
    comUploadPic,
  },
};
</script>
