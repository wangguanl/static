<template>
  <div class="_flex _flex-column _container">
    <e-head
      class="_header"
      :head="head"
      @search="useSearch"
      v-bind="$attrs"
      @deleteAll="useDelete"
    ></e-head>

    <div class="_main">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        ref="eltable"
        stripe
        border
        highlight-current-row
        @selection-change="onSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          fixed="left"
          label="排序"
          align="center"
        />
        <el-table-column
          v-for="column in table.columns"
          :label="column.label"
          :key="column.label"
          :min-width="column.width"
          :align="column.align || 'center'"
          show-overflow-tooltip
        >
          <template v-slot="{ row }">
            <img
              v-if="column.type === 'img'"
              v-show="row[column.prop]"
              style="width: 100px; height: 100px"
              :src="baseImgURL + row[column.prop]"
            />
            <template v-else> {{ rHtml(row, column) }}</template>
          </template>
        </el-table-column>
        <slot name="tableControlColumn"></slot>
        <el-table-column
          v-if="table.btns"
          label="操作"
          min-width="140"
          :width="table.btnsWidth ? parseFloat(table.btnsWidth) : 140"
          fixed="right"
          align="center"
        >
          <template v-slot="{ row, $index }">
            <el-button
              style="font-size: 12px"
              type="text"
              v-for="item in table.btns.filter((btn) =>
                btn.rule ? btn.rule(row, $index) : true
              )"
              :key="item.name"
              @click="onTableBtnClick(row, item)"
              >{{ item.name }}</el-button
            >
            <slot name="tableControl" :row="row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="_footer">
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20, 40, 80, 100, 200]"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      class="dialog"
      :title="dialogState.title"
      :visible.sync="dialogState.visible"
      :width="dialogState.width"
    >
      <slot name="dialog"></slot>
    </el-dialog>
  </div>
</template>

<script>
import eHead from "./eHead";
import { baseImgURL } from "@/basics/baseURL";
import { mapGetters } from "vuex";
import axios from "@/basics/request";
export default {
  inheritAttrs: false,
  computed: {
    // 全局字典
    ...mapGetters(["Dictionaries"]),
  },
  props: {
    head: {
      type: Object,
      default: () => ({
        options: [],
        btns: [],
      }),
      // 查询条件为必传项
      validator: (head) => Array.isArray(head.options),
    },

    //
    table: {
      type: Object,
      required: true,
      default: () => ({
        fn: () => {}, // 请求表格数据函数
        columns: [], // 表格项
        btns: [], // 表格按钮
        added: {}, // 接口额外参数
        fntype: "data", // get形式传入params post传入data
        transData: (datas) => datas,
        btnsWidth: 0, // 表格按钮宽度
        deleteurl: "", // 批量删除接口
      }),
      // 查询函数和表格各项为必传项
      validator: (table) => table.fn && Array.isArray(table.columns),
    },

    dialog: {
      type: Object,
      default: () => ({
        visible: false,
        title: "",
        width: "",
      }),
    },
  },
  data() {
    return {
      baseImgURL,
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 40,
        currentPage: 1,
      },
      searchOptions: {},
      dialogState: {
        visible: false,
        title: "",
        width: "",
      },
      checkedDatas: [],
    };
  },
  watch: {
    dialog(val) {
      let { visible, title = "", width = "" } = val;
      if (visible) {
        this.dialogState = { visible, title, width };
      } else {
        this.$set(this.dialogState, "visible", false);
      }
    },
  },
  mounted() {
    this.useGetTableData();
  },
  methods: {
    useMockTableData() {
      return new Promise((resolve) => {
        const data = [];
        for (let i = 0; i < this.pagination.pageSize; i++) {
          data.push({
            date: Math.random(),
            name: Math.random(),
            address: Math.random(),
          });
        }
        resolve({ data, total: 88 });
      });
    },
    /* 获取表格数据 */
    useGetTableData() {
      this.tableData = [];
      return new Promise(async (resolve, reject) => {
        const Data = await this.table.fn({
          selecter: this.$refs.eltable,
          res: true,
          [this.table.fntype || "data"]: {
            ...this.searchOptions,
            ...this.table.added,
            page: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
          },
        });
        let { data, total } = Data;
        this.$set(this.pagination, "total", total);
        this.tableData = this.table.transData
          ? this.table.transData(data)
          : data;
        resolve(Data);
      });
    },
    // 切换条数
    onSizeChange(val) {
      this.$set(this.pagination, "pageSize", val);
      this.$set(this.pagination, "currentPage", 1);
      this.useGetTableData();
    },
    // 切换页
    onCurrentChange(val) {
      this.$set(this.pagination, "currentPage", val);
      this.useGetTableData();
    },
    // 查询table数据
    useSearch({ parmas, immediately }) {
      this.searchOptions = parmas;
      immediately && this.onCurrentChange(1);
    },
    // 已选数据
    onSelectionChange(val) {
      this.checkedDatas = val;
    },
    // 批量删除
    useDelete() {
      if (!this.checkedDatas.length) {
        this.$message.warning("请选择要删除的数据");
        return;
      }
      this.$confirm(`确定要执行删除操作吗？`, " ", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await axios.post(this.table.deleteurl, {
          tips: true,
          trans: "body",
          data: this.checkedDatas.map((val) => val.id),
        });
        this.useGetTableData();
      });
    },
    // 表格按钮点击
    onTableBtnClick(row, item) {
      // 提示
      if (item.type === 1) {
        this.useToggleDialog({
          visible: true,
          ...item.dialogState,
        });
        item.handle(row);
      } else if (item.type === 2) {
        this.$confirm(`确定要执行 ${item.name} 操作吗？`, " ", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          await item.handle(row);
          this.useGetTableData();
        });
      } else {
        item.handle(row);
      }
    },

    /*
      控制dialog
      @dialog: Object(dialog: {visible: boolen, title: string, width: string})
     */
    useToggleDialog(dialog = {}) {
      if (dialog.visible) {
        this.dialogState = dialog;
      } else {
        this.$set(this.dialogState, "visible", false);
      }
    },
    rHtml(row, item) {
      const { prop, options } = item;
      let html = "";
      if (options) {
        let Options = [];
        if (typeof options === "string") {
          Options = (this.Dictionaries[options] || []).map(
            ({ zidiandm, zidianz }) => ({
              label: zidianz,
              value: zidiandm,
            })
          );
        } else {
          Options = options;
        }
        let data = Options.filter(({ value }) => value == row[prop]);
        html = data.length ? data[0].label : "";
      } else {
        html = row[prop];
      }
      return html;
    },
  },
  components: {
    eHead,
  },
};
</script>

<style lang='scss' scoped>
._container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  & > ._header {
    flex-shrink: 0;
    margin: 10px 0 0 10px;
  }
  & > ._main {
    flex: 1;
    width: 100%;
    margin-top: 10px;
    cursor: pointer;
    overflow: hidden;
  }
  & > ._footer {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
}
</style>
