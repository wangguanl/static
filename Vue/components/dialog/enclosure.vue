<template>
  <el-dialog
    class="mini"
    :title="title"
    :visible.sync="dialogVisible"
    width="410px"
    top="10vw"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="erp-table contract-history-table">
      <ol class="thead show">
        <li>序号</li>
        <li>文件名称</li>
        <li>操作</li>
      </ol>

      <ul class="tbody">
        <li v-for="(obj, index) in enclosure" :key="obj.file_url">
          <div>{{ index < 9 ? "0" + (index + 1) : index + 1 }}</div>
          <div>{{ obj.file_name }}</div>
          <div>
            <a
              :href="baseUrl + obj.file_url"
              target="_blank"
              class="color-blue"
              :download="obj.file_name"
              >下载</a
            >
          </div>
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import { baseUrl } from "@/utils/fetch";
export default {
  props: {
    title: {
      default: "附件",
    },
    enclosure: {
      default: [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      baseUrl,
    };
  },
  methods: {
    /*
			[
				{
					file_url: '****',
					file_name: '***'
				}
			]
		*/
    setDialogVisible(visible, enclosure) {
      this.dialogVisible = visible;
      if (enclosure) {
        this.enclosure = enclosure;
      }
    },
  },
};
</script>

<style type="text/css" lang="scss" scoped="">
/* 合同表格 */
/deep/ .el-dialog .el-dialog__body {
  padding: 0;
}
.contract-history-table {
  .thead {
    height: 30px;
  }
  .tbody > li {
    border-bottom: none;
    cursor: pointer;
    &.active {
      background: #deebfd;
      color: #2fa6ed;
      position: relative;
    }
    & > div {
      padding: 8px 10px;
      &:nth-child(2) {
        text-align: left;
      }
    }
  }
  @each $nth, $width in (1: 54, 2: 300, 3: 56) {
    .thead > li:nth-child(#{$nth}),
    .tbody > li > div:nth-child(#{$nth}) {
      width: $width + px;
    }
  }
}
</style>