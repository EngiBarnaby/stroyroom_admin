<template>
  <div>

    <v-dialog width="500" v-model="cancelOrderDialog">
      <v-card>
        <v-card-title>
          Вы уверены, что хотите отменить заказ?
        </v-card-title>
        <v-card-actions>
          <v-btn
            outlined
            color="error"
            @click="cancelOrderDialog = false"
          >
            Нет
          </v-btn>
          <v-btn
              outlined
              color="success"
              @click="cancelOrder"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="approveOrderDialog">
      <v-card>
        <v-card-title>
          Вы уверены, что хотите подвердить заказ
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="approveOrderDialog = false">
            Нет
          </v-btn>
          <v-btn outlined color="success" @click="approveOrder">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              <h6>Оплата сразу :
                <template v-if="order.paid_right_away === true" >
                  Да
                </template>
                <template v-else>
                  Нет
                </template>
              </h6>
            </v-card-text>
            <v-card-actions>

              <v-btn
                  outlined
                  color="error"
                  @click="cancelOrderDialog = true"
              >
                Отменить заявку
              </v-btn>

              <v-btn outlined
                     color="success"
                     @click="approveOrderDialog = true"
                     :disabled="!allSubOrdersApproved"
              >
                Подтвердить заказ
              </v-btn>
            </v-card-actions>
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
              <OrderSubPosition @all_approved="changeStatus"/>
            </v-tab-item>

            <v-tab-item
            >
              <OrderPosition />
            </v-tab-item>

          </v-tabs-items>


        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import OrderSubPosition from "@/views/Orders/OrderSubPositions";
import OrderPosition from "@/views/Orders/OrderPosition";
export default {
  name: "OrderDetails",
  components: {OrderSubPosition, OrderPosition},

  data(){
    return {

      allSubOrdersApproved : false,

      cancelOrderDialog : false,
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

    async cancelOrder(){
      await this.$http.get(`marketplace/manager_appointment_orders/${this.order.id}/set_canceled/`)
      this.$router.push("/appointment-orders")
    },

    changeStatus(status){
      this.allSubOrdersApproved = status
    },

    async approveOrder(){
      await this.$http.get(`marketplace/manager_appointment_orders/${this.order.id}/set_approve_order/`)
      this.$router.go(-1)
    },

    async fetchData(){
      let { data } = await this.$http.get(`marketplace/manager_appointment_orders/${this.$route.params.id}/`)
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