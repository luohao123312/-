import Layout from '@/layout/index'

export default [
  {
    path: '/front',
    component: () => import('@/layout/FrontLayout.vue'),
    redirect: '/front/home',
    hidden: true,
    children: [
      {
        path: 'home',
        name: 'FrontHome',
        component: () => import('@/views/front/Home.vue'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'service',
        name: 'ServiceBooking',
        component: () => import('@/views/front/ServiceBooking.vue'),
        meta: { title: '服务预约', icon: 'service' }
      },
      {
        path: 'health',
        name: 'HealthManage',
        component: () => import('@/views/front/Health.vue'),
        meta: { title: '健康管理', icon: 'health' }
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('@/views/front/Activities.vue'),
        meta: { title: '社区活动', icon: 'activity' }
      }
    ]
  }
] 