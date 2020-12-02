import {
  baseImgURL
} from '@/basics/baseURL'
import generateUUID from '@/utils/unique'
import Sortable from 'sortablejs'

const TypeSuffix = {
  'image/*': [
    'jpg',
    'jpeg',
    'gif',
    'png',
    'bmp',
    'webp',
    'svgz',
    'xbm',
    'tif',
    'pjp',
    'pjpeg',
    'ico',
    'tiff',
    'svg',
    'jfif'
  ],
  'video/*': ['AVI', 'MP4', 'WMV', 'MPEG', 'QuickTime', 'RealVideo', 'Flash', 'Mpeg-4']
}

export default {
  props: {
    value: {},
    accept: {
      type: Array,
      default: () => ['*'] // 文件格式	image/*, .jpg, .xlsx, .docx
    },
    multiple: {
      default: true // 是否允许多选
    },
    limit: {
      default: 999 // 最大上传数
    },
  },
  data() {
    return {
      uploadUrl: baseImgURL + '/upload',
      fileUrl: baseImgURL + '/',
      fieldname: generateUUID(),
      uploadData: {},
      uploadHeader: {

      },
      // 仅处理组件数据展示
      fileList: (() => this.value.map(
        (item) => ({
          uid: generateUUID(),
          blob_url: this.fileUrl + item.thumbnail_file_url,
          name: item.file_url,
          percentage: 100,
          status: 'success',
          raw: {},
          response: {
            message: '上传成功',
            code: 200,
            result: item
          }
        })
      ))(),
      beforeFileListLength: 0
    }
  },
  watch: {
    fileList() {
      this.$emit('input', this.fileList.map(val => Object.values(val.response.result)[0]))
    }
  },
  mounted() {
    if (this.$refs.upload.$el.querySelector('.el-upload-list')) {
      Sortable.create(this.$refs.upload.$el.querySelector('.el-upload-list'), {
        onEnd: evt => {
          const tempArr = [...this.value]
          tempArr.splice(evt.newIndex, 0, tempArr.splice(evt.oldIndex, 1)[0])
          this.$emit('input', tempArr)
        }
      })
    }
  },
  methods: {
    useClearFiles() {
      this.$refs.upload.abort()
      this.$refs.upload.clearFiles()
    },
    useCheckUploadStatus() {
      return this.beforeFileListLength === this.fileList.length
    },
    // 上传之前 判断文件类型
    onBeforeUpload(file) {
      // 如果存在 *(任意类型) 则不校验类型
      let acceptResult
      if (this.accept.some(val => val === '*')) {
        acceptResult = true
      } else {
        const names = file.name.split('.')
        // 文件后缀名 jpg pdf doc
        const suffix = names[names.length - 1].toLocaleLowerCase()
        acceptResult = this.accept.some(val => {
          const typeSuffix = val.toLocaleLowerCase()
          // 根据已定义类型后缀进行判断
          return TypeSuffix[typeSuffix] ? TypeSuffix[typeSuffix].some(val => val.toLocaleLowerCase() === suffix) : ('.' + suffix === typeSuffix)
        })
        if (!acceptResult) {
          this.$message.error('请上传' + this.accept.toString() + '格式的文件')
        }
      }
      return acceptResult
    },
    onChange(file, fileList) {
      this.beforeFileListLength = fileList.length
    },
    onSuccess(res, file, fileList) {
      const {
        code,
        result
      } = res
      if (code === 200) {
        this.fileList = [...fileList]
        if (Object.values(result)[0].status !== 'fulfilled') {
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].uid === file.uid) {
              this.fileList.splice(i, 1)
            }
          }
          this.$notify.error({
            title: '提示',
            message: '“' + file.name + '” 文件上传失败，请重新上传！<br>	',
            duration: 0,
            dangerouslyUseHTMLString: true
          })
        }
      }
    },
    onBeforeRemove(file) {
      return new Promise((resolve, reject) => this.$confirm('确定要删除此文件吗！', '提示').then(() => resolve(file)).catch(() => reject()))
    },
    onRemove(file) {
      this.fileList.splice(this.fileList.indexOf(file), 1)
    },
    // 文件超出个数限制时
    onExceed() {
      this.$message.error('最多上传' + this.limit + '个文件！')
    },
    onError(err, file) {
      console.log(err)
      this.$notify.error({
        title: '提示',
        message: '“' + file.name + '” 文件上传失败，请重新上传！',
        duration: 0
      })
    }
  }
}