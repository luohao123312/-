import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

NProgress.configure({ showSpinner: false });

// 后台白名单路由
const whiteList = ['/login', '/register']
// 前台白名单路由
const frontWhiteList = ['/front/home', '/front/service', '/front/health', '/front/activities', '/nursing/plan', '/nursing/project/list']

router.beforeEach((to, from, next) => {
  NProgress.start()
  
  // 判断是否是前台页面或API请求
  const isFrontPage = to.path.startsWith('/front') || to.path.startsWith('/nursing')
  
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login' || to.path === '/front/login') {
      next({ path: isFrontPage ? '/front/home' : '/index' })
      NProgress.done()
    } else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        useUserStore().getInfo().then(() => {
          isRelogin.show = false
          usePermissionStore().generateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          useUserStore().logOut().then(() => {
            ElMessage.error(err)
            next({ path: isFrontPage ? '/front/login' : '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (isFrontPage) {
      // 前台页面或API请求
      if (frontWhiteList.indexOf(to.path) !== -1 || to.path.startsWith('/nursing/')) {
        next()
      } else {
        next(`/front/login?redirect=${to.fullPath}`)
        NProgress.done()
      }
    } else {
      // 后台页面
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
