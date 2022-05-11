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
                     :disabled="!allSubOrdersApproved || missing.length !== 0"
              >
                Подтвердить заказ
              </v-btn>
            </v-card-actions>

            <h6 v-if="missing.length === 0">Состав заказа : <span style="color : green;">Заказ укомплектован</span></h6>
            <div v-if="missing.length > 0">
              <h6 style="color: red;">Некорректная комплектация</h6>
              <p v-for="(item, index) in missing" :key="index">
                {{item.name}}. Количество {{item.count}}.
              </p>
            </div>
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
              <OrderSubPosition @all_approved="changeStatus" @changePositions="changePositions" @refreshOrderPosition="refreshOrderPosition"/>
            </v-tab-item>

            <v-tab-item
            >
              <OrderPosition ref="orderPosition" @refreshOrderPosition2="refreshOrderPosition2" />
            </v-tab-item>

            <v-tab-item
            >
              <Comments />
            </v-tab-item>

          </v-tabs-items>


        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Comments from "@/components/Comments";
import OrderSubPosition from "@/views/Orders/OrderSubPositions";
import OrderPosition from "@/views/Orders/OrderPosition";
export default {
  name: "OrderDetails",
  components: {OrderSubPosition, OrderPosition, Comments},

  data(){
    return {
      orderPositions : [],
      allSubPosition : [],


      allSubOrdersApproved : false,

      cancelOrderDialog : false,
      approveOrderDialog : false,
      deleteDialog : false,

      tab: 0,
      items: [
        'Сборки', 'Позиций заказа', "Комментарии",
      ],

      order : {},
    }
  },

  computed : {

    missing(){
      let missingItems = []
      let similar = {}
      for(let i = 0; i < this.orderPositions.length; i++){
        let positionOrder = this.orderPositions[i]
        for(let j = 0; j < this.allSubPosition.length; j++){
          if(this.orderPositions[i].nomenclature.id === this.allSubPosition[j].nomenclature){
            similar.name = this.orderPositions[i].nomenclature.name
            if(similar.count){
              similar.count += this.allSubPosition[j].count
            }
            else{
              similar.count = this.allSubPosition[j].count
            }
          }
        }

        if(Object.keys(similar).length === 0){
          missingItems.push({name : this.orderPositions[i].nomenclature.name, count : this.orderPositions[i].count})
        }


        if(Object.keys(similar).length !== 0 && similar.count !== positionOrder.count){
          if(positionOrder.count - similar.count > 0){
            similar.count = `Не хватает ${positionOrder.count - similar.count} шт`
            missingItems.push(similar)
          }
          else if(positionOrder.count - similar.count < 0){
            similar.count = `Больше на ${similar.count - positionOrder.count} шт`
            missingItems.push(similar)
          }
        }

        similar = {}
      }
      return missingItems

    },

  },

  methods : {

    changePositions(subPositions){
      this.allSubPosition = subPositions
    },

    async fetchOrderPosition(){
      let { data } = await this.$http.get(`marketplace/manager_order_positions/?order=${this.$route.params.id}`)
      this.orderPositions = data
    },

    refreshOrderPosition(){
      if(this.$refs.orderPosition){
        this.$refs.orderPosition.fetchPositions()
      }
      this.fetchOrderPosition()
    },

    refreshOrderPosition2(){
      this.fetchOrderPosition()
    },

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
    this.fetchOrderPosition()
  }
}
</script>

<style scoped>


</style>