<template>
  <div>

    <v-dialog v-model="deleteSubOrderDialog" width="500" @click:outside="closeDeleteSubOrderDialog">
      <v-card>
        <v-card-title>
          Вы действительно хотите удалить сборку?
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="closeDeleteSubOrderDialog">
            Нет
          </v-btn>
          <v-btn outlined color="success" @click="deleteSubOrder">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogApprove" width="500" @click:outside="closeApproveDialog">
      <v-card>
        <v-card-title>
          Вы уверены, что хотите подтвердить сборку?
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="closeApproveDialog">
            Нет
          </v-btn>
          <v-btn outlined color="success" @click="approveSubOrder">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="shopProductsDialog" width="1500">
      <v-card class="pa-4">
        <ShopPositions :subOrder.sync="currentSubOrder" @refresh="refresh" />
      </v-card>
    </v-dialog>

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
                  <h6>Количество в магазине : {{item._product.count}}</h6>
                  <v-text-field
                      :value="item.count"
                      prepend-icon="mdi-minus-circle-outline"
                      append-outer-icon="mdi-plus-circle-outline"
                      type="number"
                      @input="setValue($event, item)"
                      @click:prepend="subtract(item)"
                      @click:append-outer="add(item)"
                  ></v-text-field>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon
                          @click="openDeleteDialog(item, subOrder)"
                      >
                        <v-icon
                            color="error"
                        >
                          mdi-trash-can-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Удалить позицию</span>
                  </v-tooltip>
                </div>
              </div>
              <v-divider></v-divider>
            </v-card-text>
              <v-btn outlined color="info" v-if="!subOrder.manager_approve" @click="openShopProducts(subOrder)">
                Добавить позицию в сборку
              </v-btn>
              <v-btn outlined color="success" v-if="!subOrder.manager_approve" class="ml-4" @click="openApproveDialog(subOrder)">
                Подтвердить сборку
              </v-btn>
              <v-btn outlined color="error" v-if="!subOrder.manager_approve" class="mt-4" @click="openDeleteSubOrderDialog(subOrder)">
                Удалить сборку
              </v-btn>
            <h5 v-if="subOrder.manager_approve" class="green--text">
              Сборка подтверждена
            </h5>
          </div>
          <div v-else>
            <v-card-text>
              <h5>
                Сборка пуста
              </h5>
              <v-btn outlined color="info" @click="openShopProducts(subOrder)">
                Добавить позицию в сборку
              </v-btn>
              <v-btn outlined color="error" class="ml-4" @click="openDeleteSubOrderDialog(subOrder)">
                Удалить сборку
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import ShopPositions from "@/views/Orders/ShopPositions";
export default {
  name: "OrderSubPosition",

  components : {
    ShopPositions
  },

  data(){
    return {
      deleteSubOrderDialog : false,
      dialogApprove : false,
      shopProductsDialog : false,
      deleteDialog : false,

      subOrders : [],
      orderPositions : [],

      currentSuborder : {},
      currentItem : {},
      currentSubOrder : {},

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

  methods : {

    closeDeleteSubOrderDialog(){
      this.currentSubOrder = {}
      this.deleteSubOrderDialog = false
    },

    openDeleteSubOrderDialog(subOrder){
      this.currentSubOrder = subOrder
      this.deleteSubOrderDialog = true
    },

    async deleteSubOrder(){
      await this.$http.delete(`marketplace/manager_sub_order/${this.currentSubOrder.id}/`)
      this.subOrders = this.subOrders.filter(el => el.id !== this.currentSubOrder.id)
      this.closeDeleteSubOrderDialog()
    },

    async approveSubOrder(){
      try{
        await this.$http.get(`marketplace/manager_sub_order/${this.currentSubOrder.id}/approve_sub_order_by_order_manager/`)
        // this.subOrders = this.subOrders.filter(el => el.id !== this.currentSubOrder.id)
        this.closeApproveDialog()
      }
      catch (e){
        console.log(e)
      }
    },

    closeApproveDialog(){
      this.currentSubOrder = {}
      this.dialogApprove = false
    },

    openApproveDialog(subOrder){
      this.currentSubOrder = subOrder
      this.dialogApprove = true
    },

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

.v-text-field {
  width: 130px;
}

</style>