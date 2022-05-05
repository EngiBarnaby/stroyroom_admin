<template>
  <div>
    <v-tabs
        v-model="tab"
        background-color="transparent"
        color="basil"
        grow
    >
      <v-tab
          v-for="item in items"
          :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item
      >
        <v-card class="pa-4">
          <h6>{{car.name}}</h6>
          <v-row>
            <v-col cols="6">
              <div>
                <v-img :src="car._type.img" width="350"  class="mb-4" />
              </div>
            </v-col>
            <v-col cols="6">
              <h6>Модель : {{car.model}}</h6>
              <h6 class="text--black">Номер : {{car.number}}</h6>
              <h6>Цвет : {{car.color}}</h6>
              <h6>Цена за час макс. : {{car.cost_per_hour_max}}</h6>
              <h6>Цена за час мин. : {{car.cost_per_hour_min}}</h6>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>

      <v-tab-item
      >
        <v-card class="pa-4">
          <v-card-title>
            Контакты
          </v-card-title>
          <v-card v-for="contact in carContacts" :key="contact.id" class="mb-4">
            <v-card-title>
              <v-row align="center">
                <v-col cols="6">
                  {{contact.contact}}
                </v-col>
                <v-col cols="6">
                  <div style="display: flex; justify-content: end;">
                    <div v-if="contact.actual">
                      <h6 style="color:green;">Актуален</h6>
                    </div>
                    <div v-else>
                      <h6 style="color:darkred;">Не актуален</h6>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-subtitle>
              {{contact.description}}
            </v-card-subtitle>
          </v-card>
        </v-card>
      </v-tab-item>

      <v-tab-item
      >
        <v-row justify="center">
          <v-col cols="8">
            <v-text-field hide-details readonly label="Название" :value="car._type.name" />
            <v-text-field hide-details readonly label="Высота" :value="car._type.height" />
            <v-text-field hide-details readonly label="Ширина" :value="car._type.width" />
            <v-text-field hide-details readonly label="Длина" :value="car._type.long" />
            <v-text-field hide-details readonly label="Макс. вес" :value="car._type.max_weight" />
          </v-col>
        </v-row>
      </v-tab-item>

    </v-tabs-items>

  </div>
</template>

<script>
export default {
  name: "CarsInfo",

  props : ["car"],

  data(){
    return {
      carContacts : [],

      tab: 0,
      items: [
        "Машина", "Контакты", "Характеристики",
      ],
    }
  },

  watch : {
    car(){
      this.fetchCarContacts()
    }
  },

  methods : {


    async fetchCarContacts(){
      let {data} = await this.$http.get(`marketplace/car_contacts/?car=${this.car.id}`)
      this.carContacts = data
    },

  },

  mounted() {
    this.fetchCarContacts()
  }

}
</script>

<style scoped>

</style>