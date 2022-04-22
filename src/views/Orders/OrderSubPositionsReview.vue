<template>
  <div>


    <div class="scroll">
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
                <div class="item-fields">
                  <h6>{{item._nomenclature.name}}</h6>
                  <h6>Количество : {{item.count}}</h6>
                  <h6>Единица измерения : {{item._nomenclature._measurement.name}}</h6>
                  <h6>Цена за единицу : {{item._product.cost}} &#8381;</h6>
                  <h6>Общая цена {{(item.count * item._product.cost ).toFixed(2)}} &#8381;</h6>
                </div>
              </div>
              <v-divider></v-divider>
            </v-card-text>
          </div>
          <div v-else>
            <v-card-text>
              <h6>
                Сборка пуста
              </h6>
              <v-btn outlined color="info">
                Добавить позицию в сборку
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSubPosition",


  data(){
    return {
      shopProductsDialog : false,
      deleteDialog : false,

      subOrders : [],
      orderPositions : [],

      currentSuborder : {},
      currentItem : {},
      currentSubOrder : {},

    }
  },

  methods : {

    refresh(){
      this.subOrders = []
      this.fetchSubOrders()
    },

    openShopProducts(subOrder){
      this.currentSubOrder = subOrder
      this.shopProductsDialog = true
    },

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


    async fetchOrderPositions(){
      let {data} = await this.$http.get(`marketplace/manager_order_positions/?order=${this.$route.params.id}`)
      this.orderPositions = data
    },

    async fetchSubOrders(){
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

  mounted(){
    this.fetchSubOrders()
    this.fetchOrderPositions()
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

.custom-count {
  width: 130px;
}

</style>