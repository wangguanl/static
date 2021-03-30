import tips from './tips';
var temp, instance;

function packing(config = {}, V, O) {
	let options = Object.assign({
		type: 'info',
		msg: ''
	}, config);

	// 判断是否存在这个loading
	if (document.getElementsByClassName('plugin-tips').length <= 0) {

		// 生成一个组件对loading进行复制，避免发生重复调用
		temp = V.extend(tips);

		// 生成loading的实例
		instance = new temp();

		// 将这个实例挂载在我创建的div上
		instance.$mount( document.createElement('div') );
		// 并将此div加入全局挂载点内部
		document.body.appendChild( instance.$el );
	}

	// 通过props传输
	instance.options = options;

}
export default packing;
