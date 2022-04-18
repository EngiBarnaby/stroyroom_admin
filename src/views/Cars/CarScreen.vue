<template>
  <div class="car-screen-wrapper">

    <div class="icon-back">
      <v-icon x-large @click="$router.go(-1)">
        mdi-arrow-left
      </v-icon>
    </div>

    <v-container>
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
          <Cars />
        </v-tab-item>

        <v-tab-item
        >
          <CarsType />
        </v-tab-item>

      </v-tabs-items>

    </v-container>
  </div>
</template>

<script>
import Cars from "@/views/Cars/Cars";
import CarsType from "@/views/Cars/CarsType";
export default {
  name: "CarScreen",

  components : {Cars, CarsType},

  data(){
    return {
      tab : 0,
      items: ['Машины', 'Типы машин',],
    }
  }
}
</script>

<style scoped>

.car-screen-wrapper {
  position: relative;
}

.icon-back {
  position: absolute;
  left: 0px;
  top : 0px;
}

</style>