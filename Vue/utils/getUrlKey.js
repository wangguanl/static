/*
 *	传入键， 返回对应的值
 */
export function getUrlKey ( name ) {
	return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}

/*
 *	获取地址参数 方案1
 *	@url 可传入location.href ：?a=1&b=2&c=3&b=4 解析为对象
 */
export function parseQueryString ( url ) {
	var json = {};
	var arr = url.substr(url.indexOf('?') + 1).split('&');
	arr.forEach(item=>{
	var tmp = item.split('=');
		json[tmp[0]] = tmp[1];
	});
	return json;
}


/*
 *	获取地址参数 方案2
 *	@url 可传入location.href ：?a=1&b=2&c=3&b=4 解析为对象 {a:1, b:2, c:3, d:4}
 */
export function getURLParameters ( url ) {
	return url.match(/([^?=&]+)(=([^&]*))/g).reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {});
}


/*
 *	去除某一个值
 * 	@url 地址
 *	@key 去除值
 */
export function getUrltep ( url, key ) {
	let reg = new RegExp(`${key}=\\d*(&?)|(&?)${key}=\\d*`, 'g')
	return url.replace(reg, '');
}

/*
	传入对象 解析为 query
	@obj 对象
	@key 去除的key值
*/
export function getUrlquery (obj, key) {
	let queryString = '';
	for (let i in obj) {
		if (key && key !== i) {
			queryString += obj[i]+'&';
		}
	}
	return queryString.slice(0, -1);
}
