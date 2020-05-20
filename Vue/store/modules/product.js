import {
	selectGoodsList,
} from '@/views/product/api';
import {
	selectAllLexicon,
} from '@/views/lexicon/api';
import verifyVar from '@/utils/verifyVar';
export default {
	namespaced: true,
	state: {
		// 产品分类列表
		lexiconList: [],
		// 商品列表
		goodsList: {
			data: [],
			allPageSize: 0
		},
		// 商品搜索条件
		searchOptions: {
			classId: '', // 类型	默认全部
			brandId: '', // 品牌 默认全部
			goodsSales: [1, 2], // 是否优惠 1优惠 2不优惠
			goodsSalesType: 2, // 是否优惠 1优惠 2不优惠
			minPrice: '', // 最低价格
			maxPrice: '', // 最高价格
			key: '', // 模糊查询
			pageSize: 10, // 最大页数
			pageNo: 1 // 默认页数
		}
	},
	getters: {
		lexiconList: state => state.lexiconList,
		goodsList: state => state.goodsList,
		searchOptions: state => state.searchOptions,
	},
	mutations: {
		
		// 设置产品字典列表
		setLexiconList(state, data = []) {
			state.lexiconList = data;
		}, 
		// 设置商品列表
		setGoodsList(state, data = {}) {
			state.goodsList = Object.assign({
				data: [],
				allPageSize: 0
			}, data);
		},
		// 设置商品搜索条件
		setSearchOptions(state, data = {}) {
			if (verifyVar(data, 'Object')) {
				state.searchOptions = Object.assign({}, state.searchOptions, data);
			}
		},
	},
	actions: {
		/* 
			获取字典
		 */
		getLexiconList({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				selectAllLexicon().then(data => {
					commit('setLexiconList', data.map(val => {
						return Object.assign({
							value: val.id,
							label: val.name,
						}, val);
					}));
					resolve();
				}).catch(_ => reject());
			})
		},

		/*
		 * 获取商品列表
		 * @parms data
		 */
		getGoodsList({
			state,
			commit,
			dispatch
		}, data) {
			return new Promise((resolve, reject) => {
				commit('setSearchOptions', data);
				selectGoodsList({
					data: state.searchOptions
				}).then(data => {
					if (state.searchOptions.pageNo != 1 && data.data.length == 0) {
						dispatch('getGoodsList', {
							pageNo: state.searchOptions.pageNo - 1
						});
					} else {
						commit('setGoodsList', data);
					}
					resolve();
				}).catch(_ => {
					commit('setGoodsList');
					reject();
				});
			})
		}
	}
}
