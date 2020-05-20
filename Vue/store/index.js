import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
	const value = modulesFiles(modulePath);
	modules[moduleName] = value.default;
	return modules;
}, {});

const store = new Vuex.Store({
	state: {
		loginStatus: false,
		userinfo: {},

		moduleLoadingStatus: false, // 模块loading

		functionLoadingStatus: false, // 模块功能loading

		// 用于存储每个ajax请求的取消函数和ajax标识
		pending: []
	},
	getters: {
		loginStatus: state => state.loginStatus, // 获取信息
		
		userinfo: state => state.userinfo, // 获取信息

		moduleLoadingStatus: state => state.moduleLoadingStatus, // 路由跳转时显示loading

		functionLoadingStatus: state => state.functionLoadingStatus, // 路由跳转时显示loading

		pending: state => state.pending, // 全局请求记录缓存
	},
	mutations: {
		SetLoginStatus(state, status) {
			state.loginStatus = status;
		},
		
		SetUserInfo: (state, userinfo) => {
			localStorage.userinfo = JSON.stringify(Object.assign({}, userinfo));
			state.userinfo = Object.assign({}, userinfo);
		},

		// 模块路由跳转时设置 全局 loading状态
		SetModuleLoadingStatus: (state, status = false) => {
			state.moduleLoadingStatus = status;
		},
		// 模块功能路由跳转时设置 全局 loading状态
		SetFunctionLoadingStatus: (state, status = false) => {
			state.functionLoadingStatus = status;
		},

		// 存储每个ajax请求的取消函数和ajax标识
		ADD_PENGDING: (state, pending) => {
			state.pending.push(pending)
		},
		// 删除重复对应的ajax请求的取消函数和ajax标识
		REMOVE_PENGDING: (state, pending) => {
			for (let p in state.pending) {
				if (state.pending[p].u === (pending.url + '&' + pending.method)) { //当当前请求在数组中存在时执行函数体
					state.pending[p].f({
						code: 200,
						url: state.pending[p].u
					}); //执行取消操作
					state.pending.splice(p, 1); //把这条记录从数组中移除
				}
			}
		},
		// 终止所有请求
		REMOVE_PENGDINGS: (state) => {
			for (let p in state.pending) {
				state.pending[p].f({
					code: 200
				}); //执行取消操作
				state.pending.splice(p, 1); //把这条记录从数组中移除
			}
		},
	},
	actions: {},
	modules
});

export default store;
