<script>
const PickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      },
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      },
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      },
    },
  ],
};
import { mapGetters } from "vuex";
export default {
  inheritAttrs: false,
  computed: {
    // 全局字典
    ...mapGetters(["Dictionaries"]),
  },
  props: {
    head: {
      type: Object,
      required: true,
      default: () => ({
        options: [],
        btns: [],
      }),
      // 查询条件为必传项
      validator: (head) => Array.isArray(head.options),
    },
  },
  data() {
    return {
      parmas: {},
    };
  },
  methods: {
    onInput(key, val) {
      this.$set(this.parmas, key, val);
      this.onSearch(false);
    },
    onChange(key, val) {
      this.$set(this.parmas, key, val);
      this.onSearch();
    },
    onSearch(immediately = true) {
      this.$emit("search", { parmas: this.parmas, immediately });
    },
    onDelete() {
      this.$emit("deleteAll");
    },
    onBtnClick(val) {
      this.$emit("headBtnClick", { val, parmas: this.parmas });
    },
  },
  render(h, context) {
    // el-*的基本配置
    const config = {
      select: {
        props: {
          filterable: true,
          clearable: true,
        },
        /*
         * 两种类型使用
         * options为数组时， 直接使用
         * options为string时，意为key，使用全局字典，
         */
        children: (options) => {
          if (typeof options === "string") {
            options = (this.Dictionaries[options] || []).map(
              ({ zidiandm, zidianz }) => ({
                label: zidianz,
                value: zidiandm,
              })
            );
          }
          return options.map((item) => (
            <el-option
              key={item.value}
              label={item.label}
              value={item.value}
            ></el-option>
          ));
        },

        on: { event: "change", fn: this.onChange },
      },
      input: {
        props: {
          clearable: true,
        },
        on: { event: "input", fn: this.onInput },
      },
      "date-picker": {
        props: {
          "value-format": "yyyy-MM-dd",
        },
        type: {
          daterange: (item) => ({
            "range-separator": "-",
            "start-placeholder": item.label + "开始日期",
            "end-placeholder": item.label + "结束日期",
            "picker-options": PickerOptions,
          }),
          month: (item) => ({
            "value-format": "yyyy-MM",
          }),
        },
        on: { event: "input", fn: this.onChange },
      },
    };

    return (
      <div class="_flex _flex-items-center _e-head">
        {this.head.options.map((item) =>
          h(
            `el-${item.type}`,
            {
              props: {
                ...config[item.type].props,
                ...(config[item.type].type
                  ? item.props && item.props.type
                    ? config[item.type].type[item.props.type](item)
                    : {}
                  : {}),
                ...item.props,
                value: this.parmas[item.key],
              },
              attrs: {
                ...config[item.type].attrs,
                placeholder: `请${item.type === "input" ? "输入" : "选择"}${
                  item.label
                }`,
                title: `请${item.type === "input" ? "输入" : "选择"}${
                  item.label
                }`,
                ...item.attrs,
              },
              on: {
                [config[item.type].on.event]: (val) =>
                  config[item.type].on.fn(item.key, val),
              },
            },
            item.options ? config[item.type].children(item.options) : []
          )
        )}

        <el-button type="primary" onClick={this.onSearch}>
          查询
        </el-button>
        <el-button onClick={this.onDelete}>批量删除</el-button>
        {(this.head.btns || []).map((val, index) => (
          <el-button onClick={() => val.handle(this.parmas)}>
            {val.name}
          </el-button>
        ))}
      </div>
    );
  },
};
</script>
<style lang="scss" scoped>
._e-head {
  .el-input {
    width: auto;
  }
  & > *:not(:first-child) {
    margin-left: 10px;
  }
}
</style>
