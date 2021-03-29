<template>
  <el-popover trigger="click" style="margin-left: 10px">
    <el-button slot="reference" type="text" size="small" @click="useGetFn">{{
      name
    }}</el-button>
    <el-select
      style="width: 150px"
      v-model="selectId"
      placeholder="请选择"
      @change="onChangeHistory"
    >
      <el-option
        v-for="obj in options"
        :key="obj.value"
        :label="obj.label"
        :value="obj.value"
      >
      </el-option>
    </el-select>
  </el-popover>
</template>

<script>
export default {
  props: {
    // 按钮名称
    name: String,

    // 请求函数
    fetchFn: Function,
    // 函数发送数据
    datas: {},
    // options的 value 和 label 关键字
    option: Object,
  },
  data() {
    return {
      selectId: "",
      options: [],
    };
  },
  methods: {
    // 获取历史记录
    async useGetFn() {
      if (!this.options.length) {
        const history = await this.fetchFn({
          data: this.datas,
        });
        const { label, value } = this.option;
        this.options = history.map((val) => ({
          ...val,
          label: val[label],
          value: val[value],
        }));
      }
    },
    // 选择历史记录
    onChangeHistory() {
      this.$emit(
        "change",
        this.options.filter(
          (val) => val[this.option.value] === this.selectId
        )[0]
      );
      this.selectId = "";
    },
  },
};
</script>

<style>
</style>