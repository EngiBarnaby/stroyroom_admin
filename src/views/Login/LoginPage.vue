<template>
  <div class="wrapper">
      <v-card class="card" width="400">
        <div class="title-wrapper">
          <h1>Stroyroom</h1>
        </div>
        <v-form @submit.prevent="login">
          <v-text-field
              placeholder="Ваш логин"
              dense
              persistent-hint
              outlined
              v-model="username"
              background-color="white"
          ></v-text-field>
          <v-text-field
              placeholder="Пароль"
              dense
              persistent-hint
              outlined
              type="password"
              v-model="password"
              background-color="white"
          ></v-text-field>
          <div class="btn-wrapper">
            <v-btn
                class="custom-btn"
                elevation="2"
                outlined
                type="submit"
                color="blue"
            >
              Войти
            </v-btn>
          </div>
        </v-form>
      </v-card>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  name: "LoginPage",

  data(){
    return {
      username : "",
      password : "",
    }
  },

  methods : {
    async login(){
      api.post('accounts/auth/auth/',{
        username : this.username,
        password : this.password
      })
      .then((response)=>{
        if(response.status === 200) {
          localStorage.setItem("token", response.data.token)
          this.$store.commit('user/setUserData', response.data)
        }
      })
          .then(()=>{
            this.$router.go(0)
          })
      .catch((e)=>{
        console.error(e)
      })

   //   let formData = {
   //     "username" : this.username,
   //     "password" : this.password
   //   }
   //   try{
   //     let userData = await axios.post("accounts/auth/auth/", formData)
   //     await localStorage.setItem("token", userData.data.token)
   //     await this.$store.commit('user/setUserData', userData.data)
   //     await this.$router.push("/")
//
//
   //   }
   //   catch(error){
   //     console.log(error)
   //   }
    },
  },
  mounted() {
  }

}
</script>

<style scoped>

.wrapper {
  display: flex;
  background-color: #0086c0;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.card {
  padding: 25px;
}

.btn-wrapper {
  justify-content: center;
  display: flex;
}

.title-wrapper {
  align-items: center;
  justify-content: center;
  display: flex;
  margin-bottom: 15px;
}

.custom-btn {
  width: 200px;
}

</style>