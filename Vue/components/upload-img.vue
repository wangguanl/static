<template>
  <div class="main c-flex flex-wrap" ref="imgs-main">
    <div
      class="img-container"
      v-for="(img, fieldname) in imgs"
      :key="fieldname"
    >
      <div class="img-wrap c-flex center">
        <img class="img" :src="img.blob_url" @click="onPreviewImg(fieldname)" />
        <div v-show="img.status === 'loading'" class="c-flex center mark">
          <van-loading color="#fff" />
        </div>
        <div
          v-show="img.status === 'rejected'"
          class="c-flex center upload-btn mark"
        >
          <img src="@/assets/images/icon-reload.png" />
          <input
            type="file"
            accept="image/*"
            @change="onUploadFile($event, fieldname)"
          />
        </div>
      </div>
      <div class="remove" @click="onRemoveImg(fieldname)">
        <img src="@/assets/images/icon-remove.png" />
      </div>
    </div>
    <div class="upload-btn">
      <div class="c-flex center">
        <img src="@/assets/images/icon-upload.png" />
        <input
          type="file"
          multiple=""
          accept="image/*"
          @change="onUploadFile($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/config/fetch.js";
import { ip } from "@/config/fetch.js";
import { Dialog, ImagePreview } from "vant";
import Sortable from "sortablejs";
import generateUUID from "@/assets/js/unique.js";
export default {
  props: ["value"],
  data() {
    return {
      imgs: (() => {
        const Imgs = {};
        this.value.forEach(
          (item) =>
            (Imgs[item.fieldname] = {
              ...item,
              status: "fulfilled",
              blob_url: ip + item.thumbnail_file_url,
            })
        );
        return Imgs;
      })(),
    };
  },
  watch: {
    imgs(val) {
      this.$emit("input", Object.values(this.imgs));
    },
  },
  mounted() {
    Sortable.create(this.$refs["imgs-main"], {
      onEnd: (evt) => {
        //监听end事件 手动维护列表
        let tempArr = [...this.value];
        tempArr.splice(evt.newIndex, 0, tempArr.splice(evt.oldIndex, 1)[0]);
        this.$emit("input", tempArr);
      },
    });
  },
  methods: {
    onUploadFile(event, fieldnamekey) {
      const FileBuffer = new FormData();
      const Imgs = {};

      const Fieldnames = Array.from(event.target.files).map((file) => {
        let fieldname = fieldnamekey || generateUUID();
        FileBuffer.append(fieldname, file);
        // 生成本地图片url
        Imgs[fieldname] = {
          status: "loading",
          blob_url: URL.createObjectURL(file),
        };
        return fieldname;
      });
      this.imgs = {
        ...this.imgs,
        ...Imgs,
      };

      event.target.value = "";
      this.$nextTick().then(() => {
        axios
          .post(ip + "upload", FileBuffer, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((result) => {
            for (let fieldname in result) {
              Imgs[fieldname] = {
                ...this.imgs[fieldname],
                ...result[fieldname],
              };
            }
            this.imgs = {
              ...this.imgs,
              ...Imgs,
            };
          })
          .catch(() => {
            Fieldnames.forEach(
              (fieldname) => (Imgs[fieldname].status = rejected)
            );
            this.imgs = {
              ...this.imgs,
              ...Imgs,
            };
          });
      });
    },
    onRemoveImg(fieldname) {
      if (this.imgs[fieldname].status === "rejected") {
        this.$delete(this.imgs, fieldname);
      } else {
        Dialog.confirm({
          title: "",
          message: "确定要删除吗？",
        }).then(() => {
          this.$delete(this.imgs, fieldname);
        });
      }
    },
    onPreviewImg(fieldname) {
      ImagePreview({
        images: Object.values(this.imgs).map((val) => ip + val.file_url),
        startPosition: Object.keys(this.imgs).indexOf(fieldname),
      });
    },
  },
};
</script>

<style lang="scss">
.main {
  width: 100%;
  & > div {
    width: 33.3%;
    height: 18vh;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    &.img-container {
      .img-wrap {
        .img {
          max-height: 100%;
          max-width: 100%;
        }
        .mark {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
        }
      }
      .remove {
        height: 24px;
        width: 24px;
        position: absolute;
        top: -2px;
        right: -2px;
        background-color: #fff;
        border-radius: 50%;
        line-height: 1;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
    & > div {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
    }
  }
  .upload-btn {
    div {
      background: rgba(247, 248, 250, 1);
    }
    img {
      height: 32px;
      width: 32px;
    }
    input {
      width: 100%;
      height: 100%;
      font-size: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: transparent;
      opacity: 0;
    }
  }
}
</style>
