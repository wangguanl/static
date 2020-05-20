// 处理空字符串
export function strFormat (value, defaultVal) {
	if (value === null || value === undefined ||value === 'null' || value === 'undefined' || value === '' || value.length <= 0) {
		return defaultVal || '';
	} else {
		return value;
	}
}
// 去除两边空字符
export function trim (value, replaceVal) {
	return value.replace(/^\s+|\s+$/, replaceVal || "");
}
// 去除所有空字符
export function cleanEmpty (value, replaceVal) {
	return value.replace(/\s+/g, replaceVal || "");
}
// 小数点保留位数
export function intVal (value, len = 2) {
	return  value.toFixed(len);
}