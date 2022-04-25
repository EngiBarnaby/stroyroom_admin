<template>
  <div class="main-wrapper">
    <v-btn outlined color="success" class="mb-6 mt-4">
      Добавить позицию
    </v-btn>
    <div v-for="(position, index) in positions" :key="index">
      <div class="position">
        <div class="content-container">
            <div class="custom-carousel">
              <v-carousel hide-delimiters
                          :show-arrows-on-hover="true"
                          height="auto">
                <v-carousel-item
                    show-arrows-on-hover
                    hide-delimiters
                    v-for="(item,i) in position.nomenclature.images"
                    :key="i"
                    :src="item"
                ></v-carousel-item>
              </v-carousel>
            </div>
            <div class="item-fields">
              <h6>{{position.nomenclature.name}}</h6>
              <h6>Количество : {{position.count}}</h6>
              <h6>Единица измерения : {{position.nomenclature._measurement.name}}</h6>
              <h6>Цена за единицу : {{position.cost}} &#8381;</h6>
              <h6>Общая цена {{(position.count * position.cost ).toFixed(2)}} &#8381;</h6>
              <v-text-field

                  :value="position.count"
                  prepend-icon="mdi-minus-circle-outline"
                  append-outer-icon="mdi-plus-circle-outline"
                  type="number"
                  @input="setValue($event, position)"
                  @click:prepend="subtract(position)"
                  @click:append-outer="add(position)"
              ></v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
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
<!--              <v-btn icon><v-icon color="error">mdi-trash-can-outline</v-icon></v-btn>-->
            </div>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderPositionGeneral",

  data(){
    return {
      positions : [],
    }
  },

  methods : {

    async setItemCount(item){
      await this.$http.post(`marketplace/manager_order_positions/${item.id}/change_count/`, {"count" : item.count})
    },

    async fetchPositions(){
      let {data} = await this.$http.get(`marketplace/manager_order_positions/?order=${this.$route.params.id}`)
      this.positions = data
    },

    setValue(e, item){
      item.count = +e
      this.setItemCount(item)
    },

    subtract(item){
      if(item.count > 0)
        item.count -= 1
      else {
        item.count = 0
      }
      this.setItemCount(item)
    },

    add(item){
      item.count += 1
      this.setItemCount(item)
    },

  },

  mounted() {
    this.fetchPositions()
  }
}
</script>

<style scoped>

.item-fields {
  margin-left: 50px;
}

.content-container {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.custom-carousel {
  height: 150px;
  width: 150px;
}

.main-wrapper {
  height: 100vh;
  overflow: auto;
  margin-top: 25px;
}

.v-text-field {
  width: 130px;
}

</style>