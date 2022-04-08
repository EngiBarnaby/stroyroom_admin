<template>
  <v-app>
    <AppBar  v-if="this.$route.name !== 'login'" />
    <Sidebar  v-if="this.$route.name !== 'login'" />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";

export default {
  name: 'App',
  components: {AppBar, Sidebar},
  data(){
    return {

    }
  },
  mounted() {
    console.log(this.$route)
  }

};
</script>
