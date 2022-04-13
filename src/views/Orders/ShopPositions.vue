<template>
  <div>
    <h2 class="title">
      Продукты магазина : {{shop.address}}
    </h2>
    <div class="search-wrapper">
      <div class="search-field">
        <v-text-field  placeholder="Поиск по продуктам" v-debounce:1s="onSearch" v-model="search"/>
      </div>
    </div>
    <v-row>
      <v-col cols="4" v-for="(product,index) in shopProducts" :key="product.id">
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
                    @click:append-outer="add(index)"
                ></v-text-field>
              </div>
              <v-btn color="success" class="add-btn" outlined>
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
  </div>
</template>

<script>


export default {
  name: "ShopPositions",
  props : ["shop"],

  data(){
    return {
      shopProducts : [],

      psz : 50,
      search : "",
      page : 1,
      count : 0,
    }
  },

  methods : {

    setValue(e, item){
      item.currentCount = e
    },

    subtract(item){
      if(item.currentCount > 0)
        item.currentCount -= 1
      else {
        item.currentCount = 0
      }
    },

    add(index){
      this.shopProducts[index].currentCount += 1
    },

    onSearch(){
      this.fetchProducts()
    },

    async fetchProducts(){
      let {data} = await this.$http.get(`marketplace/nomenclature_manager_products/?shop=${this.shop.id}&search=${this.search}&page=${this.page}`)
      this.count = data.count
      this.shopProducts = data.results
      this.shopProducts = this.shopProducts.map(function (el){
        el.currentCount = 0
        return el
      })
    }
  },

  watch : {
    shop(){
      this.fetchProducts()
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchProducts()
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