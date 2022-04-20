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
              @input="fetchShops"

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

      <v-data-table
          :items="shops"
          :headers="tableHeaders"
          disable-pagination
          hide-default-header
          :hide-default-footer="true"
          class="elevation-1 table-bordered"
          @dblclick:row="goListProductsShop"
      >

        <template v-slot:header="{ props }">
          <th  v-for="(head, i) in props.headers" class="header-text" :key="i" style="{font-size: 8px}">{{ head.text }}</th>
        </template>

        <template v-slot:no-data>
          <p>Нет данных</p>
        </template>

      </v-data-table>

      <div class="text-center">
        <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
            @input="fetchShops"
        ></v-pagination>
      </div>

    </v-container>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Shops",

  data(){
    return {
      shops : [],

      tableHeaders : [
        { text: "ID", value: "id"},
        { text: "Город", value: "_city" },
        { text: "Компания", value: "_company" },
        { text: "Адрес", value: "address" },
        {text: "Описание", value : "description"},
      ],

      page : 1,
      psz : 50,
      quantity : [10, 20, 30, 40, 50],
      count : 0,

      search : "",
    }
  },

  methods : {

    goListProductsShop(e, { item }) {
      this.$router.push({ name: "shop-products", params: { id: item.id } });
    },

    onSearch(){
      this.fetchShops()
    },

    async fetchShops(){
      try {
        let {data} = await this.$http.get(`marketplace/shop/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
        this.count = data.count
        this.shops = data.results
      }
      catch (e) {
        console.log(e)
      }
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchShops()
  }

}
</script>

<style scoped>

.header-text {
  padding: 10px;
}

</style>