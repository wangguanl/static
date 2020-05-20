import {
	ip,
	baseUrl
} from '@/utils/baseUrl';
import generateUUID from '@/utils/unique';
import arrDiff from '@/utils/arrDiff';
const imgSuffix = ['jpg',
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
	videoSuffix = ['AVI', 'MP4', 'WMV', 'MPEG', 'QuickTime', 'RealVideo', 'Flash', 'Mpeg-4']
export default {
	props: {
		accept: {
			default: '*', //文件格式	image/*, .jpg, .xlsx, .docx
		},
		multiple: {
			default: true, // 是否允许多选
		},
		limit: {
			default: 999, // 最大上传数
		},
		params: {

		},
		btns: {
			default: () => [1, 2],
			type: Array
		},

	},
	created() {

		this.uploadUrl = ip + 'upload';
		this.fileUrl = ip;
		this.uploadName = '';
		this.uploadData = {};

	},
	methods: {
		initData(data = []) {

			this.clearFiles();

			this.fileList = data.map(val => {
				let uid = generateUUID();
				return {
					name: val.file_name,
					url: this.fileUrl + val.file_url,
					uid,
					status: "success",
					percentage: 100,
					raw: {
						uid
					},
					response: {
						result: [Object.assign({}, val)]
					}
				}
			});
		},
		appendData(data = []) {
			let fileList = data.map(val => {
				let uid = val.uid;
				return {
					name: val.file_name,
					url: this.fileUrl + val.file_url,
					uid,
					status: "success",
					percentage: 100,
					raw: {
						uid
					},
					response: {
						result: [Object.assign({}, val)]
					}
				}
			});

			this.fileList = arrDiff([...this.fileList, ...fileList]);
			this.transmitData();

		},
		clearFiles() {
			this.$refs.upload.abort();
			this.$refs.upload.clearFiles();
		},
		// 拿到文件的type是计算机本地打开工具的获取类型， 如果无工具解析， 择type为空， 而且每个人使用的工具所返回的type可能不会相同， 所以不再使用type作为判断关键字。
		checkSuffix(file) {
			// ['*', 'image/*', '.jpg', '.xlsx', '.docx']
			let accept = this.accept ? Array.isArray(this.accept) ? this.accept : this.accept.split(',') : ['*'];

			if (accept.some(val => val === '*')) {
				return {
					checkSuffixFlag: false
				};
			}

			let names = file.name.split('.');
			// 文件后缀名 jpg pdf doc
			let suffix = names[names.length - 1].toLocaleLowerCase();

			let imageFlag = false;

			let suffixArr = accept.filter(val => {
				let suffixVal = val.toLocaleLowerCase();
				// image/*
				if (suffixVal === 'image/*') {

					imageFlag = true;

					return imgSuffix.some(val => val.toLocaleLowerCase() == suffix);

				} else if (suffixVal === 'video/*') {

					return videoSuffix.some(val => val.toLocaleLowerCase() == suffix);

				} else {

					if ('.' + suffix === suffixVal) {
						return suffixVal;
					}
				}
			})
			return ({
				checkSuffixFlag: true,
				suffixArr,
				imageFlag
			});
		},
		// 上传之前 判断文件类型
		before(file) {
			let {
				checkSuffixFlag,
				suffixArr,
				imageFlag
			} = this.checkSuffix(file);
			if (checkSuffixFlag && !suffixArr.length) {
				this.$message.error('请上传' + (imageFlag ? '图片' + this.accept : this.accept + '格式的文件'));
				return false;
			}
		},
		success(res, file, fileList) {
			if (res.code === 200) {
				this.$message.success('上传成功！');
				this.fileList = [...fileList];
				this.transmitData();
				return true;
			} else {
				this.fileList = fileList.filter(val => val.response.code === 200);
				this.$notify.error({
					title: '提示',
					message: '“' + file.name + '” 文件上传失败，请重新上传！<br>	' + res.msg,
					duration: 0,
					dangerouslyUseHTMLString: true,
				});
				return false;
			}
		},
		beforeRemove(file) {
			let {
				checkSuffixFlag,
				suffixArr,
				imageFlag
			} = this.checkSuffix(file);
			if (checkSuffixFlag && !suffixArr.length) {
				return;
			}
			return new Promise((resolve, reject) => {
				this.$confirm('确定要删除此文件吗！', '提示').then(_ => {
					resolve(true);
				}).catch(_ => {
					reject(false);
				});
			});
		},
		remove(file, fileList) {
			this.fileList = [...fileList];
			this.transmitData();
		},
		error(err, {
			name
		}) {
			this.$notify.error({
				title: '提示',
				message: '“' + name + '” 文件上传失败，请重新上传！',
				duration: 0
			});
		},
		// 文件超出个数限制时
		uploadMaxLength() {
			this.$message.error('最多上传' + this.limit + '个文件！');
		},

		transmitData(fileList) {
			console.log((fileList || this.fileList));
			(fileList || this.fileList).map(val => {
				console.log(val)
			});
			this.$emit('getFile', {
				datas: (fileList || this.fileList).map(val => val.response.result[0]),
				params: this.params
			});

		}
	},
}
