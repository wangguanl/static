import {
  createRouter,
  // createWebHistory,
  createWebHashHistory
} from 'vue-router'

import { CancelTokenPendings } from '@/basics/request'

import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

import {
  constantRouterMap,
} from './routes'

const CreateRouter = () => createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior: (to, from, savePosition) => (savePosition ? savePosition : {
    top: 0
  }),
  routes: constantRouterMap,
})

const router = CreateRouter();

export const ResetRouter = () => {
  router.matcher = CreateRouter().matcher
}



// 全局路由跳转之前触发
router.beforeEach((to, from, next) => {

  NProgress.start();

  // 切换页面（路由）时终止所有请求
  CancelTokenPendings.REMOVE_PENGDINGS();

  next();
});
router.afterEach(() => {
  NProgress.done() // 结束Progress
})

export default router