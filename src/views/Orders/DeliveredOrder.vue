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
              @input="fetchDeliveredOrders"

          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4">
          <v-text-field
              append-icon="mdi-magnify"
              label="Поиск"
              placeholder="Поиск"
              v-model="search"
              v-debounce:1s="fetchDeliveredOrders"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-data-table
          :items="orders"
          :headers="tableHeaders"
          disable-pagination
          hide-default-header
          :hide-default-footer="true"
          class="elevation-1 table-bordered"
          @dblclick:row="goToOrderDetails"
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

        <template  v-slot:[`item.delivery_type`]='{ item }'>
          <div v-if="item.delivery_type === 'pickup_min_points'">
            <p>Наименьшее количество точек (самовывоз)</p>
          </div>

          <div v-if="item.delivery_type === 'pickup_nearest_points'">
            <p>Ближайший точки (самовывоз)</p>
          </div>

          <div v-if="item.delivery_type === 'pickup_min_cost'">
            <p>Лучшая цена (самовывоз)</p>
          </div>

          <div v-if="item.delivery_type === 'pickup_min_points'">
            <p>Наименьшее количество точек (самовывоз)</p>
          </div>

          <div v-if="item.delivery_type === 'delivery_today'">
            <p>Лучшая цена (доставка)</p>
          </div>

          <div v-if="item.delivery_type === 'delivery_starting_tomorrow'">
            <p>Меньше ехать (доставка)</p>
          </div>

          <div v-if="item.delivery_type === 'delivery_min_cost'">
            <p>Быстро (доставка)</p>
          </div>
        </template>

        <template  v-slot:[`item.actions`]='{ item }'>
          <div class="appoint-btn">
            <v-btn outlined color="info" @click="completeOrder(item)">
              Завершить
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
            @input="fetchDeliveredOrders"
        ></v-pagination>
      </div>

    </v-container>
  </div>
</template>

<script>
export default {
  name: "DeliveredOrder",

  data(){
    return {
      orders : [],
      tableHeaders : [
        { text: "ID", value: "id"},
        {text : "адрес" , value : "_address"},
        {text : "Способ доставки", value : "delivery_type"},
        { text: "Примерное время", value: "est_time" },
        {text: "Тип оплаты", value : "payment_method"},
        {text : "Статус", value : "order_status"},
        {text : "Комментарий", value : "comment"},
        {text : "Сумма", value : "cost"},
        {text: 'Действия', value: 'actions'},
      ],

      page : 1,
      psz : 50,
      quantity : [10, 20, 30, 40, 50],
      count : 0,

      search : "",
    }
  },

  methods : {

    goToOrderDetails(e, { item }) {
      this.$router.push({ name: "delivered-order-detail", params: { id: item.id, } });
    },

    async completeOrder(){
      try{
        await this.$http.get(`marketplace/manager_delivered_orders`)
      }
      catch (e) {
        console.log(e)
      }
    },

   async fetchDeliveredOrders(){
      let { data } = await this.$http.get(`marketplace/manager_delivered_orders/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
      this.count = data.count
      this.orders = data.results
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchDeliveredOrders()
  }
}
</script>

<style scoped>

</style>