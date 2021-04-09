const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

import { createStore } from 'vuex'
import router, { ResetRouter } from '@/router';

import createPersistedState from 'vuex-persistedstate';
import { USERINFO, DICTIONARIES } from './types';

export default createStore({
  state: {
    [USERINFO.state]: {}, // 用户信息
    [DICTIONARIES.state]: {}, // 全局字典
  },
  getters: {
    // 用户token
    token: (state) => state[USERINFO.state].token,
  },
  mutations: {
    // 设置用户信息
    [USERINFO.mutations](state, data) {
      if (data) {
        state[USERINFO.state] = data;
      } else {
        //  如果data为空， 则认为是退出登录
        state[USERINFO.state] = {};
        ResetRouter();
        router.replace({ name: 'Login', params: { source: '登录' } })
      }
    },
    // 设置全局字典
    [DICTIONARIES.mutations](state, data) {
      state[DICTIONARIES.state] = data;
    }
  },
  actions: {
  },
  modules,
  plugins: [createPersistedState()]
})