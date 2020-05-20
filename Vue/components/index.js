import erpTable from './erpTable';
import erpTableShow from './erpTable/tableShow';
import erpItems from './erpItems';
import erpUploadFile from './upload/uploadFile';

const plugins = {
	install (Vue, options = {}) {
		/*
			* 全局组件注册
			* 调用方式 <toast></toast>
		 */
		Vue.component('erpTable', erpTable);
		Vue.component('erpTableShow', erpTableShow);
		Vue.component('erpItems', erpItems);
		Vue.component('erpUploadFile', erpUploadFile);

	}
}
export default plugins;