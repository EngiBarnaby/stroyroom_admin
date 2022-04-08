import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "@/plugins/axios/index.js"
import vueDebounce from 'vue-debounce'
Vue.use(vueDebounce)

Vue.config.productionTip = false

Vue.prototype.$http = axios;



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
