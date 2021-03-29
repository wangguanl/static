
JS {
	闭包 {
		闭包是指有权访问另一个函数作用域中变量的函数,
		创建毕宝德最常见的方式就是在一个函数 内创建另一个函数,
		通过另一个函数访问这个函数的局部变量,
		利用闭包可以突破作用域链,
		将函数内部变量和方法传递到外部。
		1. 函数内再嵌套函数
		2. 内部函数可以引用外层的参数和变量
		3. 参数和变量不会被垃圾回收机制回收
	}

	事件冒泡、 事件捕获、 事件委托 {
		联系： {
			(1)、 都是 事件触发时序问题 的术语。
				(2)、 绑定事件方法（ addEventListener） 的第三个参数是控制事件触发顺序的， 默认为false， 即事件冒泡； 若为true, 即事件捕获。
		}
		区别： {
			(1)、 事件冒泡： 从触发事件的那个节点一直到document， 是自下而上的去触发事件。
				(2)、 事件捕获： 从document到触发事件的那个节点， 即自上而下的去触发事件。
		}

		事件委托 {
			利用事件冒泡的原理。
			当有多个类似元素需要绑定事件时， 一个一个去绑定既浪费时间， 又不利于性能， 这时候可以使用事件委托， 给他们的一个共同父级元素添加一个事件函数去处理他们所有的事件情况。
		}
	}

	cookies {
		本地存储大小数据不超过4k
		存储至有效期
	}
	sesstionStorage {
		本地存储达到5M或者更大
		关闭浏览器后自动删除
	}
	localStorage {
		本地存储达到5M或者更大
		本地持久化存储
	}

	ES6 {
		let,
		const,
		数组对象解构赋值
		去重: Array.from(new Set(arr));
		浅拷贝: Object.assign({}, b);

		Promise {
			finally

			all
			allSettled
			race
			any
			resolve
			reject

			把嵌套改成链式调用
		}

		async／ await,
		将链式调用变得更加简化， 是因为 async 函数是 Generator 函数的语法糖， 容易理解， 而且和 promise 函数也有很大的关联

		generator 管理异步回调的执行流程。
	},


	{

		构造函数才有prototype(原型),
		prototype是向外抛出方法,
		让实例调用,
		obj.fn;

		var obj = new FN();创建实例
		obj.__proto__ 指向 FN(构造函数) 的prototype(原型)
		obj.constructor 指向 FN(构造函数)
		obj.prototype;实例是没有prototype属性的
	}
}






项目常见问题 {

	CSS

	1、 CSS动画页面闪白, 动画卡顿
	问题描述： CSS动画页面闪白, 动画卡顿
	解决方法: 1. 尽可能地使用合成属性transform和opacity来设计CSS3动画， 不使用position的left和top来定位 2. 开启硬件加速 {
		-webkit - transform: translate3d(0, 0, 0); -
		moz - transform: translate3d(0, 0, 0); -
		ms - transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
	}

	2、 在 iOS 上， 输入框默认有内部阴影
	input {
		-webkit - appearance: none;
	}

	3、 微信公众号用户自动设置的字体大小会打乱布局， 通过css设定body属性禁止改变字体大小
	body {
		-webkit - text - size - adjust: 100 % !important;
		text - size - adjust: 100 % !important; -
		moz - text - size - adjust: 100 % !important;
	}

	4、 部分android系统点击一个链接， 会出现一个边框或者半透明灰色遮罩, 不同生产商定义出来额效果不一样
	a, button, input, textarea {
		-webkit - tap - highlight - color: rgba(0, 0, 0, 0); -
		webkit - user - modify: read - write - plaintext - only;
	}

	5、 IOS滑动页面不流畅
	body {
		-webkit - overflow - scrolling: touch;
	}

	6、 1 px宽高
		.border1px {
			position: relative;border: none; &
			: before {
				content: "";
				display: block;
				position: absolute;
				bottom: 0 px;
				left: 0 px;
				width: 100 % ;
				height: 1 px;
				transform: scale(0.5, 1);
				background: #ddd;
			}
		}

	7、 浏览器自动填充表单背景色
	input: -webkit - autofill {
		background: inhert;
		color: inhert;
	}


	JS

	6、 移动端点击事件300毫秒延迟
	1. 引入fastclick.js
	2. click事件

	7、 iOS 上拉边界下拉出现空白
	问题描述： 手指按住屏幕下拉， 屏幕顶部会多出一块白色区域。 手指按住屏幕上拉， 底部多出一块白色区域。
	产生原因： 在 iOS 中， 手指按住屏幕上下拖动， 会触发 touchmove 事件。 这个事件触发的对象是整个 webview 容器， 容器自然会被拖动， 剩下的部分会成空白。

	document.body.addEventListener(
		'touchmove',
		function(e) {
			if (e._isScroller) return
			// 阻止默认事件
			e.preventDefault()
		}, {
			passive: false
		}
	)

	8、 ios 日期转换 NAN 的问题
		'yyyy-MM-dd'.replace(/-/g, '/')

	9、 软键盘问题
	iOS 系统中文输入法输入英文时， 字母之间可能会出现一个六分之一空格
	解决方式： 可以通过正则去掉

	this.value = this.value.replace(/\u2006/g, '');

	10、 IOS 键盘弹起挡住原来的视图
	解决方式：
	可以通过监听移动端软键盘弹起
	Element.scrollIntoViewIfNeeded（ Boolean） 方法用来将不在浏览器窗口的可见区域内的元素滚动到浏览器窗口的可见区域。 如果该元素已经在浏览器窗口的可见区域内， 则不会发生滚动。
	true， 则元素将在其所在滚动区的可视区域中居中对齐。
	false， 则元素将与其所在滚动区的可视区域最近的边缘对齐。 根据可见区域最靠近元素的哪个边缘， 元素的顶部将与可见区域的顶部边缘对准， 或者元素的底部边缘将与可见区域的底部边缘对准。

	window.addEventListener('resize', function() {
		if (
			document.activeElement.tagName === 'INPUT' ||
			document.activeElement.tagName === 'TEXTAREA'
		) {
			window.setTimeout(function() {
				if ('scrollIntoView' in document.activeElement) {
					document.activeElement.scrollIntoView(false)
				} else {
					document.activeElement.scrollIntoViewIfNeeded(false)
				}
			}, 0)
		}
	})
}


优化 {
	CSS基础优化 {
		将样式表放到页面顶部
		不使用CSS表达式
		不使用 @import
	}

	vue首屏优化 {
		1、 路由异步加载
		2、 组件按需加载
		3、 骨架屏(饿了么开源)
	}

}

Question {
	typeof {
		只能判断基本类型和引用类型,
		无法得知更具体的类型。
	}
	instanceof {
		instanceof相当于 arr.constructor,把要判断的类型指向构造函数,看是否一致,但是再不同的作用域指针会出现不相等,因为作用域指针不相等
	}
	
	new 这一下发生了什么{
		创建一个新对象,将自身的属性和方法赋给了this对象,将这个对象return.
		
	}

	es6{
		增加了块级作用域、模块的概念,
		手写一个promise {
			function Promise(exector) {
				let self = this;
				//status表示一种状态
				let status = "pending";
				let value = undefined;
				let reason = undefined;
				//成功执行
				function resolve(value) {
					if (status == 'pending') {
						self.value = value;
						self.status = "resolve";
					}
				}
				//执行失败
				function reject(reason) {
					if (status == 'pending') {
						self.reason = reason;
						self.status = "reject"
					}
				}
				//对异常操作
				try {
					exector(resolve, reject)
				} catch (e) {
					reject(e)
				}
				//设置promise的then方法
				Promise.prototype.then = function(reject, resolve) {
					let self = this;
					if (this.status == 'resolve') {
						reject(self.value)
					}
					if (this.status == 'reject') {
						resolve(self.reason)
					}
				}
			}
			//new 一个promise  进行测试  
			let promise = new Promise((reject, resolve) => {
				resolve("return resolve");
			});
			promise.then(data => {
				console.log(`success${data}`);

			}, err => {
				console.log(`err${err}`);

			})
		}

	}
	
	ajax和axios的区别{
		
		axios 是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生XHR的封装，只不过它是Promise的实现版本，符合最新的ES规范，它本身具有以下特征：
		1.从浏览器中创建 XMLHttpRequest
		2.支持 Promise API
		3.客户端支持防止CSRF
		4.提供了一些并发请求的接口（重要，方便了很多的操作）
		5.从 node.js 创建 http 请求
		6.拦截请求和响应
		7.转换请求和响应数据
		8.取消请求
		9.自动转换JSON数据
		PS:防止CSRF:就是让你的每个请求都带一个从cookie中拿到的key, 根据浏览器同源策略，假冒的网站是拿不到你cookie中得key的，这样，后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略。
	}
	
	聊聊vue{
		https://juejin.im/post/6850037277675454478#heading-1
	}
	MVC与MVVM

	闭包
	图解http

	一个页面从输入url到页面加载显示完成发生了什么: {

			1、 域名解析,
			获取IP地址
			2、 浏览器向服务器发起tcp连接,
			与浏览器建立tcp三次握手
			3、 握手成功后， 浏览器向服务器发送http请求数据包。
			4、 服务器处理收到的请求， 将数据返回至浏览器
			5、 浏览器收到HTTP响应
			6、 浏览器渲染页面,
			生成dom树、 解析css样式、 js交互
		},

		HTTP和HTTPS {
			HTTP协议通常程在于TCP之上,
			在HTTP和TCP之间添加一个安全协议层(SSL或TSL)。
			HTTP默认端口是80
			HTTPS默认端口是443

			为什么HTTPS安全: 因为网络请求中间有很多服务器路由器转发,
			中间节点都可能被篡改信息,
			而如果使用HTTPS,
			密钥在你和服务器站才会有。 https使用ssl、 tls协议传输,
			他包含证书、 卸载、 流量转发、 负载均衡、 页面适配、 浏览器适配、 refer传递等,
			保障传输过程的安全性。
		}

	大方向: 优化,

		vue的好处

}



人事问题 {
	离职原因: 1、 没有工作交接
	2、 没有研发流程 {
		没有需求会,
		需求讨论,
		需求评估,
	}
	不了解需求就开始工作,
	工作模式就是摸黑干活,

	加班话题: 干这行哪有不加班的,
	但是看公司加班情况是什么样子的,
	如果因为公司发展需要,
	没有问题。,
	最近在学习什么东西 {
		1、 烹饪, 在会做饭的基础上, 再提高一下手艺。
		2、 看比较有深度书和电影, 让自己的提升高度, 知道的更多, 更善于独立思考。
		3、 锻炼, 骑行, 跑步
		基本上德智体美劳全面发展, 所做的事情倾向于一代教父口中男人该有的样子:
	}

}

MQ {
	公司薪资结构是什么样子的;

}

技术研发 {


	小程序
	Vue
	Angular
	React
	Webpack
	独立解决问题的能力。
}
