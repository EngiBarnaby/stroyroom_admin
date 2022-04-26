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

};
</script>

<style>

th {
  font-size: 12px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

* {
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
}



* {
  scrollbar-width: 8px;
  scrollbar-color: #0064b8 transparent;
}

/* scroll bar */
*::-webkit-scrollbar {
  width: 8px;               /* ширина scrollbar */
}
*::-webkit-scrollbar-track {
  background: transparent;        /* цвет дорожки */
}
*::-webkit-scrollbar-thumb {
  background-color: #0064b8;    /* цвет плашки */
  border-radius: 20px;       /* закругления плашки */
  border: 1px solid #0064b8;  /* padding вокруг плашки */
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

</style>
