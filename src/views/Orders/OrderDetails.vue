<template>
  <div>

    <v-dialog
        width="500"
    v-model="deleteDialog"
    @click:outside="closeDeleteDialog"
    >
      <v-card>
        <v-card-title>
          Вы уверены, что хотите удалить товар?
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="closeDeleteDialog">
            Нет
          </v-btn>
          <v-btn outlined color="success" @click="deletePosition">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-row>
        <v-col cols="5">
          <v-card>
            <v-card-title>
              Заказ №{{order.id}}
            </v-card-title>

            <v-card-text>

            </v-card-text>

          </v-card>
        </v-col>

        <v-col cols="7">
          <div v-for="subOrder in subOrders" :key="subOrder.id">
            <v-card class="p-4 mb-4">
              <v-card-title>
                Сборка
              </v-card-title>
              <v-card-title>
                {{ subOrder._shop._company }} {{subOrder._shop.address}}
              </v-card-title>
              <v-card-subtitle>
                Позиций сборки
              </v-card-subtitle>
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
<!--                      <v-btn icon @click="subtract(item)">-->
<!--                        <v-icon x-large color="error">-->
<!--                          mdi-minus-circle-outline-->
<!--                        </v-icon>-->
<!--                      </v-btn>-->
                        <v-text-field
                            :value="item.count"
                            prepend-icon="mdi-minus-circle-outline"
                            append-outer-icon="mdi-plus-circle-outline"
                            type="number"
                            @input="setValue($event, item)"
                            @click:prepend="subtract(item)"
                            @click:append-outer="add(item)"
                        ></v-text-field>
<!--                      <v-btn icon @click="add(item)">-->
<!--                        <v-icon x-large color="success">-->
<!--                          mdi-plus-circle-outline-->
<!--                        </v-icon>-->
<!--                      </v-btn>-->
                    <h6>
                      Цена шт. : {{item._product.cost}} &#8381;.
                    </h6>
                    <h6>Общая цена : {{ item.count * item._product.cost }}</h6>
                    <h6>
                      {{item._nomenclature.name}}
                    </h6>

                    <v-btn outlined color="error" @click="openDeleteDialog(item, subOrder)">
                      Убрать товар из заказа
                    </v-btn>
                    <v-divider></v-divider>
                  </div>
                </v-card-text>
              </div>
              <div v-else>
                <v-card-text>
                  <h6>
                    Сборка пуста
                  </h6>
                </v-card-text>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",

  data(){
    return {
      deleteDialog : false,

      order : {},
      subOrders : [],
      orderPositions : [],

      currentItem : {},
      currentSubOrder : {}
    }
  },

  methods : {

    closeDeleteDialog(){
      this.currentItem = {}
      this.currentSubOrder = {}
      this.deleteDialog = false
    },

    openDeleteDialog(item, subOrder){
      this.currentSubOrder = subOrder
      this.currentItem = item
      this.deleteDialog = true
    },

    async deletePosition(){
      let subOrderPosition = this.currentItem.id
      let orderPosition = this.orderPositions.filter(el => el.product === this.currentItem.product)[0].id
      await this.$http.delete(`marketplace/manager_order_positions/${orderPosition}/`)
      await this.$http.delete(`marketplace/manager_sub_order_positions/${subOrderPosition}/`)
      this.subOrders = this.subOrders.filter(el => {
        if(el.id === this.currentSubOrder.id){
          el.positions = el.positions.filter(el2 => el2.id !== this.currentItem.id)
        }
        return el
      })
      this.deleteDialog = false
    },

    setValue(e, item){
      item.count = e
    },

    subtract(item){
      if(item.count > 0)
        item.count -= 1
      else {
        item.count = 0
      }
    },

    add(item){
      item.count += 1
    },

    async fetchData(){
      let { data } = await this.$http.get(`marketplace/manager_appointment_orders/${this.$route.params.id}/`)
      this.order = data
    },

    async fetchOrderPositions(){
      let {data} = await this.$http.get(`marketplace/manager_order_positions/?order=${this.$route.params.id}`)
      this.orderPositions = data
    },

    async fetchSubOrders(){
      let { data } = await this.$http.get(`marketplace/manager_sub_order/?order=${this.$route.params.id}`)
      await Promise.all(data.map(item => this.fetchSubOrderPositions(item)))
    },

    async fetchSubOrderPositions(subOrder){
      let {data} = await this.$http.get(`marketplace/manager_sub_order_positions/?sub_order=${subOrder.id}`)
      subOrder["positions"] = data
      this.subOrders.push(subOrder)
    }

  },

  mounted(){
    this.fetchData()
    this.fetchSubOrders()
    this.fetchOrderPositions()
  }
}
</script>

<style scoped>

.custom-count-input {
  display: inline !important;
  width: 50px !important;
}

.content-container {
  margin-bottom: 40px;
}

.count-item {
  display: flex;
  align-content: center;
  margin-bottom: 15px;
}

.count-number {
  display: flex;
  align-items: center;
  margin-bottom: 0px !important;
  margin-right: 10px;
  margin-left: 10px;
}


.custom-carousel {
  height: 150px;
  width: 150px;
}

.v-text-field {
  width: 130px;
}

</style>