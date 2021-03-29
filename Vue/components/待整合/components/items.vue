<template>
  <div class="_wrap">
    <div class="_flex _flex-around" v-for="(arr, index) in items" :key="index">
      <div
        class="_flex _flex-items-center"
        v-for="item in arr"
        :key="item.label"
      >
        <span
          class="label"
          :style="{ width: parseFloat(item.width || width) + 'px' }"
          >{{ item.label }}</span
        >
        <img
          v-if="item.type === 'img'"
          v-show="datas[item.key]"
          style="width: 100px; height: 100px; margin-left: 10px"
          :src="
            datas[item.key]
              ? datas[item.key].indexOf(baseImgURL) !== -1
                ? datas[item.key]
                : baseImgURL + datas[item.key]
              : ''
          "
        />
        <div
          class="content"
          v-else
          :style="rHtml(item).style"
          v-html="rHtml(item).html"
        ></div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { baseImgURL } from "@/basics/baseURL";
import { mapGetters } from "vuex";
export default {
  computed: {
    // 全局字典
    ...mapGetters(["Dictionaries"]),
  },
  props: {
    // 后端数据
    datas: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 160,
    },
  },
  data() {
    return {
      baseImgURL,
    };
  },
  methods: {
    rHtml(item) {
      const { key, options } = item;
      const val =
        this.datas[key] &&
        (typeof this.datas[key] === "object"
          ? this.datas[key].value
          : this.datas[key]);
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
        let data = Options.filter(({ value }) => value == val);
        html = data.length ? data[0].label : "";
      } else {
        html = val;
      }
      return {
        style: this.datas[key] && this.datas[key].style,
        html,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
._wrap {
  & > div {
    width: 100%;
    & > div {
      width: 100%;
      padding: 10px 0;
      &:nth-child(even) {
        padding-left: 20px;
      }
      & > span.label {
        flex-shrink: 0;
        text-align: right;
      }
      & > div {
        margin-left: 10px;
        min-height: 43px;
        box-sizing: border-box;
        &.content {
          flex: 1;
          overflow: hidden;
          padding: 10px;
          border: 1px solid #dcdfe6;
          line-height: 1.5;
          border-radius: 5px;
          ::v-deep img {
            max-width: 100%;
          }
        }
      }
    }
  }
}
</style>
