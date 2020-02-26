import router from "./index";
import store from "../store/index";
import  { getToKen, removeToKen, removeUserName }  from "@/utils/app";

const whiteRouter = ['/login']; // indexOf 方法，判断数组中是否存在指定的某个对象，
                                //如果不存在，则返回-1

// 路由守卫
router.beforeEach((to, from, next) => {
  if(getToKen()) {
    if(to.path === '/login'){
      removeToKen()
      removeUserName()
      store.commit('app/SET_TOKEN', '');
      store.commit('app/SET_USERNAME', '');
      next()
    }else {
      // 获取用户的角色
      // 动态分配路由权限
      next();
    }
    /**
     * 1、to = /console
     * 2、/console发生重定向，to = /index
     */
    // 路由动态添加， 分配菜单， 每个角色分配不同的菜单
  }else {
    // next('/login') // 路由指向
    if(whiteRouter.indexOf(to.path) !== -1) {
      next()
    }else{
      next('/login')  // 路由指向
    }
    /**
     * 1、 直接进入index页面时，参数to被改变成了"/index"，触发路由转向，就会跑beforeEach
     * 2、下一次进入login页面，再次发生路由指向，再跑beforeEach。 参数的to被改变成了
     * "/login"
     * 3、 白名单判断存在，则直接执行next()， 因为没有next没有参数，所以不会再次beforeEach，也就不会进入死循环
     */
    
  }
  // console.log(to)    // 进入的页面（下一个页面）
  // console.log(from)  // 离开之前的页面（上一个页面）
  // console.log(next)
  // next()  不带参数时指向to的页面
})