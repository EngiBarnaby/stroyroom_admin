<template>
  <div>
    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>
    <v-row justify="center">
      <v-col cols="6">
        <v-card class="pa-4">
          <v-row justify="center">
            <h5>Добавление номенклатуры</h5>
          </v-row>
          <v-form @submit.prevent="addNomenclature" v-model="isValid" >
            <v-text-field label="Название" v-model="nomenclature.name" />

            <v-autocomplete
                class="mb-2"
                background-color="white"
                v-model="nomenclature.category"
                :items="categories"
                item-text="name"
                item-value="id"
                dense
                label="Категория"
                clearable
                no-data-text="Нет доступных данных"
            />

            <v-autocomplete
                class="mb-2"
                background-color="white"
                v-model="nomenclature.measurement"
                :items="measurements"
                item-text="name"
                item-value="id"
                dense
                label="Категория"
                clearable
                no-data-text="Нет доступных данных"
            />

            <v-text-field label="Высота" v-model="nomenclature.height" />

            <v-text-field label="Ширина" v-model="nomenclature.width" />

            <v-text-field label="Длина" v-model="nomenclature.long" />

            <v-text-field label="Вес" v-model="nomenclature.weight" />

            <v-textarea outlined label="Описание" v-model="nomenclature.description" />


            <div class="change-btn">
              <v-btn color="primary" outlined type="submit" :disabled="!isValid">
                Добавить
              </v-btn>
            </div>
          </v-form>
        </v-card>

        <div v-if="isNomenclatureCreate" class="mt-10">
          <v-row justify="center">
            <h5>Добавить изображение</h5>
          </v-row>
          <v-row>
            <v-col cols="4" v-for="img in images" :key="img.id">
              <div class="img">
                <v-img
                    max-height="150"
                    max-width="150"
                    :src="img.img"
                ></v-img>
                <v-btn outlined color="error" class="mt-2">
                  Удалить
                </v-btn>
              </div>
            </v-col>
            <v-col cols="4">
              <v-card class="add-card">
                <v-icon>
                  mdi-plus
                </v-icon>
                <input type="file" @input="addImages" class="image_upload" />
              </v-card>
            </v-col>
          </v-row>
        </div>


      </v-col>
    </v-row>

    <v-snackbar
        v-model="snackbar"
        :timeout="2000"
        color="primary"
        outlined
    >
      Данные успешно изменены

    </v-snackbar>

  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  name: "AddNomenclature",

  data(){
    return {
      isValid : false,
      snackbar : false,
      isNomenclatureCreate : false,

      images : [],
      createdNomenclature : {},
      nomenclature : {},
      categories : [],
      measurements : [],
    }
  },

  methods : {
    // async fetchNomenclature(){
    //   let { data } = await api(`marketplace/nomenclature_manager/${this.$route.params.id}/`)
    //   this.nomenclature = data
    // },

    async addImages(e){
      console.log("It's work")
      let fd = new FormData();
      fd.append("img", e.target.files[0])
      fd.append("nomenclature", this.createdNomenclature.id)
      await api.post(`marketplace/nomenclature_manager_images/`, fd)
      await this.fetchImages()
    },

    async fetchImages(){
      let { data } = await api.get(`marketplace/nomenclature_manager_images/?nomenclature=${this.createdNomenclature.id}`)
      this.images = data
    },

    async addNomenclature(){
      try {
        let { data } = await api.post(`marketplace/nomenclature_manager/`, this.nomenclature)
        this.createdNomenclature = data
        this.isNomenclatureCreate = true
      }
      catch (e) {
        console.log(e)
      }

    },

    async fetchCategories(){
      let {data} = await api.get("marketplace/category/?opt")
      this.categories = data
    },

    async fetchMeasurements(){
      let {data} = await api("marketplace/measurement/?opt")
      this.measurements = data
    },


  },

  mounted() {
    this.fetchCategories()
    this.fetchMeasurements()
  }
}
</script>

<style scoped>

.image_upload:hover {
  cursor: pointer;
}

.image_upload {
  opacity: 0;
  border: none;
  border-radius: 3px;
  background: grey;
  position: absolute;
  left: 0px;
  width: 100%;
  top: 0px;
  height: 100%;
}

.img {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 150px;
  height: 200px;
}


.add-card {
  display: flex;
  justify-content: center;

  width: 150px;
  height: 150px;
  border: 1px solid black;
}

.icon-back {
  padding-top: 25px;
  padding-left: 25px;
}

.change-btn {
  display: flex;
  justify-content: center;
}

</style>