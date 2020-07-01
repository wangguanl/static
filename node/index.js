var express = require('express');
var router = express.Router();
var generateUUID = require('../public/utils/unique.js');
const sharp = require('sharp'),
	fs = require('fs'),
	sypath = require('path'),
	tinify = require("tinify");

tinify.key = "6Mf5s28SQC8yHydFMtSFcdpDFswd0ssd";


router.post('/upload', async function(req, res, next) {
	try {
		let data = await Promise.all(req.files.map(file => compress(file)))
		res.send({
			msg: '上传成功',
			code: 200,
			data
		})
	} catch (e) {
		res.send({
			msg: '上传失败',
			code: 500,
			data: e
		})
	}
});


function compress(file) {
	return new Promise(async (resolve, reject) => {

		let {
			filename,
			mimetype,
			path,
			originalname
		} = file;

		let suffix = originalname.slice(originalname.lastIndexOf('.')).toLocaleLowerCase();



		let uploadPath = 'upload/',
			watermark_file_url = uploadPath + 'watermark_' + filename,
			min_file_url = uploadPath + 'min_' + filename,
			thumbnail_file_url = uploadPath + 'thumbnail_' + filename;

		await sharp(path)
			.composite([{
				input: 'watermark.png',
				gravity: 'southeast' // 从东南角，也就是右下角开始
			}])
			.toBuffer()
			.then(async watermarkBuffer => {
				// console.log(watermarkBuffer)
				const sendData = {
					uid: generateUUID(),
					file_name: originalname,
					suffix
				}

				// tinify仅压缩JPG和PNG两种格式
				if (['jpeg', 'jpg', 'png'].indexOf(suffix.substr(1))) {

					try {
						await tinify.fromBuffer(watermarkBuffer).toFile(min_file_url);
						await tinify.fromFile(min_file_url).resize({
							method: "thumb",
							width: 200,
							height: 150
						}).toFile(thumbnail_file_url);

						resolve(Object.assign({
							file_url: min_file_url,
							thumbnail_file_url,
						}, sendData))
					} catch (e) {
						reject(e);
					}

				} else {
					fs.writeFile(watermark_file_url, watermarkBuffer, function(err) {
						if (err) {
							reject(err)
						} else {
							resolve(Object.assign({
								file_url: watermark_file_url,
								thumbnail_file_url: watermark_file_url,
							}, sendData))
						}
					})
				}
			}).catch(e => reject(e))

	})
}


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
module.exports = router;
