<template>
  <v-app-bar
      color="primary"
      dense
      clipped-left
      dark
      app
  >
    <div class="d-flex align-center">
      <h4>
        StroyRoom Admin
      </h4>
    </div>
    <v-spacer></v-spacer>
    <div>
      <v-btn icon @click="logout">
        <v-icon >
          mdi-exit-to-app
        </v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",

  methods : {
    logout(){
      this.$store.commit("user/logout")
      this.$router.push("/login")
    },
  }

}
</script>

<style scoped>

</style>