<template>
  <div>
      <v-navigation-drawer
          clipped
          app
          absolute
          color="primary"
          expand-on-hover
          mini-variant
          mini-variant-width="75"
      >
        <v-list nav dense >
            <v-list-item v-for="(item, i) in accepted_links" :key="i" :to="item.link">
              <v-list-item-icon >
                <v-icon class="white--text">{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="ml-4 white--text">
                <v-list-item-title v-text="item.name"></v-list-item-title>
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

      checkup : {},

      mainList : [
        {name : "Заказы", icon : "mdi-cart-outline", link : "/orders", "key" : "orders"},
        {name : "Магазины", icon : "mdi-format-list-checks", link : "/kanban"},
        {name : "Номенклатура", icon : "mdi-clipboard-list-outline", link : "/nomenclatures", "key" : "nomenclature"},
        {name : "Сборки", icon : "mdi-clock", link : "/actions"},
        {name : "Магазины", icon : "mdi-store", link : "/shops", "key" : "shops"},
        {name : "Мои заказы", icon : "mdi-book-account", link : "/contacts", "key" : "my_orders"},
      ],
    }
  },

  methods : {
    getCheckUp(){
   // try{
   //   let {data} = await this.$http.get("marketplace/get_check_up/")
   //   console.log(data)
   //   this.checkup = data
   // }
   // catch (e) {
   //   console.log(e)
   // }
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

   mounted() {
     // this.getCheckUp()
     api('marketplace/get_check_up/')
         .then(({data})=>{
           this.checkup = data
         })
         .catch(e => console.error(e))
  }

}
</script>

<style scoped>

</style>