<template>
  <div v-if="!isFetching">
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
            <h6>Адрес : {{order._address}}</h6>
            <h6>Оплата сразу :
              <template v-if="order.paid_right_away === true" >
                Да
              </template>
              <template v-else>
                Нет
              </template>
            </h6>
            <h6>Сумма : {{order.cost}} &#8381;</h6>

          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card>
            <v-card-title>
              Назначение машины
            </v-card-title>
            <AppointmentCars :carSelected="carSelected" @selectCar="appointCar"/>
          </v-card>
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
import AppointmentCars from "@/views/Cars/AppointmentCars";
export default {
  name: "AppointmentOrderDetail",

  components : { AppointmentCars },

  data(){
    return {
      isFetching : true,
      successSnackbar : false,

      order : {},
      carSelected : false,

    }
  },

  methods : {

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
        this.$router.push("/appointment-logist-orders")
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