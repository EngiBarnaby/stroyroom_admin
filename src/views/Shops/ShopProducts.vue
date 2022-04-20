<template>
  <div>

    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>
    <v-container>

      <v-row >
        <v-col md="4" class="ml-5">
          <v-select
              :items="quantity"
              label="Кол-во"
              v-model="psz"

          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4">
          <v-text-field
              append-icon="mdi-magnify"
              label="Поиск"
              placeholder="Поиск"
              v-model="search"
              v-debounce:1s="onSearch"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <h4>Компания :{{shop._company}}</h4>
      </v-row>

      <v-row justify="center">
        <h4>Адрес :{{shop.address}}</h4>
      </v-row>

      <v-row>
        <v-col cols="3" v-for="(product) in products" :key="product.id">
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
          </v-card>
        </v-col>
      </v-row>

<!--      <v-data-table-->
<!--          :items="nomenclatures"-->
<!--          :headers="tableHeaders"-->
<!--          disable-pagination-->
<!--          hide-default-header-->
<!--          :hide-default-footer="true"-->
<!--          class="elevation-1 table-bordered"-->
<!--      >-->

<!--        <template v-slot:header="{ props }">-->
<!--          <th  v-for="(head, i) in props.headers" class="header-text" :key="i" style="{font-size: 8px}">{{ head.text }}</th>-->
<!--        </template>-->

<!--        <template v-slot:no-data>-->
<!--          <p>Нет данных</p>-->
<!--        </template>-->

<!--      </v-data-table>-->

      <div class="text-center">
        <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
            @input="fetchData"
        ></v-pagination>
      </div>

    </v-container>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "NomenclaturesShops",


  data(){
    return {
      shop : {},
      products : [],
      tableHeaders : [
        { text: "ID", value: "id"},
        { text: "Название", value: "_nomenclature.name" },
        {text: "Описание", value : "_nomenclature.description"},
        {text : "Категория", value : "_nomenclature._category"},
        {text : "Количество", value : "count"}
      ],
      page : 1,
      psz : 50,
      quantity : [10, 20, 30, 40, 50],
      count : 0,

      search : "",
    }
  },

  methods : {


    onSearch(){
      this.fetchData()
    },

    async fetchData(){
      let {data} = await this.$http.get(`marketplace/nomenclature_manager_products/?shop=${this.$route.params.id}&psz=${this.psz}&page=${this.page}&search=${this.search}`)
      this.count = data.count
      this.products = data.results
    },

    async fetchShopDetails(){
      let {data} = await this.$http.get(`marketplace/shop/${this.$route.params.id}/`)
      this.shop = data
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchData()
    this.fetchShopDetails()
  }
}
</script>

<style scoped>

.header-text {
  padding: 10px;
}

</style>