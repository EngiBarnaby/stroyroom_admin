<template>
  <div>
    <h2 class="title">
      Продукты магазина : {{subOrder._shop.address}}
    </h2>
    <div class="search-wrapper">
      <div class="search-field">
        <v-text-field  placeholder="Поиск по продуктам" v-debounce:1s="onSearch" v-model="search"/>
      </div>
    </div>
    <v-row>
      <v-col cols="3" v-for="(product) in shopProducts" :key="product.id">
        <v-card height="500">
          <v-card-subtitle>
            <h6>{{product._nomenclature.name}}</h6>
          </v-card-subtitle>
          <v-card-text class="custom-cart">
            <div>
              <div class="custom-carousel">
                <v-carousel hide-delimiters
                            :show-arrows-on-hover="true"
                            height="auto">
                  <v-carousel-item
                      show-arrows-on-hover
                      hide-delimiters
                      v-for="(item,i) in product._nomenclature.images"
                      :key="i"
                      :src="item"
                  ></v-carousel-item>
                </v-carousel>
              </div>
              <div class="product-info">
                <h6>Количество в магазине : {{product.count}}</h6>
                <h6>Единица измерения : {{product._nomenclature._measurement.name}}</h6>
                <h6>Цена : {{product.cost}}&#8381;</h6>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center" align="center">
              <div class="text-field">
                <v-text-field
                    v-model="product.currentCount"
                    prepend-icon="mdi-minus-circle-outline"
                    append-outer-icon="mdi-plus-circle-outline"
                    type="number"
                    @input="setValue($event, product)"
                    @click:prepend="subtract(product)"
                    @click:append-outer="add(product)"
                ></v-text-field>
              </div>
              <v-btn color="success"
                     class="add-btn"
                     outlined
                     @click="addToSubOrder(product)"
              >
                Добавить
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div class="pagination">
      <v-pagination
          v-model="page"
          :length="length"
          :total-visible="7"
          @input="fetchProducts"
      ></v-pagination>
    </div>

    <v-snackbar
        v-model="successAdd"
        :timeout="2000"
        color="success"
        outlined
    >
      Товар успешно добавлен в сборку

    </v-snackbar>

  </div>
</template>

<script>


export default {
  name: "ShopPositions",
  props : ["subOrder", "orderId"],

  data(){
    return {
      successAdd : false,

      shopProducts : [],

      psz : 50,
      search : "",
      page : 1,
      count : 0,
    }
  },

  methods : {

    async addToSubOrder(product){
      if(product.currentCount > 0){
        try{
          await this.$http.post(`marketplace/manager_sub_order_positions/add_position_to_suborder/`, {
            "product" : product.id,
            "nomenclature" : product.nomenclature,
            "sub_order" : this.subOrder.id,
            "count" : product.currentCount
          })

          await this.$http.post(`marketplace/manager_order_positions/add_position_in_order/`, {
            "product" : product.id,
            "nomenclature" : product.nomenclature,
            "order" : this.orderId,
            "count" : product.currentCount,
            "shop" : this.subOrder.shop,
            "cost" : product.cost,
          })

          this.$emit("refresh")
          this.successAdd = true
        }
        catch (e){
          console.log(e)
        }
      }
    },

    setValue(e, product){
      if(e < 0){
        product.currentCount = 0
      }
      else if(e > product.count){
        product.currentCount = product.count
      }
      else{
        product.currentCount = e
      }
    },

    subtract(product){
      if(product.currentCount > 0)
        product.currentCount -= 1
      else {
        product.currentCount = 0
      }
    },

    add(product){
      if(product.count > product.currentCount){
        product.currentCount += 1
      }
    },

    onSearch(){
      this.fetchProducts()
    },

    async fetchProducts(subOrder){
      let {data} = await this.$http.get(`marketplace/nomenclature_manager_products/?shop=${this.subOrder._shop.id}&search=${this.search}&page=${this.page}`)
      this.count = data.count
      let results = data.results
      results = results.map(function (el){
        for(let i = 0; i < subOrder.positions.length; i++){
          if(el.id === subOrder.positions[i].product){
            el.currentCount = subOrder.positions[i].count
            return el
          }
        }
          el.currentCount = 0
          return el
        })
      this.shopProducts = results
      console.log(this.shopProducts)
    }
  },

  watch : {
    shop(){
      this.fetchProducts(this.subOrder)
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchProducts(this.subOrder)
  }

}
</script>


<style scoped>

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.search-field {
  width: 600px ;
}

.search-wrapper {
  display: flex;
  justify-content: center;
}

.text-field {
  width: 130px;
  margin-right: 10px;
}

/*.card-actions {*/
/*  display: flex;*/
/*  justify-content: center !important;*/
/*  align-items: center !important;*/
/*}*/

.product-info {
  margin-top: 25px;
}

.custom-cart {
  display: flex;
  justify-content: center;
}

.title {
  display: flex;
  justify-content: center;
}

.custom-carousel {
  height: 200px;
  width: 200px;
}

</style>