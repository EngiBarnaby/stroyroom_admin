<template>
  <div>

    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>

    <v-container>
      <v-row>
        <v-col cols="5">
          <v-card>
            <v-card-title>
              Заказ №{{order.id}}
            </v-card-title>

            <v-card-text>
              <h6>Адрес : {{order._address}}</h6>
              <h6>Телефон : {{order.phone}}</h6>
              <h6>Статус : {{order.order_status}}</h6>
              <h6>Адрес : {{order._address}}</h6>
              <h6>Оплата сразу :
                <template v-if="order.paid_right_away === true" >
                  Да
                </template>
                <template v-else>
                  Нет
                </template>
              </h6>
            </v-card-text>

          </v-card>
        </v-col>

        <v-col cols="7">

          <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
          >
            <v-tab
                v-for="item in items"
                :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item
            >
              <OrderPositionsReview />
            </v-tab-item>

            <v-tab-item
            >
              <OrderSubPositionsReview />
            </v-tab-item>

          </v-tabs-items>


        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import OrderPositionsReview from "@/views/Orders/OrderPositionsReview";
import OrderSubPositionsReview from "@/views/Orders/OrderSubPositionsReview";
export default {
  name: "OrderDetails",
  components: {OrderSubPositionsReview, OrderPositionsReview},

  data(){
    return {
      deleteDialog : false,

      tab: null,
      items: [
        'Позиций заказа', 'Сборки',
      ],

      order : {},
    }
  },

  methods : {


    async fetchData(){
      let { data } = await this.$http.get(`marketplace/manager_order/${this.$route.params.id}/`)
      this.order = data
    },

  },

  mounted(){
    this.fetchData()
  }
}
</script>

<style scoped>

.custom-count-input {
  display: inline !important;
  width: 50px !important;
}

.content-container {
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