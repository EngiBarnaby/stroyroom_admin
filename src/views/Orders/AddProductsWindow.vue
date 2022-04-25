<template>
  <div>

    <v-row align="center">

      <v-col cols="3">
        <v-select
            :items="quantity"
            label="Кол-во"
            v-model="psz"
            @input="fetchProducts"

        ></v-select>
      </v-col>

      <v-col cols="3">
        <v-text-field  placeholder="Поиск по продуктам" v-debounce:1s="fetchProducts" v-model="search"/>
      </v-col>

      <v-col cols="3">
        <v-autocomplete
            background-color="white"
            v-model="shopSelected"
            :items="shops"
            :item-text="item => item._company + ` ${item.address}`"
            item-value="id"
            label="Магазин"
            clearable
            no-data-text="Нет доступных данных"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" v-for="(product) in products" :key="product.id" class="scroll">
        <v-card height="600" >
          <v-card-subtitle>
            <p>{{product._nomenclature.name}}</p>
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
               <h6> Магазин : {{product._shop}}</h6>
                <h6>Цена : {{product.cost}}</h6>
              </div>
            </div>
          </v-card-text>
            <v-row justify="center">
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
            </v-row>
            <v-row justify="center">
              <v-btn outlined color="success" @click="addProducts(product)">
                Выбрать
              </v-btn>
            </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-pagination
          v-model="page"
          :length="length"
          :total-visible="7"
          @input="fetchProducts"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddProductsWindow",

  data(){
    return {
      products : [],
      shops : [],


      shopSelected : "",

      page : 1,
      psz : 50,
      quantity : [10, 20, 30, 40, 50],
      count : 0,

      search : "",
    }
  },

  methods : {

    addProducts(product){
      this.$emit("addProduct", product)
    },

    setValue(e, product){
      if(e < 0){
        product.currentCount = 1
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
        product.currentCount = 1
      }
    },

    add(product){
      if(product.count > product.currentCount){
        product.currentCount += 1
      }
    },

    async fetchProducts(){
      let {data} = await this.$http.get(`marketplace/nomenclature_manager_products/?psz=${this.psz}&page=${this.page}` + this.searchUrl + this.shopUrl)
      let newData = data.results.map(el => {
        el.currentCount = 1
        return el
      })
      this.count = data.count
      this.products = newData
    },

    async fetchShops(){
      let { data } = await this.$http.get("marketplace/shop/get_all_shops/")
      this.shops = data
    },

  },

  watch : {
    shopSelected(){
      this.fetchProducts()
    }
  },

  computed : {

    searchUrl(){
      if(this.search){
        return `&search=${this.search}`
      }
      else {
        return ""
      }
    },

    shopUrl(){
      if(this.shopSelected){
        return `&shop=${this.shopSelected}`
      }
      else{
        return ""
      }
    },

    length(){
      return Math.ceil(this.count / this.psz)
    },
  },


  mounted() {
    this.fetchProducts()
    this.fetchShops()
  }

}
</script>

<style scoped>

.custom-carousel {
  height: 150px;
  width: 150px;
}

.scroll {
  height: 100vh;
  overflow-y: auto;
}

.text-field {
  width: 130px;
  margin-right: 10px;
}

/*.search-field {*/
/*  width: 600px ;*/
/*}*/

/*.search-wrapper {*/
/*  display: flex;*/
/*  justify-content: center;*/
/*}*/


</style>