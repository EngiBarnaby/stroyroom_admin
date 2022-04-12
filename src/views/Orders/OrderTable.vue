<template>
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

    <v-data-table
        :items="nomenclatures"
        :headers="tableHeaders"
        disable-pagination
        hide-default-header
        :hide-default-footer="true"
        class="elevation-1 table-bordered"
        @dblclick:row="goToEditNomenclature"
    >

      <template v-slot:header="{ props }">
        <th  v-for="(head, i) in props.headers" class="header-text" :key="i" style="{font-size: 8px}">{{ head.text }}</th>
      </template>


      <template  v-slot:[`item.payment_method`]='{ item }'>
        <p v-if="item.payment_method === 'card'">
          Картой
        </p>
        <p v-if="item.payment_method === 'cash'">
          Наличные
        </p>
      </template>

      <template  v-slot:[`item.actions`]='{ item }'>
        <div v-if="item.order_manager === null" class="appoint-btn">
          <v-btn @click="appointOrder(item)" outlined color="info">
            Взять в работу
          </v-btn>
        </div>
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
          @input="fetchData"
      ></v-pagination>
    </div>

  </v-container>
</template>

<script>
export default {
  name : "OrderTable",

  data(){
    return {
      nomenclatures : [],
      tableHeaders : [
        { text: "ID", value: "id"},
        {text : "адрес" , value : "_address"},
        { text: "Примерное время", value: "est_time" },
        {text: "Тип оплаты", value : "payment_method"},
        {text : "Комментарий", value : "comment"},
        {text : "Сумма", value : "cost"},
        { text: 'Действия', value: 'actions'},
      ],
      page : 1,
      psz : 50,
      quantity : [10, 20, 30, 40, 50],
      count : 0,

      search : "",
    }
  },

  methods : {

   async appointOrder(item){
      await this.$http.get(`marketplace/manager_order/${item.id}/appoint_order/`)
      this.nomenclatures = this.nomenclatures.filter(el => el.id !== item.id)
    },

    goToEditNomenclature(e, { item }) {
      this.$router.push({ name: "edit-nomenclature", params: { id: item.id } });
    },

    onSearch(){
      this.fetchData()
    },

    async fetchData(){
      let {data} = await this.$http.get(`marketplace/manager_order/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
      this.count = data.count
      this.nomenclatures = data.results
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>

.header-text {
  padding: 10px;
}

.appoint-btn {
  display: flex;
  justify-content: center;
}

</style>