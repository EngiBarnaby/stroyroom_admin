<template>
  <div>

    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>

    <v-row justify="center">
      <v-col cols="8">
        <v-card class="pa-4">
          <v-row justify="center">
            <h3>
              Добавление типа машин
            </h3>
          </v-row>
          <v-form v-model="isValid" @submit.prevent="addCarType">
            <v-text-field
                label="Название"
                v-model="carType.name"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-text-field
                label="Высота"
                v-model="carType.height"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-text-field
                label="Ширина"
                v-model="carType.width"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-text-field
                label="Длина"
                v-model="carType.long"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-text-field
                label="Максимальный вес"
                v-model="carType.max_weight"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-text-field
                label="Коэффициент загрузки"
                v-model="carType.load_capacity"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-file-input
                label="Изображение"
                @change="onFileSelected($event)"
                :rules="[(v) => !!v || 'Обязательное поле']"
            />
            <v-card-actions>
              <v-row justify="center">
                <v-btn :disabled="!isValid" outlined color="success" type="submit">Сохранить</v-btn>
              </v-row>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
        outlined
        v-model="successSnackbar"
        color="success"
        timeout="2000"
    >
      Изменения успешно сохранены

    </v-snackbar>

  </div>
</template>

<script>
export default {
  name: "AddCarType",

  data(){
    return {
      successSnackbar : false,
      isValid : false,
      carType : {},
    }
  },

  methods : {

    onFileSelected(event){
      this.carType.file = event
    },


    async addCarType(){
      try{
        let fd = new FormData();
        fd.append("name", this.carType.name);
        fd.append("height", this.carType.height);
        fd.append("width", this.carType.width);
        fd.append("long", this.carType.long);
        fd.append("max_weight", this.carType.max_weight);
        fd.append("load_capacity", this.carType.load_capacity);
        fd.append("img", this.carType.file)
        await this.$http.post("marketplace/logist_manager_car_type/", fd)
        this.successSnackbar = true
      }
      catch (e) {
        console.log(e)
      }
    }

  }

}
</script>

<style scoped>

</style>