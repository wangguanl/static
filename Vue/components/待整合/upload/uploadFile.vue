<template>
  <el-upload
    ref="upload"
    list-type="text"
    :action="uploadUrl"
    :headers="uploadHeader"
    :data="uploadData"
    :name="fieldname"
    :accept="accept.toString()"
    :multiple="multiple"
    :limit="limit * 1"
    :file-list="fileList"
    :before-upload="onBeforeUpload"
    :on-change="onChange"
    :on-success="onSuccess"
    :on-exceed="onExceed"
    :on-error="onError"
    :before-remove="onBeforeRemove"
    :on-remove="onRemove"
  >
    <el-button size="mini" type="primary" plain>点击上传</el-button>
  </el-upload>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
};
</script>
