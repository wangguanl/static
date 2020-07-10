const express = require('express'),
	router = express.Router(),
	sypath = require('path'),
	{
		uploadFilePath
	} = require(process.cwd() + '/public/config.js'),
	{
		generateFilePath
	} = require(process.cwd() + '/public/utils'),
	{
		sharpImg,
		generateImg,
		formatFile
	} = require('./utils.js');

// 上传文件
router.post('/upload', async function(req, res, next) {
	let imgs = [],
		others = [];
	req.files.forEach((file) => {
		if (['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].indexOf(file.mimetype) != -1) {
			imgs.push(file);
		} else {
			others.push(formatFile(file));
		}
	});
	let imgsData = await Promise.allSettled(imgs.map(file => sharpImg(file)))
	res.send({
		message: '上传成功',
		code: 200,
		result: [...imgsData, ...others]
	})
});


// 上传base64转化为文件
router.post('/uploadBase64', async function(req, res, next) {

	try {
		let {
			base64,
			min,
			query
		} = req.body;
		const file_url = generateFilePath();
		await generateImg(base64, file_url);
		res.send({
			message: '上传成功',
			code: 200,
			result: formatFile({}, {
				file_url,
				query
			})
		})
	} catch (err) {
		res.send({
			code: 500,
			message: '上传失败！'
		})
	}
})


router.get('/download', function(req, res, next) {
	let {
		fileUrl
	} = req.query;
	if (fileUrl) {
		res.download(uploadFilePath + decodeURI(fileUrl))
	} else {
		res.render('index', {
			title: 'Express'
		});
	}
})


module.exports = router;
