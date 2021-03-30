import Vue from 'vue';
import axios from 'axios';
import store from '../store';
import router from '../router';

import { Message as $message } from 'element-ui'
import verifyVar from './verifyVar';

let devUrl = 'http://115.29.111.135:82/';
// let devUrl = 'http://39.105.187.95:82/';

// let devPrintPageUrl = 'http://localhost:8081/';
let devPrintPageUrl = 'http://115.29.111.135/';

export const baseUrl = process.env.NODE_ENV === 'development' ? devUrl : location.origin + ':82/';

export const printPageUrl = process.env.NODE_ENV === 'development' ? devPrintPageUrl : location.origin;

location.origin === 'http://115.29.111.135' ? document.title="ERP（测试）" : '';

process.env.NODE_ENV === 'development' && devUrl === 'http://115.29.111.135:82/' ? document.title="ERP（本地测试）" : '';


/*
	axios请求配置
 */
const instance = axios.create({
	baseURL: baseUrl,
	timeout: 60000,
	headers: { 
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		'Accept': '*/*'
	},
});

let loadingDom = [];    // 存储loading动画dom

/* 终止重复请求 */
let cancelToken = axios.CancelToken;

// 发送请求前处理request的数据
instance.interceptors.request.use( config => {
	let token = store.getters.token;
	// 未登录 并且 不是登录接口
	if (!token && config.url.match('/member/sign') == null) {
		$message('请重新登录！');
		setTimeout( () => {
			router.replace('/login');
		}, 2000);
		return;
	}
	// 上传文件
	if ( config.headers['Content-Type'] === "multipart/form-data" ) {
		return config;
	}

	// 终止重复请求
	store.commit('REMOVE_PENGDING', config);
	config.cancelToken = new cancelToken((c)=>{
		// 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
		store.commit('SET_PENGDING', { u: (config.url +'&'+ config.method), f: c});
		
	});

	// 拦截器设置全局请求参数
	config.transformRequest = [function ({data, selecter} = {}) {
		if (typeof selecter === 'object') {
			let dom;
			// 验证是否为dom元素
			if (selecter.nodeType === 1 && typeof selecter.nodeName === 'string') {
				dom = selecter;
			} else if (selecter[0] && selecter[0].nodeType === 1 && typeof selecter[0].nodeName === 'string') {
				dom = selecter[0];
			} else {
				return;
			}
			
			let option = {
				target: dom,
				display: true,
				url: config.url +'&'+ config.method,	// 用url做唯一标识， 请求完成后进行loading删除
			}
			// 局部loading
			Vue.prototype.$loading(option);
			// 存储loading
			loadingDom.push(option);
		}
		for(let i in data) {
			if (verifyVar(data[i], 'Array')) {
				data[i] = JSON.stringify(data[i]);
			}
		}
		let sendDate = Object.assign({token}, data);
		let newData = '';
		for (let k in sendDate) {
			if (sendDate[k] == undefined) {
				sendDate[k] = '';
			}
			newData += encodeURIComponent(k) + '=' + encodeURIComponent(sendDate[k]) + '&';
		}
		return (newData.slice(0, -1));
	}];
	return config;
}, error => {
	closeLoading(error);
	return Promise.reject(error);
});

// 请求完成后进行数据处理
instance.interceptors.response.use( ({config, data}) => {

	//在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
	store.commit('REMOVE_PENGDING', config);
	
	// 已被其他人登录
	if (data.code == 403) {
		// 关闭页面所有的loading
		Vue.prototype.$loading();
		$message('账号已在其他地方登录，请重新登录');
		store.commit('LONGIN_OUT');
		/*setTimeout(_ => {
			location.reload();
		}, 1500);*/
		router.replace('/login');
		return;
	}

	// 关闭页面中局部的loading
	for (var i=0; i<loadingDom.length; i++) {
		if (loadingDom[i].url === (config.url +'&'+ config.method) ) {
			Vue.prototype.$loading({
				target: loadingDom[i].target,
				display: false
			});
			loadingDom.splice(i, 1); //把这条记录从数组中移除
		}
	}

	if ( data.code != 200 ) {
		$message.error(data.msg);
	}
	return Object.assign({}, data);

}, error => {
	if (error.message.code !== 200) {
		$message.error('网络错误！');
	}
	closeLoading(error);
	return Promise.reject(error);
});

function closeLoading (error) {

	// 手动抛异常 手动取消请求
	if (error.message && error.message.code == 200) {

		// 找到相对应的请求 然后终止
		/*for (var i=0; i<loadingDom.length; i++) {
			if (loadingDom.url === error.message.url) {
				Vue.prototype.$loading({
					target: loadingDom[i].target,
					display: false
				});
				loadingDom.splice(i, 1); //把这条记录从数组中移除
			}
		}
*/

	// 接口出错
	} else {

		// 关闭页面所有的loading
		Vue.prototype.$loading();

		$message.error('网络异常，请稍后重试');
		// 关闭全局的loading 动画
		store.commit('SET_ROUTERLONDING_STATUS');
		store.commit('SET_LEVELROUTERLONDING_STATUS');
	}
}


export default instance;