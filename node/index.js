var express = require('express');
var router = express.Router();

const GenerateUUID = require('../public/utils/unique.js'),
	Sharp = require('sharp'),
	Imagemin = require('imagemin'),
	ImageminPngquant = require('imagemin-pngquant'),
	ImageminMozjpeg = require('imagemin-mozjpeg');

router.post('/upload', async function(req, res, next) {

	try {
		let imgs = [],
			others = [];
			
		req.files.forEach((file) => {
			let {
				originalname
			} = file;
			if (['jpeg', 'jpg', 'png', 'webp'].indexOf(originalname.slice(originalname.lastIndexOf('.') + 1).toLocaleLowerCase()) !=
				-1) {
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

		const SharpImage = Sharp(file.path);

		// 获取图片元信息
		const ImgMeta = await SharpImage.metadata();

		// 解决orientation方向错误的问题，并生成图片Buffer
		const ImgBuffer = await SharpImage.rotate().toBuffer();

		const ImgMinBuffer = await Imagemin.buffer(ImgBuffer, {
			plugins: [
				ImageminPngquant({
					quality: [0.6, 0.8]
				}),
				ImageminMozjpeg({
					quality: 65,
					progressive: true
				}),
			],
		})


		const Watermark = {
				input: 'watermark.png',
				gravity: 'southeast' // 从东南角，也就是右下角开始
			},
			ImgCopositeMinBuffer = await Sharp(ImgMinBuffer).composite([Watermark]).toBuffer(), // 生成水印图片Buffer

			// 生成裁剪图片加水印Buffer
			ImgThumbnailMinBuffer = await Sharp(ImgMinBuffer).resize({
				width: 200,
				height: 150
			}).composite([Watermark]).toBuffer();


		let filename = file.filename,
			uploadPath = 'upload/',
			file_url = uploadPath + 'min_' + filename,
			thumbnail_file_url = uploadPath + 'thumbnail_' + filename;

		Promise.all([
			Sharp(ImgCopositeMinBuffer).toFile(file_url), // 保存水印图片
			Sharp(ImgThumbnailMinBuffer).toFile(thumbnail_file_url), // 保存裁剪水印图片
		]).then(data => {
			let {
				format,
				width,
				height
			} = ImgMeta;
			resolve(formatFile(file, {
				file_url,
				thumbnail_file_url,
				file_meta: {
					format,
					width,
					height
				}
			}))
		}).catch(e => reject(e));

	})
}


function formatFile(file, obj = {}) {
	let file_name = file.originalname,
		path = file.path,
		suffix = file_name.slice(file_name.lastIndexOf('.') + 1).toLocaleLowerCase()
	return Object.assign({
		uid: GenerateUUID(),
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
