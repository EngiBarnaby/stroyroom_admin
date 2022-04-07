<template>
  <div>
    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>
    <v-row justify="center">
      <v-col cols="6">

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
          <v-btn color="primary" outlined @click="changeNomenclature">
            Изменить
          </v-btn>
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
export default {
  name: "NomenclatureDetails",

  data(){
    return {
      snackbar : false,

      nomenclature : {},
      categories : [],
      measurements : [],
    }
  },

  methods : {
    async fetchNomenclature(){
      let { data } = await this.$http.get(`marketplace/nomenclature_manager/${this.$route.params.id}/`)
      this.nomenclature = data
    },

    async fetchCategories(){
      let {data} = await this.$http.get("marketplace/category/?opt")
      this.categories = data
    },

    async fetchMeasurements(){
      let {data} = await this.$http.get("marketplace/measurement/?opt")
      this.measurements = data
    },

    async changeNomenclature(){
      try{
        await this.$http.put(`marketplace/nomenclature_manager/${this.$route.params.id}/`, this.nomenclature)
        this.snackbar = true
      }
      catch (e) {
        console.log(e)
      }
    }

  },

  mounted() {
    this.fetchNomenclature()
    this.fetchCategories()
    this.fetchMeasurements()
  }
}
</script>

<style scoped>

.icon-back {
  padding-top: 25px;
  padding-left: 25px;
}

.change-btn {
  display: flex;
  justify-content: center;
}

</style>