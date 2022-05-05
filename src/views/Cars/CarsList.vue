<template>
  <div>

    <div class="scroll">
      <v-container class="mt-4">
        <v-row justify="center" class="mt-4">
          <h3>Список машин</h3>
        </v-row>
        <v-row justify="center" align="center">
          <v-col>
            <v-select
                :items="quantity"
                label="Кол-во"
                v-model="psz"
                @input="fetchCars"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
                append-icon="mdi-magnify"
                label="Поиск"
                placeholder="Поиск"
                v-model="search"
                v-debounce:1s="fetchCars"
            />
          </v-col>
        </v-row>
        <v-row >
          <v-col xs="10" sm="6" md="6" lg="6"  v-for="(car) in cars" :key="car.id">
            <div>
              <v-card class="pa-4 car-info" height="450" style="overflow: auto;">
                <div class="edit-btn">



                  <v-tooltip bottom color="white">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon
                             v-bind="attrs"
                             v-on="on"
                      >
                        <v-icon>
                          mdi-help-circle-outline
                        </v-icon>
                      </v-btn>
                    </template>

                    <v-card width="300" elevation="0" color="white">
                      <h6 class="pt-5">{{car._type.name}}</h6>
                      <h6>Высота: {{car._type.height}}</h6>
                      <h6>Ширина: {{car._type.width}}</h6>
                      <h6>Длина: {{car._type.long}}</h6>
                      <h6>Макс. вес: {{car._type.max_weight}} кг.</h6>
                    </v-card>
                  </v-tooltip>

                </div>

                <h6>{{car.name}}</h6>
                <div>
                  <v-img :src="car._type.img" width="350"  class="mb-4" />
                </div>
                <h6>Модель : {{car.model}}</h6>
                <h6 class="text--black">Номер : {{car.number}}</h6>
                <h6>Цвет : {{car.color}}</h6>
                <h6>Цена за час макс. : {{car.cost_per_hour_max}}</h6>
                <h6>Цена за час мин. : {{car.cost_per_hour_min}}</h6>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <div class="text-center">
        <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
            @input="fetchCars"
        ></v-pagination>
      </div>

    </div>
  </div>
</template>

<script>
export default {

  name: "CarsList",

  data(){
    return {

      pickUpCars : [],

      getCarsDialog : false,

      cars : [],

      count : 0,
      page : 1,
      psz : 10,
      search : "",
      quantity : [10, 20, 30, 40, 50],

    }
  },

  methods : {

    // async fetchCheapCars(){
    //   try{
    //     let {data} = this.$http.get(`marketplace/logist_manager_sub_order`)
    //   }
    // },

    async fetchCars(){
      try{
        let { data } = await this.$http.get(`marketplace/logist_manager_car/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
        this.count = data.count
        this.cars = data.results
      }
      catch (e){
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
    this.fetchCars()
  }

}
</script>

<style scoped>

.scroll {
  height: 100vh;
  overflow: auto;
}

.car-info {
  position: relative;
}

.edit-btn {
  position: absolute;
  top: 0px;
  right: 0px;
}

</style>
