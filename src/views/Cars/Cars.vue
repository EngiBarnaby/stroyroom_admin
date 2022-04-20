<template>
  <div>
      <v-container>
        <v-row justify="center" class="mt-4">
          <h2>Список машин</h2>
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
          <v-col>
            <v-row justify="center">
              <v-btn outlined color="success" to="/add-car">
                Добавить машину
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row >
          <v-col xs="10" sm="6" md="4" lg="4"  v-for="(car, index) in cars" :key="car.id">
            <div v-if="car.edit === false" >
              <v-card class="pa-4 car-info" height="500" style="overflow: auto;">
                <div class="edit-btn">
                  <v-tooltip bottom color="white">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon
                             v-bind="attrs"
                             v-on="on"
                      >
                        <v-icon large>
                          mdi-help-circle-outline
                        </v-icon>
                      </v-btn>

                    </template>
                    <v-card width="300" elevation="0" color="white">
                      <v-card-title>
                        {{car._type.name}}
                      </v-card-title>
                      <h6>Высота: {{car._type.height}}</h6>
                      <h6>Ширина: {{car._type.width}}</h6>
                      <h6>Длина: {{car._type.long}}</h6>
                      <h6>Макс. вес: {{car._type.max_weight}} кг.</h6>
                    </v-card>
                  </v-tooltip>


                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon @click="car.edit = true">
                        <v-icon large>
                          mdi-pencil-circle-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Изменить</span>
                  </v-tooltip>

                </div>

                <v-card-subtitle>
                  <h6>{{car.name}}</h6>
                </v-card-subtitle>
                <div>
                  <v-img :src="car._type.img" width="350"  class="mb-4" />
                </div>
                <h6>Модель : {{car.model}}</h6>
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

                  <v-tooltip bottom color="white">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon
                             v-bind="attrs"
                             v-on="on"
                      >
                        <v-icon large>
                          mdi-help-circle-outline
                        </v-icon>
                      </v-btn>

                    </template>
                    <v-card width="300" elevation="0" color="white">
                      <v-card-title>
                        {{car._type.name}}
                      </v-card-title>
                      <h6>Высота: {{car._type.height}}</h6>
                      <h6>Ширина: {{car._type.width}}</h6>
                      <h6>Длина: {{car._type.long}}</h6>
                      <h6>Макс. вес: {{car._type.max_weight}} кг.</h6>
                    </v-card>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon @click="car.edit = false">
                        <v-icon large>
                          mdi-pencil-circle-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Назад</span>
                  </v-tooltip>

                </div>

                <v-card-title>
                  <v-text-field v-model="cars[index].name" lable="Имя"/>
                </v-card-title>
                <v-card-text>
                  <v-text-field hide-details v-model="cars[index].model" label="Модель" />
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
      psz : 10,
      search : "",
      quantity : [10, 20, 30, 40, 50],
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
  top: 0px;
  right: 0px;
}

</style>