import axios from 'axios';
import { Message, Loading } from 'element-ui';
import { baseUrl } from '@/utils/baseUrl';
import store from '@/store';

/*
	axios请求配置
 */
let instance = axios.create({
	baseURL: baseUrl,
	timeout: 60000,
	headers: {
		// 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' ,
		'Content-Type': 'application/json;charset=utf-8' ,
	},
});

let loadingInstance;
let tipsList = [];

/* 终止重复请求 */
let cancelToken = axios.CancelToken;

// 拦截器设置全局请求参数
instance.interceptors.request.use( config => {
	
	// 上传文件
	if ( config.headers['Content-Type'] === "multipart/form-data" ) {
		return config;
	}

	// 终止重复请求
	store.commit('REMOVE_PENGDING', config);
	config.cancelToken = new cancelToken((c)=>{
		// 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
		store.commit('ADD_PENGDING', { u: (config.url +'&'+ config.method), f: c});
	});
	
	let { tips, selecter } = config.data || {};
	if (selecter) {
		loadingInstance = Loading.service({target: selecter.$el ? selecter.$el : selecter});
	}
	
	// 处理数据
	config.transformRequest = [(data = {}) => {
		tipsList.push({
			url: config.url,	// 用url做唯一标识
			tips,
		})
		return JSON.stringify(data.data);
	}]

	config.transformResponse = [data => {
		let tips = tipsList.filter((val, index) => {
			if (val.url === config.url) {
				tipsList.splice(index, 1);
				return val;
			}
		})[0].tips;

		return Object.assign({ tips }, JSON.parse(data));

	}]
	return config;
	
}, error => {
	loadingInstance && loadingInstance.close();
	Message.error('程序错误！');
	return Promise.reject(error)
});

// 请求完成后 进行数据处理
instance.interceptors.response.use( ({data}) => {
		
	//在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
	// store.commit('REMOVE_PENGDING', config);

	loadingInstance && loadingInstance.close();
	if ( data.code == 200 ) {
		if (data.tips == true) {
			Message.success(data.message);
		}
		return Array.isArray(data.result) ? [...data.result] : Object.assign({}, data.result);
	} else {
		Message.error('程序错误！');
		return Promise.reject();
	}
}, error => {
	loadingInstance && loadingInstance.close();
	if (error.message.code !== 200) {
		Message.error('程序错误！');
		return Promise.reject(error);
	} else {
		return Promise.reject('手动终止请求');
	}
});


export default instance;