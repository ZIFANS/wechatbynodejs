import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '',
        redirect: '/wchart'
      },
      {
        path: '/wchart',
        name: 'wchart',
        component: () => import('../views/Wchart.vue')
      },
      {
        path: '/abook',
        name: 'abook',
        component: () => import('../views/AddressBook.vue')
      },
      {
        path: '/find',
        name: 'find',
        component: () => import('../views/Find.vue')
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import('../views/Mine.vue')
      },
      { path: '/circle', name: 'circle', component: () => import('../views/Circle.vue') },
      { path: '/publish', name: 'publish', component: () => import('../views/Publish.vue') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login')
  },
  { path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由守卫
// 功能：在没有登录时候，只能看到登录注册页面
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.wxToken ? true : false;
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
});

export default router
