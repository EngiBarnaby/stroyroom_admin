<template>
  <div>

    <v-dialog width="750" v-model="carInfoDialog">
      <v-card>
        <CarInfo :car="car" />
      </v-card>
    </v-dialog>

    <v-dialog width="1500" v-model="appointCarDialog" @click:outside="closeAppointCarDialog">
      <v-card>
        <v-row justify="end">
          <v-btn icon @click="closeAppointCarDialog" class="mt-5 mr-7">
            <v-icon x-large>
              mdi-close-circle-outline
            </v-icon>
          </v-btn>
        </v-row>
        <AppointmentSubOrderCars :subOrderId="currentSubOrder.id" @carSelected="changeCar"/>
      </v-card>
    </v-dialog>

    <div class="scroll">
      <v-expansion-panels v-for="subOrder in subOrders" :key="subOrder.id">
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ subOrder._shop._company }} {{subOrder._shop.address}}
          </v-expansion-panel-header>
          <v-expansion-panel-content>

            <v-card class="p-4 mb-4">
              <div v-if="subOrder.positions.length">
                <v-card-text>
                  <div class="content-container" v-for="item in subOrder.positions" :key="item.id">
                    <div class="custom-carousel">
                      <v-carousel hide-delimiters
                                  :show-arrows-on-hover="true"
                                  height="auto">
                        <v-carousel-item
                            show-arrows-on-hover
                            hide-delimiters
                            v-for="(item,i) in item._nomenclature.images"
                            :key="i"
                            :src="item"
                        ></v-carousel-item>
                      </v-carousel>
                    </div>
                    <div class="item-fields">
                      <h6>{{item._nomenclature.name}}</h6>
                      <h6>Количество : {{item.count}}</h6>
                      <h6>Единица измерения : {{item._nomenclature._measurement.name}}</h6>
                      <h6>Цена за единицу : {{item._product.cost}} &#8381;</h6>
                      <h6>Общая цена {{(item.count * item._product.cost ).toFixed(2)}} &#8381;</h6>
                      <h6>Количество в магазине : {{item._product.count}}</h6>

                    </div>
                  </div>
                  <v-divider></v-divider>

                  <h6>
                    Назначена машина : {{subOrder._car.name}}
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon
                               v-bind="attrs"
                               v-on="on"
                               @click="openCarInfoDialog(subOrder._car)"
                        >
                          <v-icon>
                            mdi-help-circle-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Посмотреть информацию</span>
                    </v-tooltip>
                  </h6>

                  <v-btn outlined color="info" @click="openAppointCarDialog(subOrder)">Назначить другую машину</v-btn>

                </v-card-text>
              </div>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import AppointmentSubOrderCars from "@/views/Cars/AppointmentSubOrderCars";
import CarInfo from "@/views/Cars/CarInfo";
export default {

  name: "LogistSubOrder",

  components : { AppointmentSubOrderCars, CarInfo },

  data(){
    return {
      carInfoDialog : false,
      appointCarDialog : false,
      createSubOrderDialog : false,
      deleteSubOrderDialog : false,
      dialogApprove : false,
      shopProductsDialog : false,
      deleteDialog : false,

      shops : [],
      subOrders : [],
      orderPositions : [],

      shopSelected : {},
      currentItem : {},
      currentSubOrder : {},
      car : {},

    }
  },


  methods : {

    openCarInfoDialog(car){
      this.car = car
      this.carInfoDialog = true
    },

    changeCar(car){
      this.$emit("carSelected")
      this.currentSubOrder._car = car
    },

    closeAppointCarDialog(){
      this.currentSubOrder = {}
      this.appointCarDialog = false
    },

    openAppointCarDialog(subOrder){
      this.currentSubOrder = subOrder
      this.appointCarDialog = true
    },

    refresh(){
      this.subOrders = []
      this.$emit("refreshOrderPosition")
      this.fetchSubOrders()
    },



    async fetchShops(){
      let { data } = await this.$http.get("marketplace/shop/get_all_shops/")
      this.shops = data
    },

    async fetchSubOrders(){
      this.subOrders = []
      let { data } = await this.$http.get(`marketplace/manager_sub_order/?order=${this.$route.params.id}`)
      await Promise.all(data.map(item => this.fetchSubOrderPositions(item)))
      this.subOrders.sort((first, second) => first.id - second.id)
    },

    async fetchSubOrderPositions(subOrder){
      let {data} = await this.$http.get(`marketplace/manager_sub_order_positions/?sub_order=${subOrder.id}`)
      subOrder["positions"] = data
      this.subOrders.push(subOrder)
    }

  },

  watch : {
    subOrders(){
      for (let i = 0; i < this.subOrders.length; i++) {
        if(this.subOrders[i].manager_approve === false){
          return this.$emit("all_approved", false)
        }
      }
      return this.$emit("all_approved", true)
    }
  },

  mounted(){
    this.fetchSubOrders()
    this.fetchShops()
  }
}
</script>

<style scoped>


.scroll {
  height: 100vh;
  overflow: auto;
}

.item-fields {
  margin-left: 50px;
}

.content-container {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}


.custom-carousel {
  height: 150px;
  width: 150px;
}


</style>
