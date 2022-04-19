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
  },
  {
    path : "/appointment-orders",
    name : "appointment-orders",
    component: () => import("../views/Orders/AppointmentOrders"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/order-details/:id",
    name : "order-details",
    component: () => import("../views/Orders/OrderDetails"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/order-details-review/:id",
    name : "order-details-review",
    component: () => import("../views/Orders/OrderDetailsReview"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/logist-orders-table",
    name : "logist-orders-table",
    component : () => import("../views/LogistOrders/LogistOrdersTable"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/appointment-logist-orders",
    name : "appointment-logist-orders",
    component : () => import("../views/LogistOrders/LogistAppoinmentOrders"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/logist-order-details/:id",
    name : "logist-order-details",
    component : () => import("../views/LogistOrders/LogistOrderReview"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/appointment-order-detail/:id",
    name : "appointment-order-detail",
    component : () => import("../views/LogistOrders/AppointmentOrderDetail"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/cars",
    name : "cars",
    component : () => import("../views/Cars/CarScreen"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/add-car",
    name : "add-car",
    component: () => import("../views/Cars/AddCar"),
    meta: { requiresAuth: true, },
  },
  {
    path : "/add-car-type",
    name : "add-car-type",
    component: () => import("../views/Cars/AddCarType"),
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
