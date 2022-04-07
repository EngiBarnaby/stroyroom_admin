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
        path: '/nomenclatures',
        name: 'nomenclatures',
        component: () => import('../views/Nomenclatures/Nomenclatures')
      },
      {
        path : "/edit-nomenclature/:id",
        name : "edit-nomenclature",
        component : () => import('../views/Nomenclatures/NomenclatureDetails')

      },
      {
        path: '/shops',
        name: 'shops',
        component: () => import('../views/Shops/Shops')
      },
      {
        path : "/shop-products/:id",
        name : "shop-products",
        component: () => import("../views/Shops/ShopProducts")
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
