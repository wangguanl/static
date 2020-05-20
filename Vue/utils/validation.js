import verifyVar from './verifyVar';
/*
 * 验证类型：身份证、邮箱、金额、数字、中文
 */
const rule = {
	// 验证身份证
	id: ({
		data
	}) => /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
			.test(data),
	
	// 数字
	number: ({
		data,
		config
	}) => config.integer ? /^[0-9]$/g.test(data) : /^([1-9]\d*|0)(\.\d{1,2})?$/.test(data),


	/*
	 * 验证非空验证
	 * 可验证类型： 数组、对象、字符串
	 */
	empty: ({
		data
	}) => (verifyVar(data, 'array') && data.length > 0) || ( verifyVar(data, 'string') && data.length > 0 ),

	// 验证邮箱
	email: ({
		data
	}) => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(data),

	// 验证日期
	date: ({
		data,
		config
	}) => {
		const format = {
			'YYYY-MM-DD': /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/, // 年-月-日
			'YYYY-MM-DD HH:MM': /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/, // 年-月-日 时:分
			'YYYY-MM-DD HH:MM:SS': /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/ // 年-月-日 时:分:秒
		};
		return format[Object.assign({
			format: 'YYYY-MM-DD'
		}, config).format.toLocaleUpperCase()].test(data);
	},

	// 验证汉字
	chinese: ({
		data
	}) => /^[\u4e00-\u9fa5]{0,}$/.test(data),

	money: ({
		data
	}) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(data),
	
	placeholder: () => true
};

function validation(datas) {
	if (datas.length <= 0) {
		return;
	}
	return new Promise((resolve, reject) => {

		let pass = datas.every(({
			type,
			data,
			config,
			success: succ,
			error: err
		}, index) => {
			let flag = rule[type]({
				data,
				config
			});
			flag ? succ && succ() : err && err();
			return flag;
		});
		pass ? resolve() : reject();
	})
}
export default validation;
