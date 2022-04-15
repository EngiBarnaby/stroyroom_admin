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
        <Cars />
      </v-tab-item>

<!--      <v-tab-item-->
<!--      >-->
<!--        <OrderPosition />-->
<!--      </v-tab-item>-->

    </v-tabs-items>

  </div>
</template>

<script>
import Cars from "@/views/Cars/Cars";
export default {
  name: "CarScreen",

  components : {Cars},

  data(){
    return {
      tab : 0,
      items: ['Машины', 'Типы машин',],
    }
  }
}
</script>

<style scoped>

</style>