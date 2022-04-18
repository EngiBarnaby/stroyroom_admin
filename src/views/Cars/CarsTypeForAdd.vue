<template>
  <div class="mt-4">
    <div>
      <v-container>
        <v-row justify="center">
          <h2>Список типов машин</h2>
        </v-row>

        <v-row justify="center">
          <v-col cols="5">
            <v-select
                :items="quantity"
                label="Кол-во"
                v-model="psz"
                @input="fetchCarsType"
            ></v-select>
          </v-col>
          <v-col cols="5">
            <v-text-field
                append-icon="mdi-magnify"
                label="Поиск"
                placeholder="Поиск"
                v-model="search"
                v-debounce:1s="fetchCarsType"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="10" sm="6" md="4" lg="4" v-for="(type) in carsType" :key="type.id">
            <div>
              <v-card class="pa-4 card" height="450" style="overflow: auto;">
                <v-card-title>
                  {{type.name}}
                </v-card-title>
                <div>
                  <v-img :src="type.img" width="350" />
                </div>
                <h6>Высота: {{type.height}}</h6>
                <h6>Ширина: {{type.width}}</h6>
                <h6>Длина: {{type.long}}</h6>
                <h6>Макс. вес: {{type.max_weight}} кг.</h6>
                <div class="success-btn">
                  <v-btn outlined block color="success" @click="$emit('selectType', type)">
                    Выбрать
                  </v-btn>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="text-center">
      <v-pagination
          v-model="page"
          :length="length"
          :total-visible="7"
          @input="fetchCarsType"
      ></v-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: "CarsTypeForAdd",

  data(){
    return {
      carsType : [],

      page : 1,
      count : 0,
      search : "",
      psz : 10,
      quantity : [10, 20, 30, 40, 50],
    }
  },

  methods : {
    async fetchCarsType(){
      let { data } = await this.$http.get(`marketplace/logist_manager_car_type/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
      this.count = data.count
      this.carsType = data.results
    }
  },


  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },


  mounted() {
    this.fetchCarsType()
  }
}
</script>

<style scoped>

.card {
  position: relative;
  display: block;
}

.success-btn {
  width: 90%;
  position: absolute;
  bottom: 10px;
}

</style>
