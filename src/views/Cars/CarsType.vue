<template>
  <div class="mt-4">
    <div>
      <v-container>
        <v-row justify="center">
          <h2>Список типов машин</h2>
        </v-row>

        <v-row justify="center" align="center">
          <v-col>
            <v-select
                :items="quantity"
                label="Кол-во"
                v-model="psz"
                @input="fetchCarsType"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
                append-icon="mdi-magnify"
                label="Поиск"
                placeholder="Поиск"
                v-model="search"
                v-debounce:1s="fetchCarsType"
            />
          </v-col>
          <v-col>
            <v-row justify="center">
              <v-btn outlined color="success" @click="$router.push('/add-car-type')">
                Добавить тип машины
              </v-btn>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="10" sm="6" md="4" lg="4" v-for="(type, index) in carsType" :key="type.id">

            <div v-if="type.edit == false">
              <v-card class="pa-4" height="450" style="overflow: auto;">
                <div class="edit-btn">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon @click="type.edit = true">
                        <v-icon large>
                          mdi-pencil-circle-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Изменить</span>
                  </v-tooltip>
                </div>

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
                <h6>Коэффициент загрузки : {{type.load_capacity}}</h6>
              </v-card>
            </div>

            <div v-else>
              <v-card>

                <div class="edit-btn">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon @click="type.edit = false">
                        <v-icon large>
                          mdi-pencil-circle-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Назад</span>
                  </v-tooltip>
                </div>

                <v-card-title>
                  <v-text-field label="Название" v-model="carsType[index].name"/>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Высота" type="number" v-model="carsType[index].height" />
                  <v-text-field label="Ширина" type="number" v-model="carsType[index].width" />
                  <v-text-field label="Длина" type="number" v-model="carsType[index].long" />
                  <v-text-field label="Максимальный вес" type="number" v-model="carsType[index].max_weight" />
                  <v-text-field label="Коэффициент загрузки" type="number" v-model="carsType[index].load_capacity" />
                  <v-file-input label="Изображение" @change="onFileSelected(index, $event)"/>
                </v-card-text>
                <v-card-actions>
                  <v-btn outlined color="success" @click="saveType(type)">
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>

          </v-col>
        </v-row>
      </v-container>

      <v-snackbar
          outlined
          v-model="successSnackbar"
          color="success"
          timeout="2000"
      >
        Изменения успешно сохранены

      </v-snackbar>

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
  name: "CarsType",

  data(){
    return {
      selectedFile : null,
      successSnackbar : false,

      carsType : [],

      page : 1,
      count : 0,
      search : "",
      psz : 10,
      quantity : [10, 20, 30, 40, 50],
    }
  },

  methods : {

    onFileSelected(index, event){
      this.carsType[index].file = event
    },

    async saveType(type){
      try{
        if(!type.file){
          let newData = Object.assign({}, type)
          delete newData.img
          await this.$http.put(`marketplace/logist_manager_car_type/${type.id}/`, newData)
          type.edit = false
        }
        else {
          let fd = new FormData();
          fd.append("name", type.name);
          fd.append("height", type.height);
          fd.append("width", type.width);
          fd.append("long", type.long);
          fd.append("max_weight", type.max_weight);
          fd.append("load_capacity", type.load_capacity);
          fd.append("img", type.file)
          let { data } = await this.$http.put(`marketplace/logist_manager_car_type/${type.id}/`, fd)
          let newData = data
          newData.edit = false
          this.carsType = this.carsType.map(el => {
            if(el.id === newData.id){
              return newData
            }
            else{
              return el
            }
          })
        }
        this.successSnackbar = true
      }
      catch (e) {
        console.log(e)
      }
    },

    async fetchCarsType(){
      let { data } = await this.$http.get(`marketplace/logist_manager_car_type/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
      let results = data.results.map(el => {
        el.edit = false
        return el
      })
      this.count = data.count
      this.carsType = results
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

.edit-btn {
  position: absolute;
  top: 0px;
  right: 0px;
}

</style>