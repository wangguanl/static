var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


var generateUUID = require('./public/utils/unique');


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', '*');
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

var storage = multer.diskStorage({
	//destination：字段设置上传路径，可以为函数
	destination: function(req, file, cb) {
		cb(null, 'upload/');
	},
	//filename：设置文件保存的文件名
	filename: function(req, file, cb) {
		cb(null, new Date().getTime().toString() + generateUUID() + file.originalname.slice(file.originalname.lastIndexOf(
			'.')).toLocaleLowerCase());
	}
})

//设置过滤规则（可选）
var fileFilter = function(req, file, cb) {
	var acceptableMime = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'mp4', 'avi'];

	let suffix = file.originalname.slice(file.originalname.lastIndexOf('.') + 1).toLocaleLowerCase();
	if (acceptableMime.indexOf(suffix) !== -1) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

/* app.use(multer({
	dest: 'upload/'
}).any()); */

// 接收上传的文件
app.use(multer({
	storage,
	fileFilter,
	limits: {
		fieldSize: '50mb'
	}
}).any());

app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static('upload'))




app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
