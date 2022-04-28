<template>
  <div v-if="!isFetching">
      <v-navigation-drawer
          clipped
          app
          color="primary"
          expand-on-hover
          mini-variant
          mini-variant-width="75"
          mobile-breakpoint="0"
      >
        <v-list nav dense >
            <v-list-item v-for="(item, i) in accepted_links" :key="i" :to="item.link">
              <v-list-item-icon >
                <div v-if="item.count > 0">
                  <v-badge color="green" :content="item.count">
                    <v-icon class="white--text">{{item.icon}}</v-icon>
                  </v-badge>
                </div>
                <div v-else>
                  <v-icon class="white--text">{{item.icon}}</v-icon>
                </div>
              </v-list-item-icon>
              <v-list-item-content class="ml-4 white--text">
                <v-list-item-title>{{item.name}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>


        </v-list>

      </v-navigation-drawer>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Sidebar",

  data(){
    return {

      isFetching : true,


      checkup : {},

      mainList : [
        {name : "Заказы", icon : "mdi-cart-outline", link : "/orders", "key" : "orders", count : 0},
        {name : "Заказы", icon : "mdi-cart-outline", link : "/logist-orders-table", "key" : "logist_orders", count : 0},
        {name : "Машины", icon : "mdi-truck-cargo-container", link : "/cars", "key" : "cars"},
        {name : "Номенклатура", icon : "mdi-clipboard-list-outline", link : "/nomenclatures", "key" : "nomenclature"},
        {name : "Сборки", icon : "mdi-clock", link : "/actions"},
        {name : "Магазины", icon : "mdi-store", link : "/shops", "key" : "shops"},
        {name : "Мои заказы", icon : "mdi-book-account", link : "/appointment-orders", "key" : "my_orders", count : 0},
        {name : "Мои заказы", icon : "mdi-book-account", link : "/appointment-logist-orders", "key" : "my_orders_logist", count: 0},
        {name : "Доставляются", icon : "mdi-truck-delivery-outline", link : "/delivering-table", "key" : "is_delivering", count : 0},
        {name : "Требуют завершения", icon : "mdi-checkbox-multiple-marked-circle-outline", link : "/delivered-orders", "key" : "delivered_orders", count : 0},
      ],
    }
  },

  methods : {

    getNotifications(){
      setInterval(()=> {
        if(this.checkup.name === "OrderManager"){
          this.getManagerOrderCount()
          this.getManagerAppointmentOrderCount()
          this.getManagerDeliveredOrderCount()
        }

        if(this.checkup.name === "LogistManager"){
          this.getLogistOrderCount()
          this.getLogistAppointmentOrderCount()
          this.getDeliveringOrderCount()
        }

      }, 5000)
    },

    async getDeliveringOrderCount(){
      let { data } = await api.get('marketplace/logist_delivering_order')
      this.mainList[8].count = data.count
    },

    async getLogistAppointmentOrderCount(){
      let { data } = await api.get('marketplace/logist_appointment_orders')
      this.mainList[7].count = data.count
    },


    async getLogistOrderCount(){
      let { data } = await api.get('marketplace/logist_manager_order')
      this.mainList[1].count = data.count
    },

    async getManagerDeliveredOrderCount(){
      let { data } = await api.get('marketplace/manager_delivered_orders')
      this.mainList[9].count = data.count
    },

    async getManagerAppointmentOrderCount(){
      let { data } = await api.get('marketplace/manager_appointment_orders')
      this.mainList[6].count = data.count
    },


    async getManagerOrderCount(){
      let { data } = await api.get('marketplace/manager_order/')
      this.mainList[0].count = data.count
    },

    getCheckUp(){
     api('marketplace/get_check_up/')
     .then(({data})=>{
       this.checkup = data
     })
     .catch(e => console.error(e))
   },
  },

  computed : {
    accepted_links(){
      return this.mainList.filter(el => {
        if(el["key"] in this.checkup){
          return el
        }
      })
    }
  },

   async mounted() {

    let {data} = await api.get('marketplace/get_check_up/')

     this.checkup = data

     // api('marketplace/get_check_up/')
     //     .then(({data})=>{
     //       this.checkup = data
     //     })
     //     .catch(e => console.error(e))

     if(this.checkup.name === "OrderManager"){
       this.getManagerOrderCount()
       this.getManagerAppointmentOrderCount()
       this.getManagerDeliveredOrderCount()
     }

     if(this.checkup.name === "LogistManager"){
       this.getLogistOrderCount()
       this.getLogistAppointmentOrderCount()
       this.getDeliveringOrderCount()
     }

     this.getNotifications()

     this.isFetching = false
  }

}
</script>

<style scoped>

</style>