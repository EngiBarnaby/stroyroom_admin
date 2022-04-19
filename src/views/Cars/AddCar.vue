<template>
  <div>

    <v-dialog v-model="carsTypeDialog" width="1000">
      <v-card>
        <CarsTypeForAdd @selectType="selectType"/>
      </v-card>
    </v-dialog>

    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>
    <div>
      <v-row justify="center">
        <v-col cols="6">
          <v-card class="pa-4">
            <v-row justify="center">
              <h3>
                Добавление машины
              </h3>
            </v-row>
            <v-form v-model="isValid" @submit.prevent="addCar">
              <v-text-field
                  label="Название"
                  v-model="car.name"
                  :rules="[(v) => !!v || 'Обязательное поле']"
              />
              <v-text-field
                  v-model="car.model"
                  label="Модель"
                  :rules="[(v) => !!v || 'Обязательное поле']"
              />

              <v-text-field
                  v-model="car.color"
                  label="Цвет"
                  :rules="[(v) => !!v || 'Обязательное поле']"
              />

              <v-text-field
                  hide-details
                  v-model="car.number"
                  label="Номер" />
              <v-text-field
                  hide-details
                  v-model="car.cost_per_hour_max"
                  type="number"
                  label="Цена за час макс."/>
              <v-text-field
                  v-model="car.cost_per_hour_min"
                  type="number"
                  label="Цена за час мин."/>
              <v-row>
                <v-col cols="6">
                  <v-autocomplete
                      readonly
                      class="mb-2"
                      v-model="selectedType"
                      :items="types"
                      item-text="name"
                      item-value="id"
                      dense
                      label="Контрагент"
                      clearable
                      :rules="[(v) => !!v || 'Обязательное поле']"
                      required
                      no-data-text="Нет доступных данных"
                  />
                </v-col>
                <v-col cols="6">
                  <v-btn outlined color="info" @click="openCarTypeDialog">
                    Выбрать тип
                  </v-btn>
                </v-col>
              </v-row>
              <v-textarea
                  hide-details outlined
                  label="Описание"
                  v-model="car.description"
              />
              <v-btn
                  outlined
                  color="success"
                  type="submit"
                  :disabled="!isValid"
                  class="mt-4">
                Добавить
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar
          v-model="successSnackbar"
          color="success"
          timeout="2000"
      >
        Машина успешно добавлена

      </v-snackbar>

    </div>
  </div>
</template>

<script>
import CarsTypeForAdd from "@/views/Cars/CarsTypeForAdd";
export default {
  name: "AddCar",

  components : { CarsTypeForAdd },

  data(){
    return {

      successSnackbar : false,

      selectedType : null,
      types : [],
      car : {},
      carsTypeDialog : false,
      isValid : false,
    }
  },

  methods : {

    selectType(type){
      this.selectedType = type
      this.car.type = type.id
      this.carsTypeDialog = false
    },

    openCarTypeDialog(){
      this.carsTypeDialog = true
    },

    async addCar(){
      await this.$http.post("marketplace/logist_manager_car/", this.car)
      this.successSnackbar = true
    },

    async fetchCarsType(){
      let {data} = await this.$http.get("marketplace/car-type/?opt")
      this.types = data
    }

  },

  mounted() {
    this.fetchCarsType()
  }

}
</script>

<style scoped>

</style>