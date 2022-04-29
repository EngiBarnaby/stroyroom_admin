<template>
  <div>

    <v-dialog width="1500" v-model="addPositionDialog">
      <v-card class="pa-4">
        <v-card-title>
          <v-row justify="center">
            Добавление позиций в заказ
          </v-row>
        </v-card-title>
        <AddProductsWindow @addProduct="onAddProduct" />
      </v-card>
    </v-dialog>

    <v-dialog width="550" v-model="deleteOrderPositionDialog" @click:outside="closeDeleteDialog">
      <v-card>
        <v-card-title>
          Вы действительно хотите удалить позицию?
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

    <div class="main-wrapper">
<!--      <v-btn outlined color="success" @click="addPositionDialog = true" class="mb-6 mt-4">-->
<!--        Добавить позицию-->
<!--      </v-btn>-->
      <div v-for="(position, index) in positions" :key="index">
        <div class="position">
          <div class="content-container">
            <div class="custom-carousel">
              <v-carousel hide-delimiters
                          :show-arrows-on-hover="true"
                          height="auto">
                <v-carousel-item
                    show-arrows-on-hover
                    hide-delimiters
                    v-for="(item,i) in position.nomenclature.images"
                    :key="i"
                    :src="item"
                ></v-carousel-item>
              </v-carousel>
            </div>
            <div class="item-fields">
              <h6>{{position.nomenclature.name}}</h6>
              <h6>Количество : {{position.count}}</h6>
              <h6>Единица измерения : {{position.nomenclature._measurement.name}}</h6>
              <h6>Цена за единицу : {{position.cost}} &#8381;</h6>
              <h6>Общая цена {{(position.count * position.cost ).toFixed(2)}} &#8381;</h6>
              <h6>Магазин : {{position._shop}} {{position.shop_address.address}}</h6>
<!--              <v-text-field-->

<!--                  :value="position.count"-->
<!--                  prepend-icon="mdi-minus-circle-outline"-->
<!--                  append-outer-icon="mdi-plus-circle-outline"-->
<!--                  type="number"-->
<!--                  @input="setValue($event, position)"-->
<!--                  @click:prepend="subtract(position)"-->
<!--                  @click:append-outer="add(position)"-->
<!--              ></v-text-field>-->
<!--              <v-tooltip bottom>-->
<!--                <template v-slot:activator="{ on, attrs }">-->
<!--                  <v-btn-->
<!--                      v-bind="attrs"-->
<!--                      v-on="on"-->
<!--                      icon-->
<!--                      @click="openDeleteDialog(position)"-->
<!--                  >-->
<!--                    <v-icon-->
<!--                        color="error"-->
<!--                    >-->
<!--                      mdi-trash-can-outline-->
<!--                    </v-icon>-->
<!--                  </v-btn>-->
<!--                </template>-->
<!--                <span>Удалить позицию</span>-->
<!--              </v-tooltip>-->
              <!--              <v-btn icon><v-icon color="error">mdi-trash-can-outline</v-icon></v-btn>-->
            </div>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
    </div>
  </div>
</template>

<script>
import AddProductsWindow from "@/views/Orders/AddProductsWindow";
export default {
  name: "OrderPositionGeneral",

  components : {AddProductsWindow},

  data(){
    return {
      deleteOrderPositionDialog : false,
      addPositionDialog : false,

      currentOrderPosition : {},

      positions : [],
    }
  },

  methods : {


    async onAddProduct(product){
      let formData = {
        order : this.$route.params.id,
        cost : product.cost,
        count : product.currentCount,
        shop : product.shop,
        nomenclature : product.nomenclature,
        product : product.id
      }
      await this.$http.post(`marketplace/manager_simple_order_positions/`, formData)
      await this.fetchPositions()
      this.addPositionDialog = false
    },

    async deletePosition(){
      try {
        await this.$http.delete(`marketplace/manager_order_positions/${this.currentOrderPosition.id}/`)
        this.positions = this.positions.filter(el => el.id !== this.currentOrderPosition.id)
        this.closeDeleteDialog()
      }
      catch (e) {
        console.log(e)
      }
    },

    closeDeleteDialog(){
      this.currentOrderPosition = {}
      this.deleteOrderPositionDialog = false
    },

    openDeleteDialog(position){
      this.currentOrderPosition = position
      this.deleteOrderPositionDialog = true
    },

    async setItemCount(item){
      await this.$http.post(`marketplace/manager_order_positions/${item.id}/change_count/`, {"count" : item.count})
    },

    async fetchPositions(){
      console.log("It's from child")
      let {data} = await this.$http.get(`marketplace/manager_order_positions/?order=${this.$route.params.id}`)
      this.positions = data
    },

    setValue(e, item){
      item.count = +e
      this.setItemCount(item)
    },

    subtract(item){
      if(item.count > 0)
        item.count -= 1
      else {
        item.count = 0
      }
      this.setItemCount(item)
    },

    add(item){
      console.log(item)
      item.count += 1
      this.setItemCount(item)
    },

  },

  mounted() {
    this.fetchPositions()
  }
}
</script>

<style scoped>

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

.main-wrapper {
  height: 100vh;
  overflow: auto;
  margin-top: 25px;
}

.v-text-field {
  width: 130px;
}

</style>