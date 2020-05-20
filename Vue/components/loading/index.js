import dount from './dount.vue';

function packing ( {target, display} = {}, V, O) {
	// 有绑定元素
	if (target) {
		// 显示loading
		if (display || (typeof display === 'undefined')) {

			// 生成一个组件对loading进行复制，避免发生重复调用
			let temp = V.extend(dount);

			// 生成loading的实例
			let instance = new temp();

			// 将这个实例挂载在我创建的div上
			instance.$mount( document.createElement('div') );
			// 并将此div加入全局挂载点内部
			if ( !(target.style.position) ) {
				target.style.position = 'relative';
			}
			for (let i = 0, loading; loading = target.getElementsByClassName('_plugin-loading')[i++];) {
				loading.parentNode.removeChild(loading);
			}
			target.appendChild( instance.$el );

		} else {
			// 删除loading
			let loading = target.getElementsByClassName('_plugin-loading')[0];
			loading && loading.parentNode.removeChild(loading)
		}
	} else {
		// 不传入参数	清空页面所有loading
		for (let i = 0, loading; loading = document.getElementsByClassName('_plugin-loading')[i++];) {
			loading.parentNode.removeChild(loading);
		}
	}

}
export default packing;
