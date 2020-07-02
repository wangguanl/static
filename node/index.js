var express = require('express');
var router = express.Router();
var generateUUID = require('../public/utils/unique.js');
const Sharp = require('sharp'),
	Tinify = require("tinify");

Tinify.key = "6Mf5s28SQC8yHydFMtSFcdpDFswd0ssd";

router.post('/upload', async function(req, res, next) {
	try {
		let imgsMime = ['jpeg', 'jpg', 'png', 'webp'],
			imgs = [],
			others = [];
		req.files.forEach((file) => {
			let {
				originalname
			} = file;
			if (imgsMime.indexOf(originalname.slice(originalname.lastIndexOf('.') + 1).toLocaleLowerCase()) != -1) {
				imgs.push(file);
			} else {
				others.push(formatFile(file));
			}
		});

		let imgsData = await Promise.all(imgs.map(file => sharpImg(file)))

		res.send({
			msg: '上传成功',
			code: 200,
			data: [...imgsData, ...others]
		})
	} catch (e) {
		res.send({
			msg: '上传失败',
			code: 500,
			data: e
		})
	}
});

function sharpImg(file) {
	return new Promise(async (resolve, reject) => {

		let {
			filename,
			path,

		} = file;

		const Watermark = {
			input: 'watermark.png',
			gravity: 'southeast' // 从东南角，也就是右下角开始
		};

		const SharpImage = Sharp(path);

		const ImgMeta = await SharpImage.metadata(); // 图片元信息

		// 解决orientation方向错误的问题，并生成图片Buffer
		const ImgBuffer = await SharpImage.rotate().toBuffer();

		// 生成水印图片Buffer
		const ImgCopositeBuffer = await Sharp(ImgBuffer).composite([Watermark]).toBuffer();

		// 生成裁剪图片加水印Buffer
		const ImgResizeBuffer = await Sharp(ImgBuffer).resize({
			width: 200,
			height: 150
		}).composite([Watermark]).toBuffer();

		let toFiles = [],
			uploadPath = 'upload/',
			file_url = uploadPath + 'min_' + filename,
			thumbnail_file_url = uploadPath + 'thumbnail_' + filename;

		let {
			format,
			size,
			width,
			height
		} = ImgMeta;

		// Tinify仅压缩JPG和PNG两种格式
		if (['jpeg', 'jpg', 'png'].indexOf(format) != -1) {
			toFiles = [
				Tinify.fromBuffer(ImgCopositeBuffer).toFile(file_url), // 保存水印图片
				Tinify.fromBuffer(ImgResizeBuffer).toFile(thumbnail_file_url), // 保存裁剪水印图片
			]
		} else {
			toFiles = [
				Sharp(ImgCopositeBuffer).toFile(file_url), // 保存水印图片
				Sharp(ImgResizeBuffer).toFile(thumbnail_file_url), // 保存裁剪水印图片
			]
		}


		Promise.all(toFiles).then(data => resolve(formatFile(file, {
			file_url,
			thumbnail_file_url,
			file_meta: {
				format,
				size,
				width,
				height
			}
		}))).catch(e => reject(e));

	})
}

function formatFile(file, obj = {}) {
	let file_name = file.originalname,
		path = file.path,
		suffix = file_name.slice(file_name.lastIndexOf('.') + 1).toLocaleLowerCase()
	return Object.assign({
		uid: generateUUID(),
		file_meta: {},
		file_name,
		file_url: path,
		thumbnail_file_url: path,
		suffix
	}, obj);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
module.exports = router;
