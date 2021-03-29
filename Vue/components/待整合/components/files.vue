<template>
  <div>
    <div style="padding: 10px 10px 10px 0">附件</div>
    <ul style="line-height: 24px; padding: 0 20px">
      <li v-for="file in datas" :key="file.newFilePath">
        <el-link :href="baseImgURL + file.newFilePath" target="_blank">{{
          file.oldFileName || file.newFilePath
        }}</el-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { baseImgURL } from "@/basics/baseURL";
export default {
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      baseImgURL,
    };
  },
};
</script>
