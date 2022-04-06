<template>
  <v-app>
    <AppBar />
    <Sidebar />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Main',
  components: {AppBar, Sidebar},
  comments : {
    AppBar,
  }
}
</script>
