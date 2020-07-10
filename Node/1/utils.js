const {
	generateUUID,
} = require(process.cwd() + '/public/utils'), {
		uploadFilePath
	} = require(process.cwd() + '/public/config.js'),
	Sharp = require('sharp'),
	Syfs = require('fs');

const Watermark = {
	input: process.cwd() + '/routes/public/upload/watermark.png',
	gravity: 'southeast' // 从东南角，也就是右下角开始
};



/* 
	处理图片
	* 压缩
	* 旋转
	* 加水印
	* 裁剪
 */
function sharpImg(file) {
	return new Promise(async (resolve, reject) => {

		const SharpImage = Sharp(file.path);

		// 获取图片元信息
		const ImgMeta = await SharpImage.metadata();

		const MimeType = file.mimetype.split('/')[1];
		//  压缩文件，解决orientation方向错误的问题，并生成图片Buffer，
		const ImgBuffer = await SharpImage.rotate().toBuffer();


		const ImgMinBuffer = await compressImg({
			buffer: ImgBuffer,
			mimetype: MimeType,
		});

		// 二次压缩
		const ImgMiniBuffer = await compressImg({
			buffer: ImgMinBuffer,
			mimetype: MimeType,
			min: 40
		});


		const suffix = formatSuffix(file.originalname),
			source_file_url = generateFilePath('source', file.fieldname, suffix),
			file_url = generateFilePath('min', file.fieldname, suffix),
			thumbnail_file_url = generateFilePath('thumbnail', file.fieldname, suffix);


		Promise.all([
			Sharp(ImgMinBuffer).composite([Watermark]).toFile(source_file_url), // 保存原图水印图片
			Sharp(ImgMiniBuffer).composite([Watermark]).toFile(file_url), // 保存压缩水印图片
			Sharp(ImgMinBuffer).resize({
				width: 400,
			}).composite([{
				input: process.cwd() + '/routes/public/upload/watermark-min.svg',
				gravity: 'southeast' // 从东南角，也就是右下角开始
			}]).toFile(thumbnail_file_url), // 保存裁剪水印图片
		]).then(_ => {
			let {
				format,
				width,
				height
			} = ImgMeta;
			resolve(formatFile(file, {
				source_file_url,
				file_url,
				thumbnail_file_url,
				file_meta: {
					format,
					width,
					height
				}
			}))
		}).catch(e => reject(file));

	})
}

function generateFilePath(prefix, fieldname, suffix) {
	return uploadFilePath + (prefix ? prefix + '_' : '') + (new Date()).getTime().toString() + fieldname + suffix;
}

function generateImg(base64, file_url, mimetype = 'webp') {
	return Syfs.writeFileSync(file_url, (new Buffer).from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64'));
}

function compressImg({
	file,
	buffer,
	mimetype,
	min = 80,
	progressive = false
}) {
	const config = {
		jpg: {
			quality: min, //数字 质量，整数1-100（可选，默认80）
			progressive, //, // 布尔 使用渐进式（隔行）扫描（可选，默认false）
		},
		jpeg: {
			quality: min, //数字 质量，整数1-100（可选，默认80）
			progressive, //, // 布尔 使用渐进式（隔行）扫描（可选，默认false）
		},
		png: {
			compressionLevel: Math.ceil(min * 0.1), //数  zlib压缩级，0-9（可选，默认9）
			progressive, //布尔 使用渐进式（隔行）扫描（可选，默认false）
		},
		webp: {
			quality: min, //数字 质量，整数1-100（可选，默认80）
			lossless: progressive, //布尔 使用无损压缩模式（可选，默认false）
		}
	};
	if (file) {
		const MimeType = mimetype || file.mimetype.split('/')[1];
		return Sharp(file.path).rotate()[MimeType](config[MimeType]).toBuffer();
	}

	return Sharp(buffer)[mimetype](config[mimetype]).toBuffer();
}

function formatSuffix(originalname) {
	return originalname.slice(originalname.lastIndexOf('.')).toLocaleLowerCase();
}

/* 处理数据格式 */
function formatFile(file = {}, obj = {}) {
	const {
		fieldname,
		originalname,
		path
	} = file,
	suffix = originalname ? formatSuffix(originalname) : '';
	return Object.assign({
		uid: fieldname,
		file_meta: {},
		file_name: originalname,
		file_url: path,
		thumbnail_file_url: path,
		suffix
	}, obj);
}


module.exports = {
	sharpImg,
	generateImg,
	formatFile
}
