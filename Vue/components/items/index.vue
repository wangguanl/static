<template>
  <div>
    <div class="_item" v-for="obj in columns">
      <span
        class="label"
        :style="{ width: label.width }"
        :class="obj.tag === 'img' ? 'flex items-center' : ''"
        >{{ obj.label }}{{ label.ext }}</span
      >
      <div
        v-if="obj.tag === 'img'"
        :style="obj.style"
        :class="obj.class"
        class="flex center"
      >
        <img :src="fileBaseUrl + data[obj.key]" style="max-width: 100%" />
      </div>
      <div
        v-else-if="obj.tag === 'html'"
        :style="obj.style"
        :class="obj.class"
        v-html="data[obj.key]"
      ></div>
      <span
        v-else
        class="text"
        :title="data[obj.key] + (obj.ext || '')"
        :class="obj.class"
        :style="obj.style"
        >{{ data[obj.key] }}{{ obj.ext }}</span
      >
    </div>
  </div>
</template>

<script type="text/javascript">
import { fileBaseUrl } from "@/utils/baseUrl";
export default {
  props: {
    data: {
      required: true,
      type: Object,
    },
    columns: {
      required: true,
      type: Array,
    },
    label: {
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      fileBaseUrl,
    };
  },
};
</script>

<style type="text/css" lang="scss">
._item {
  display: flex;
  line-height: 26px;
  .label {
    color: #666;
    flex-shrink: 0;
  }
  .text {
    color: #222;
  }
}
</style>