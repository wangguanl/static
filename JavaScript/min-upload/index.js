const imgArr = [];
// 初始化Web Uploader
var uploader = WebUploader.create({

	// 选完文件后，是否自动上传。
	auto: true,

	// swf文件路径
	swf: '/assets/libs/other/Uploader.swf',

	// 文件接收服务端。
	server: uploadUrl,

	pick: '#filePicker',
	accept: {
		title: 'Images',
		mimeTypes: 'image/*'
	},
	duplicate: true

});

// 当有文件添加进来的时候
uploader.on('fileQueued', function(file) {


	var Orientation = 0;
	var fileExif = file.source.source;
	var fileName = fileExif.name;
	var newFile = null;

	EXIF.getData(file.source.source, function() {
		Orientation = EXIF.getTag(this, 'Orientation');
		if (fileExif && Orientation > 1) {
			//获取照片方向角属性，用户旋转控制
			console.log(Orientation);
			var oReader = new FileReader();
			oReader.readAsDataURL(fileExif);

			oReader.onload = function(e) {
				var image = new Image();
				image.src = e.target.result;
				image.onload = function() {
					var expectWidth = this.naturalWidth;
					var expectHeight = this.naturalHeight;

					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					canvas.width = expectWidth;
					canvas.height = expectHeight;
					ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
					var base64 = null;
					//修复ios
					if (navigator.userAgent.match(/iphone/i)) {
						console.log('iphone');
						if (Orientation != "" && Orientation != 1) {
							switch (Orientation) {
								case 6:
									rotateImg(this, 'left', canvas);
									break;
								case 8:
									rotateImg(this, 'right', canvas);
									break;
								case 3:
									rotateImg(this, 'right', canvas); //转两次
									rotateImg(this, 'right', canvas);
									break;
							}
						}
						base64 = canvas.toDataURL(fileExif.type, 1);
					} else if (navigator.userAgent.match(/Android/i)) { // 修复android
						var encoder = new JPEGEncoder();
						base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);
					} else {
						if (Orientation != "" && Orientation != 1) {
							switch (Orientation) {
								case 6:
									rotateImg(this, 'left', canvas);
									break;
								case 8:
									rotateImg(this, 'right', canvas);
									break;
								case 3:
									rotateImg(this, 'right', canvas); //转两次
									rotateImg(this, 'right', canvas);
									break;
							}
						}
						base64 = canvas.toDataURL(fileExif.type, 1);
					}
					var baseFile = dataURLtoFile(base64, fileName);
					newFile = baseFile;
					file.source.source = newFile;
					addFile(file);
				};
			};
		} else {
			addFile(file);
		}
	});
});


function addFile(file) {

	$('.imgList').append(
		`<li data-id="${file.id}">
			<div class="remark"></div>
			<div class="loading">
				<div class="donut"></div>
			</div>
			<div class="close"></div>
		</li>`
	);

	var $img = document.createElement('img');
	uploader.makeThumb(file, function(error, src) {
		$img.src = src;
	});

	$(`li[data-id="${file.id}"]`).prepend($img);
}

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on('uploadSuccess', function(file, res) {
	$('.imgList li[data-id="' + file.id + '"]').children('.loading').remove();
	$('.imgList li[data-id="' + file.id + '"]').children('.close').show();
	imgArr.push(Object.assign({
		id: file.id
	}, res.data[0]));
});

// 文件上传失败，显示上传出错。
uploader.on('uploadError', function(file) {
	alert('网络异常');
	$('.imgList li[data-id="' + file.id + '"]').remove();
});

// 完成上传完了，成功或者失败，先删除进度条。
uploader.on('uploadComplete', function(file) {
	// $('input').val('');
});

/* 删除已上传的照片 */
$('.imgList').on('click', '.close', function() {
	var index = $(this).parent().index();
	imgArr.splice(index, 1);
	$(this).parent().remove();
});


/* 添加备注 */
$('.imgList').on('click', '.remark', function() {
	var index = $(this).parent().index();
	var remark = prompt('请输入备注');
	$(this).text(remark)
	imgArr[index].remark = remark;
});


$('#submitBtn').on('click', function() {
	if (confirm('确定上传这些图片吗？')) {
		var sendData = {
			picId: getUrlKey('picId'),
			pics: JSON.stringify(imgArr)
		}
		$.send({
			url: '/picLibrary',
			data: sendData,
			loading: $('body'),
			success(res) {
				tips({
					type: 'success',
					msg: '添加成功！',
				})
			}
		})
	}
});

function dataURLtoFile(dataurl, filename) { //将base64转换为文件
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {
		type: mime
	});
}

function rotateImg(img, direction, canvas) {
	//alert(img);
	//最小与最大旋转方向，图片旋转4次后回到原方向
	var min_step = 0;
	var max_step = 3;
	//var img = document.getElementById(pid);
	if (img == null) return;
	//img的高度和宽度不能在img元素隐藏后获取，否则会出错
	var height = img.height;
	var width = img.width;
	//var step = img.getAttribute('step');
	var step = 2;
	if (step == null) {
		step = min_step;
	}
	if (direction == 'right') {
		step++;
		//旋转到原位置，即超过最大值
		step > max_step && (step = min_step);
	} else {
		step--;
		step < min_step && (step = max_step);
	}
	//旋转角度以弧度值为参数
	var degree = step * 90 * Math.PI / 180;
	var ctx = canvas.getContext('2d');
	switch (step) {
		case 0:
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0);
			break;
		case 1:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, 0, -height);
			break;
		case 2:
			canvas.width = width;
			canvas.height = height;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, -height);
			break;
		case 3:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, 0);
			break;
	}
}