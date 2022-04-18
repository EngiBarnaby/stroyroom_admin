<template>
  <div>

      <v-container>
        <v-row justify="center">
          <v-col xs="10" sm="6" md="4" lg="4" v-for="(car, index) in cars" :key="car.id">
            <div v-if="car.edit === false" >
              <v-card class="pa-4 car-info" height="300">
                <div class="edit-btn">
                  <v-btn icon @click="car.edit = true">
                    <v-icon>
                      mdi-pencil-circle-outline
                    </v-icon>
                  </v-btn>
                </div>

                <v-card-title>
                  {{car.name}}
                </v-card-title>
                <h6 class="text--black">Номер : {{car.number}}</h6>
                <h6>Цвет : {{car.color}}</h6>
                <h6>Цена за час макс. : {{car.cost_per_hour_max}}</h6>
                <h6>Цена за час мин. : {{car.cost_per_hour_min}}</h6>
                <p>Описание : {{car.description}}</p>
              </v-card>
            </div>
            <div v-else>
              <v-card class="car-info">

                <div class="edit-btn">
                  <v-btn icon @click="car.edit = false">
                    <v-icon>
                      mdi-pencil-circle-outline
                    </v-icon>
                  </v-btn>
                </div>

                <v-card-title>
                  <v-text-field v-model="cars[index].name" lable="Имя"/>
                </v-card-title>
                <v-card-text>
                  <v-text-field hide-details v-model="cars[index].number" label="Номер" />
                  <v-text-field hide-details v-model="cars[index].color" label="Цвет"/>
                  <v-text-field hide-details v-model="cars[index].cost_per_hour_max" type="number" label="Цена за час макс."/>
                  <v-text-field hide-details v-model="cars[index].cost_per_hour_min" type="number" label="Цена за час мин."/>
                  <v-textarea hide-details outlined v-model="cars[index].description" />
                </v-card-text>
                <v-card-actions>
                  <v-btn outlined color="success" @click="save(car)">Сохранить</v-btn>
                </v-card-actions>
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
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Cars",

  data(){
    return {
      cars : [],


      count : 0,
      page : 1,
      psz : 50,
      search : "",
    }
  },

  methods : {

   async save(car){
     let newData = Object.assign({}, car)
     delete newData._type
      try{
        await this.$http.put(`marketplace/logist_manager_car/${car.id}/`, newData)
        car.edit = false
      }
      catch (e) {
        console.log(e)
      }
    },

    async fetchCars(){
      try{
        let { data } = await this.$http.get(`marketplace/logist_manager_car/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
        let resultData = data.results
        resultData = resultData.map(el => {
          el.edit = false
          return el
        })
        this.count = data.count
        this.cars = resultData
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

.car-info {
  position: relative;
}

.edit-btn {
  position: absolute;
  right: 10px;
  height: 10px;
}

</style>