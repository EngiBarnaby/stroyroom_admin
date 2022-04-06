import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path : "/login",
    name : "login",
    component: () => import('../views/Login/LoginPage.vue')
  },
  {
    path : "",
    component: () => import("../views/Main"),
    children : [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/Home/Home.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/Home/AboutView.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
