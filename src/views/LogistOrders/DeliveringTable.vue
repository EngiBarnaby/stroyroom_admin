<template>
  <div>
    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>

    <v-dialog v-model="approveDialog" width="500" @click:outside="closeApproveDialog">
      <v-card>
        <v-card-title>
          Вы действитель хотите подтвердить доставку?
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="closeApproveDialog">
            Нет
          </v-btn>
          <v-btn outlined color="success" @click="approveDelivery">
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              v-debounce:1s="fetchDeliveringOrder"
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
          <div>
            <v-btn outlined color="info" @click="openApproveDialog(item)">
              Подтвердить доставку
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <p>Нет заказов</p>
        </template>

      </v-data-table>

      <div class="text-center">
        <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
            @input="fetchDeliveringOrder"
        ></v-pagination>
      </div>

    </v-container>
  </div>
</template>

<script>
export default {
  name: "DeliveringTable",

  data(){
    return {
      approveDialog : false,
      currentOrder : {},

      orders : [],
      currentItem : {},

      tableHeaders : [
        { text: "ID", value: "id"},
        {text : "адрес" , value : "_address"},
        { text: "Примерное время", value: "est_time" },
        {text: "Тип оплаты", value : "payment_method"},
        {text : "Комментарий", value : "comment"},
        {text : "Сумма", value : "cost"},
        {text : "Статус", value : "order_status"},
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

    closeApproveDialog(){
      this.currentOrder = {}
      this.approveDialog = false
    },

    openApproveDialog(order){
      this.currentOrder = order
      this.approveDialog = true
    },

    async approveDelivery(){
      try{
        await this.$http.get(`marketplace/logist_delivering_order/${this.currentOrder.id}/approve_delivery/`)
        await this.fetchDeliveringOrder()
        this.closeApproveDialog()
      }
      catch (e) {
        console.log(e)
      }
    },

    async fetchDeliveringOrder(){
      let { data } = await this.$http.get(`marketplace/logist_delivering_order/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
      this.count = data.count
      this.orders = data.results
    },

  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchDeliveringOrder()
  }
}
</script>

<style scoped>

</style>