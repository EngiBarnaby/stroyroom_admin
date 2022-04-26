<template>
  <div v-if="!isFetching">

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

            <v-card-actions>
              <v-btn
                  outlined
                  color="error"
                  @click="cancelOrderDialog = true"
              >
                Отменить заявку
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
                <v-card-title>
                  Назначение машины
                </v-card-title>
                <AppointmentCars :carSelected="carSelected" @selectCar="appointCar"/>
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
import AppointmentCars from "@/views/Cars/AppointmentCars";
export default {
  name: "AppointmentOrderDetail",

  components : { AppointmentCars, Comments },

  data(){
    return {

      tab: 0,
      items: [
        "Машины", "Комментарии",
      ],

      cancelOrderDialog : false,

      isFetching : true,
      successSnackbar : false,

      order : {},
      carSelected : false,

    }
  },

  methods : {


    async cancelOrder(){
      await this.$http.get(`marketplace/logist_appointment_orders/${this.order.id}/set_canceled/`)
      this.$router.push("/appointment-logist-orders")
    },

    async appointCar(car){
      try{
        await this.$http.get(`marketplace/logist_appointment_orders/${this.$route.params.id}/appoint_car/?car=${car.id}`)
        this.successSnackbar = true
        this.carSelected = true
      }
      catch (e){
        console.log(e)
      }
    },

    async fetchOrderDetail(){
      try{
        let { data } = await this.$http.get(`marketplace/logist_appointment_orders/${this.$route.params.id}/`)
        this.order = data
        if(this.order.delivery_agreed){
          this.carSelected = true
        }
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