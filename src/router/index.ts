import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入视图组件
import HomeView from '@/views/HomeView.vue'
import ImportView from '@/views/ImportView.vue'
import DashboardView from '@/views/DashboardView.vue'
import QuizView from '@/views/QuizView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: '脚本指南'
    }
  },
  {
    path: '/import',
    name: 'Import',
    component: ImportView,
    meta: {
      title: '导入题库'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: '题库管理'
    }
  },
  {
    path: '/quiz/:bankId',
    name: 'Quiz',
    component: QuizView,
    meta: {
      title: '开始答题'
    },
    props: true
  },
  {
    // 404 重定向到首页
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/Good-review/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时滚动到顶部
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Good Review`
  }
  next()
})

export default router