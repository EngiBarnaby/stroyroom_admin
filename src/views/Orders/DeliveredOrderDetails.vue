<template>
  <div>


    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>

    <v-container>
      <v-row>
        <v-col cols="5">
          <v-card class="pa-4">
            <v-card-title>
              Заказ №{{order.id}}
            </v-card-title>
            <v-card-text>
              <h6>Адрес : {{order._address}}</h6>
              <h6>Телефон : {{order.phone}}</h6>
              <h6>Статус : {{order.order_status}}</h6>
              <h6>Адрес : {{order._address}}</h6>
              <h6>Оплата сразу :
                <template v-if="order.paid_right_away === true" >
                  Да
                </template>
                <template v-else>
                  Нет
                </template>
              </h6>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="7">

          <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
          >
            <v-tab
                v-for="item in items"
                :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item
            >
              <OrderPositionsReview />
            </v-tab-item>

            <v-tab-item
            >
              <OrderSubPositionsReview   />
            </v-tab-item>

          </v-tabs-items>


        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import OrderPositionsReview from "@/views/Orders/OrderPositionsReview";
import OrderSubPositionsReview from "@/views/Orders/OrderSubPositionsReview";
export default {
  name: "OrderDetails",
  components: {OrderPositionsReview, OrderSubPositionsReview},

  data(){
    return {

      allSubOrdersApproved : false,

      approveOrderDialog : false,
      deleteDialog : false,

      tab: null,
      items: [
        'Сборки', 'Позиций заказа',
      ],

      order : {},
    }
  },

  methods : {



    async fetchData(){
      let { data } = await this.$http.get(`marketplace/manager_delivered_orders/${this.$route.params.id}/`)
      this.order = data
    },

  },

  mounted(){
    this.fetchData()
  }
}
</script>

<style scoped>


</style>

