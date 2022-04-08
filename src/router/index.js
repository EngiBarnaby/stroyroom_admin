import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path : "/login",
    name : "login",
    component: () => import('../views/Login/LoginPage.vue'),
    meta: { notRequiresAuth: true },
  },
  {
    path: "",
    component: () => import("../views/Main"),
    meta: {requiresAuth: true,},

  },
  {
    path: '/nomenclatures',
    name: 'nomenclatures',
    component: () => import('../views/Nomenclatures/Nomenclatures'),
    meta: { requiresAuth: true, },
  },
  {
    path : "/edit-nomenclature/:id",
    name : "edit-nomenclature",
    component : () => import('../views/Nomenclatures/NomenclatureDetails'),
    meta: { requiresAuth: true, }
  },
  {
    path: '/shops',
    name: 'shops',
    component: () => import('../views/Shops/Shops'),
    meta: { requiresAuth: true, },
  },
  {
    path : "/shop-products/:id",
    name : "shop-products",
    component: () => import("../views/Shops/ShopProducts"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/orders",
    name : "orders",
    component: () => import("../views/Orders/OrderTable"),
    meta: { requiresAuth: true, },
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

 router.beforeEach((to, from, next) => {
   const currentUser = window.localStorage.getItem("token");
   const requieAuth = to.matched.some((todo) => todo.meta.requiresAuth);
   const notRequieAuth = to.matched.some((todo) => todo.meta.notRequiresAuth);

   if (notRequieAuth && currentUser) {
     next("/");
   }

   if (requieAuth && !currentUser) {
     next("/login");
   } else {
     next();
   }
 });

export default router
