<template>
  <div v-if="!isFetching">

    <v-dialog width="750" v-model="carInfoDialog">
      <v-card>
        <CarInfo :car="car" />
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="cancelOrderDialog">
      <v-card>
        <v-card-title>
          Вы уверены, что хотите отменить заказ?
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="cancelOrderDialog = false">Нет</v-btn>
          <v-btn outlined color="success" @click="cancelOrder">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="1500" v-model="appointCarDialog">
      <v-card>
        <v-row justify="end">
          <v-btn icon @click="appointCarDialog = false" class="mt-5 mr-7">
            <v-icon x-large>
              mdi-close-circle-outline
            </v-icon>
          </v-btn>
        </v-row>
        <AppointmentOrderCars @carSelected="carSelected" :orderId="$route.params.id" />
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
            <h6>Сумма : {{order.cost}} &#8381;</h6>

            <div v-if="order.car">
              <h6>Машина : {{order._car.name}}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                           v-bind="attrs"
                           v-on="on"
                           @click="openCarInfoDialog(order._car)"
                    >
                      <v-icon>
                        mdi-help-circle-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Посмотреть информацию</span>
                </v-tooltip>
              </h6>
            </div>
            <div v-else>
              <h6>Машина на заказ не назначена</h6>
            </div>

            <v-card-actions>
              <v-btn
                  outlined
                  color="error"
                  @click="cancelOrderDialog = true"
              >
                Отменить заявку
              </v-btn>

              <v-btn outlined color="info" @click="appointCarDialog = true">
                Назначить машину
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
              <v-card>
                <LogistSubOrder ref="subOrders" @carSelected="fetchOrderDetail"/>
              </v-card>
            </v-tab-item>

            <v-tab-item
            >
              <v-card>
                <CarsList />
              </v-card>
            </v-tab-item>

            <v-tab-item
            >
              <Comments />
            </v-tab-item>

          </v-tabs-items>

        </v-col>
      </v-row>
    </v-container>


    <v-snackbar
        outlined
        v-model="successSnackbar"
        color="success"
        timeout="2000"
    >
      Машина успешно назначена

    </v-snackbar>

  </div>
</template>

<script>
import Comments from "@/components/Comments";
import LogistSubOrder from "@/views/LogistOrders/LogistSubOrder";
import CarsList from "@/views/Cars/CarsList";
import AppointmentOrderCars from "@/views/Cars/AppointmentOrderCars";
import CarInfo from "@/views/Cars/CarInfo";
export default {
  name: "AppointmentOrderDetail",

  components : { CarsList, Comments, LogistSubOrder, AppointmentOrderCars, CarInfo},

  data(){
    return {

      tab: 0,
      items: [
        "Сборки", "Машины", "Комментарии",
      ],

      car : {},

      carInfoDialog : false,
      appointCarDialog : false,
      cancelOrderDialog : false,

      isFetching : true,
      successSnackbar : false,

      order : {},

    }
  },


  methods : {

    // closeCarInfoDialog(){
    //   this.car = {}
    //   this.carInfoDialog = false
    // },

    openCarInfoDialog(car){
      this.car = car
      this.carInfoDialog = true
    },

    carSelected(){
      this.fetchOrderDetail()
      this.$refs.subOrders.fetchSubOrders()
    },

    async cancelOrder(){
      await this.$http.get(`marketplace/logist_appointment_orders/${this.order.id}/set_canceled/`)
      this.$router.push("/appointment-logist-orders")
    },


    async fetchOrderDetail(){
      try{
        let { data } = await this.$http.get(`marketplace/logist_appointment_orders/${this.$route.params.id}/`)
        this.order = data
        this.car = this.order._car
        // this.$router.push("/appointment-logist-orders")
      }
      catch (e) {
        console.log(e)
      }
    },

  },



  mounted() {
    this.fetchOrderDetail()
    this.isFetching = false
  }

}
</script>

<style scoped>

</style>