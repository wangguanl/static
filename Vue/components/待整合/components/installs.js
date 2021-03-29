import page from '@/views/components'
const EForm = () => new Promise((resolve) => import('@/views/components/eForm').then((item) => resolve(item)))
const items = () => new Promise((resolve) => import('@/views/components/items').then((item) => resolve(item)))
const history = () => new Promise((resolve) => import('@/views/components/history').then((item) => resolve(item)))
const files = () => new Promise((resolve) => import('@/views/components/files').then((item) => resolve(item)))
const uploadFile = () => new Promise((resolve) => import('@/components/upload/uploadFile').then((item) => resolve(item)))
const uploadPic = () => new Promise((resolve) => import('@/components/upload/uploadPic').then((item) => resolve(item)))
const tinymce = () => new Promise((resolve) => import('@/components/tinymce').then((item) => resolve(item)))
export default {
    comPage: page,
    comEForm: EForm,
    comItems: items,
    comFiles: files,
    comUploadFile: uploadFile,
    comUploadPic: uploadPic,
    tinymce,
    comHistory: history
}