<script>
import { mapGetters } from "vuex";
export default {
  model: {
    prop: "form",
    event: "change",
  },
  props: {
    fetchFn: { type: Function || Boolean },
    form: {
      type: Object,
      default: () => ({}),
    },
    // 回显数据
    datas: {
      type: Object,
      default: () => ({}),
    },
    // 全部为必填项, 此时会忽略本身传入的rules
    required: {
      type: Boolean,
      default: false,
    },
    // 编辑时存在不可编辑项为只读状态
    disabled: {
      type: Boolean,
      default: false,
    },
    /*
      * 数据模型
      {
        label: '主题类型',  //
        type: 'select', // el-[type] 组件类型
        options,  // 为select时需要传入options创建 el-option 组件
        key: 'cccccc',  // 这个组件的 v-model 键值
        rules: true, // Boolean: 为true是为必填项; Array: form表单校验规则, 详情看el-form表单
      }
    */
    options: {
      type: Array,
    },

    // 接口额外参数
    added: {},

    // get形式传入params post传入data
    fntype: {
      type: String,
      default: "data",
      validator: (fntype) => ["params", "data"].indexOf(fntype) !== -1,
    },
    button: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // 全局字典
    ...mapGetters(["Dictionaries"]),
    // 校验规则
    rules() {
      const obj = {};
      const useRequiredRule = (val) => ({
        required: true,
        message: `请${val.type === "input" ? "输入" : "选择"}${val.label}`,
        trigger: val.type === "input" ? "blur" : "change",
      });
      if (this.required) {
        this.options.flat().forEach((val) => {
          let rules = val && Array.isArray(val.rules) ? [...val.rules] : [];
          obj[val.key] = [useRequiredRule(val), ...rules];
        });
      } else {
        this.options.flat().forEach((val) => {
          if (val && val.rules) {
            // 当为true时，设置为必填项
            if (typeof val.rules === "boolean") {
              obj[val.key] = [useRequiredRule(val)];
              // 按照规则设置rules
            } else {
              obj[val.key] = val.rules;
            }
          }
        });
      }
      return obj;
    },
  },
  mounted() {
    this.options
      .flat()
      .filter((val) => val && val.type === "tree")
      .forEach(
        (val) =>
          this.form[val.key] &&
          this.$refs[val.key].setCheckedKeys(this.form[val.key])
      );
  },
  render(h, context) {
    const onChange = (key, val) => {
      this.$set(this.form, key, val);
      this.$emit("change", this.form);
    };
    // el-*的基本配置
    const config = {
      select: {
        props: {
          filterable: true,
          clearable: true,
        },
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
        on: { event: "change", fn: onChange },
      },
      input: {
        props: {
          clearable: true,
        },
        type: {
          textarea: (item) => ({
            autosize: {
              minRows: 4,
              maxRows: 4,
            },
          }),
        },
        on: {
          event: "input",
          fn: (key, val) => {
            this.$set(this.form, key, val);
            this.$emit("change", this.form);
          },
        },
      },
      "date-picker": {
        props: {
          type: "date",
          "value-format": "yyyy-MM-dd",
        },
        on: { event: "input", fn: onChange },
      },
      tree: {
        props: {
          "show-checkbox": true,
          "node-key": "id",
        },
        on: {
          event: "check",
          fn: (key, checked, { checkedNodes }) => {
            this.$set(
              this.form,
              key,
              checkedNodes.filter((val) => val.id).map((val) => val.id)
            );
            this.$emit("change", this.form);
          },
        },
      },
      cascader: {
        props: {
          options: [],
        },
        on: {
          event: "change",
          fn: (key, arr) => {
            this.$set(this.form, key, arr[arr.length - 1]);
            this.$emit("change", this.form);
          },
        },
      },
    };

    return (
      <div ref="eForm" class="_flex _flex-column" style="height: 100%">
        <el-form
          ref="elForm"
          class="el-form"
          props={{ model: this.form, rules: this.rules }}
          inline={true}
          label-position="right"
          label-width="160px"
          style="flex:1; overflow: auto"
        >
          {this.options.map((arr) => {
            return (
              <div>
                {arr.map((item) => {
                  return item ? (
                    <el-form-item prop={item.key} label={item.label}>
                      {h(
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
                            value: this.form[item.key],
                          },
                          attrs: {
                            ...config[item.type].attrs,
                            placeholder: `请${
                              item.type === "input" ? "输入" : "选择"
                            }${item.label}`,
                            ...item.attrs,
                            disabled:
                              item.attrs && item.attrs.disabledAlways
                                ? true
                                : !this.disabled
                                ? false
                                : item.attrs && item.attrs.disabled,
                          },
                          ref: item.key,
                          on: {
                            [config[item.type].on.event]: (...arg) =>
                              config[item.type].on.fn(item.key, ...arg),
                            ...(item.props ? item.props.on : {}),
                          },
                        },
                        item.type === "select" && item.options
                          ? config[item.type].children(item.options)
                          : []
                      )}
                    </el-form-item>
                  ) : (
                    <div></div>
                  );
                })}
              </div>
            );
          })}
          {h("p", this.$slots.form)}
          {h("div", this.$slots.default)}
        </el-form>

        <div
          class="_flex _flex-center"
          style={{
            "margin-top": "20px",
            "flex-shrink": 0,
            display: this.button ? "none" : "flex",
          }}
        >
          <el-button
            type="primary"
            onClick={() => {
              this.$refs.elForm.validate((valid) => {
                if (valid) {
                  this.fetchFn
                    ? this.fetchFn({
                        selecter: this.$refs.eForm,
                        tips: true,
                        trans: "body",
                        [this.fntype]: { ...this.form, ...this.added },
                      }).then((data) => this.$emit("submit", data))
                    : this.$emit("submit");
                } else {
                  this.$message.warning("请检查表单内容是否符合规范");
                }
              });
            }}
          >
            保存
          </el-button>
          <el-button
            onClick={() => {
              // this.$refs.elForm.resetField();
              this.$refs.elForm.clearValidate();
              this.$emit("cancel");
            }}
          >
            取消
          </el-button>
        </div>
      </div>
    );
  },
};
</script>
<style lang="scss" scoped>
.el-form {
  & > div {
    @extend ._flex;
    @extend ._flex-around;
    @extend ._flex-items-center;
    & > div {
      width: 100%;
      flex: 1;
    }
  }
}
::v-deep.el-input .el-input__inner[readonly] {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
::v-deep .el-form-item {
  @extend ._flex;
  @extend ._flex-items-center;
  .el-form-item__label {
    flex-shrink: 0;
    line-height: unset;
  }
  .el-form-item__content {
    width: 100%;
    flex: 1;
    .el-select,
    .el-cascader,
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
}
._flex {
  display: flex;

  @at-root ._flex-center {
    justify-content: center;
    align-items: center;
  }

  @at-root ._flex-column {
    flex-direction: column;
  }

  @at-root ._flex-items-center {
    align-items: center;
  }

  @at-root ._flex-wrap {
    flex-wrap: wrap;
  }

  @at-root ._flex-around {
    justify-content: space-around;
  }

  @at-root ._flex-between {
    justify-content: space-between;
  }
}
</style>
