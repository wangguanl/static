/*
    create by Mr.Wang 2018/03/30 16:00
    * 功能说明
        1、此文件只用于打包， 开发环境请自行配置。
        2、压缩CSS并且生成新的版本号
        3、压缩JS并且对es6+的语法转换为es5
        4、压缩HTML、img文件
        5、更多详情请看代码配置
    
    运行文件请先下载依赖模块：
    * 依赖模块由package.json存储，如果不存在package.json文件
        1、$ npm init（配置一路回车， 然后会生成package.json文件）
        2、$ npm install babel-core babel-plugin-transform-remove-strict-mode babel-preset-es2015 gulp gulp-htmlmin gulp-minify-css gulp-uglify gulp-babel gulp-imagemin imagemin-jpeg-recompress imagemin-optipng gulp-rev gulp-rev-collector gulp-filter --save-dev（执行此条命令下载所有依赖，并且package.json会记录所有依赖）
    
    * 存在package.json文件
        $ npm install
        如丢包现象严重发生，可以自行修改npm配置文件，或使用 $ npm install cnpm -g 下载cnpm模块， 执行$ cnpm install下载依赖模块。
    
    * 安装成功后出现node_modules，若想删除node_modules这个文件夹，可直接删除， 或下载rimraf模块
        1、$ npm|cnpm install -g rimraf  // 下载rimraf模块
        2、$ rimraf node_modules // 删除node_modules

    
    * 依赖模块安装成功后
        $ gulp 运行命令进行打包。

 */

/*
    文件路径配置
 */
const config = {
    enter: {    // 文件路径
        html: ['src/**/*.html'],

        css: ['src/**/*.css'],
        // cssMin: ['src/**/*.css', '!src/**/*.min.css', '!src/public/ext/layui/**/*.css', '!src/public/ext/layer_mobile/**/*.css', '!src/public/ext/font-awesome-4.7.0/**/*.css', '!src/public/ext/jquery/**/*.css', '!src/public/ext/jwplayer/**/*.css', '!src/public/ext/map/**/*.css', '!src/public/ext/mui/**/*.css', '!src/public/ext/rangeSlider/**/*.css', '!src/public/ext/webUploader/**/*.css'],    // 此列表文件不执行压缩
        cssMin: ['src/**/*.css', '!src/**/*.min.css', '!src/public/ext/**/*.css'],    // 此列表文件不执行压缩

        js: ['src/**/*.js'], 
        // jsMin: ['src/**/*.js', '!src/**/*.min.js', '!src/public/ext/layui/**/*.js', '!src/public/ext/layer_mobile/**/*.js', '!src/public/ext/font-awesome-4.7.0/**/*.js', '!src/public/ext/jquery/**/*.js', '!src/public/ext/jwplayer/**/*.js', '!src/public/ext/map/**/*.js', '!src/public/ext/mui/**/*.js', '!src/public/ext/rangeSlider/**/*.js', '!src/public/ext/webUploader/**/*.js', 'src/**/main.js', 'src/**/base.js'],   // 此列表文件不执行压缩
        jsMin: ['src/**/*.js', '!src/**/*.min.js', '!src/public/ext/**/*.js', '!src/public/canvas-renderer.js', '!src/public/projector.js', 'src/**/main.js', 'src/**/base.js', 'src/public/common/js/jquery-jqzoom.js', 'src/public/common/js/jquery-pin.js', 'src/public/common/js/jquery.SuperSlide.2.1.1.js'],   // 此列表文件不执行压缩

        img: ['src/**/*.{png,jpg,gif,jpeg,ico,woff,woff2}']
    },
    output: __dirname+'/dist',  // 打包路径,
    log:  __dirname+'/log'  // 打包的日志文件
}


var fs = require('fs'); // node内置模块 fileSystem
function removeDir(path) {  
    var files = [];  
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path);  
        files.forEach(function(file, index) {  
            var curPath = path + "/" + file;  
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                removeDir(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }  
        });  
        fs.rmdirSync(path);  
    }  
}
// 引入依赖模块
var gulp = require('gulp'),
    // 压缩html
    htmlMin = require("gulp-htmlmin"),

    // 压缩css，代替了只能压缩的 gulp-clean-css 模块， 此模块可进行配置
    cssMin = require('gulp-minify-css'), // 压缩css

    // 压缩js
    uglify = require('gulp-uglify'),
    babel = require("gulp-babel"),  // es6+转es5 需要配置规则（可生成.babelrc文件进行配置，也可在函数内配置。配置后请使用npm下载对应的插件）
    stripDebug = require('gulp-strip-debug'),   // 清除 console.log

    // 压缩图片
    imagemin = require('gulp-imagemin'),    
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),   // jpg图片压缩t
    imageminOptipng = require('imagemin-optipng'),  //png图片压缩

    // 对文件名加MD5后缀
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'), //路径替换
    filter = require('gulp-filter');    // 筛选文件

gulp.task('build', function () {
    removeDir( config.output );// 先删除打包路径，再打包
    removeDir( config.log );    // 先删除日志路径
    removeDir( 'revCss' );    // 先删除日志路径
    removeDir( 'revJs' );    // 先删除日志路径
    css();
});

// 压缩css 生成新版本css
function css() {
    let filterFile = filter(config.enter.cssMin, {restore: true});
    gulp.src( config.enter.css )
        .pipe(filterFile)    // 过滤不需要过滤的文件
        // 压缩css
        .pipe(cssMin({
            inline: ['remote'],
            advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(rev())    //文件名加MD5后缀
        .pipe(filterFile.restore)  // 返回到未过滤执行的所有文件
        .pipe(gulp.dest( config.output ))
        .pipe(rev.manifest('rev-css-manifest-log.json'))           //生成一个rev-manifest.json
        .pipe(gulp.dest( config.log ))  //将 rev-manifest.json 保存到 log 目录内
        .on('end', revCss);

}

// 替换新版本css路径
function revCss () {
    gulp.src(['log/rev-css-manifest-log.json', 'src/**/*.html'])  
        .pipe(revCollector({    //替换html中对应的记录 
            replaceReved:true
        }))                          
        .pipe(gulp.dest('revCss'))                 //输出到该文件夹中  
        .on('end', js);

}


// 压缩js 生成新版本
function js() {

    let filterFile = filter(config.enter.jsMin, {restore: true});
    gulp.src( config.enter.js)

        .pipe(filterFile)    // 过滤不需要过滤的文件
        
        .pipe(stripDebug()) // 清除console.log()

        // es6+转es5
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["transform-remove-strict-mode"]   // es6+ 转 es5 禁止使用 use strict(严格模式)
        }))

        // 压缩
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            //preserveComments: 'all' //保留所有注释
        }))
        .pipe(rev())    //文件名加MD5后缀
        .pipe(filterFile.restore)  // 返回到未过滤执行的所有文件
        .pipe(gulp.dest( config.output ))
        .pipe(rev.manifest('rev-js-manifest-log.json')) //生成一个rev-manifest.json
        .pipe(gulp.dest( config.log )) //将 rev-manifest.json 保存到 rev 目录内
        .on('end', revJs);

}

// 替换引用的新版本js路径
function revJs () {
    gulp.src(['log/rev-js-manifest-log.json', 'revCss/**/*.html'])  
        .pipe(revCollector({    //替换html中对应的记录 
            replaceReved:true,
        }))                          
        .pipe(gulp.dest('revJs'))                 //输出到该文件夹中  
        .on('end', html);
}

// 压缩html
function html() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src( 'revJs/**/*.html' )
        .pipe(htmlMin(options))
        .pipe(gulp.dest( config.output ))
        .on('end', img);

}


// 图片压缩任务, 主要支持JPEG及PNG文件
function img() {
    var jpgmin = imageminJpegRecompress({
            accurate: true, //高精度模式
            quality: "high", //图像质量:low, medium, high and veryhigh;
            method: "smallfry", //网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 70, //最低质量
            loops: 0, //循环尝试次数, 默认为6;
            progressive: false, //基线优化
            subsample: "default" //子采样:default, disable;
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 3 //优化级别
        });
    gulp.src( config.enter.img )
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest( config.output ))
        .on('end', function () {
            removeDir( config.log );  // 删除日志路径
            removeDir('revCss');    // 删除暂时生成css版本目录文件
            removeDir('revJs');     // 删除暂时生成js版本目录文件
            console.log('打包完成！');
        })
}

// $ gulp 执行所有命令
gulp.task('default', ['build']);



