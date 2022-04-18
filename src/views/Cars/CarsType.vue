<template>
  <div>
    <div>
      <v-row>
        <v-col xs="10" sm="6" md="4" lg="4" v-for="(type, index) in carsType" :key="type.id">
          <v-card>
            <v-card-title>
              {{type.name}}
            </v-card-title>
            <v-card-text>
              <h6>Высота {{type.height}}</h6>
              <h6>Высота {{type.height}}</h6>
              <h6>Высота {{type.height}}</h6>
              <h6>Высота {{type.height}}</h6>
            </v-card-text>
            {{type}}{{index}}
          </v-card>
        </v-col>
      </v-row>
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
      carsType : [],

      page : 1,
      count : 0,
      search : "",
      psz : 50,
    }
  },

  methods : {
    async fetchCarsType(){
      let { data } = await this.$http.get(`marketplace/logist_manager_car_type/?psz=${this.psz}&page=${this.page}&search=${this.search}\``)
      console.log(data)
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

</style>