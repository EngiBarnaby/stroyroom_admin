<template>
  <div class="mt-4">
    <div v-for="comment in comments" :key="comment.id">
          <p>{{comment.text}}</p>
      <v-divider></v-divider>
    </div>

    <v-card>
      <v-card-title>
        Добавить комментарий
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addComment">
          <v-textarea outlined v-model="comment" />
          <v-btn outlined color="success" type="submit">
            Добавить
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Comments",

  data(){
    return {
      comment : '',
      comments : [],
    }
  },

  methods : {

    async addComment(){
      try{
        let comment = { text : this.comment, order : this.$route.params.id}
        let {data} = await this.$http.post("marketplace/manager_comment/", comment)
        this.comments.push(data)
        this.comment = ""
      }
      catch (e) {
        console.log(e)
      }
    },

   async fetchComments(){
      try{
        let {data} = await this.$http.get(`marketplace/manager_comment/?order=${this.$route.params.id}`)
        this.comments = data
      }
      catch (e) {
        console.log(e)
      }
    }
  },

  mounted() {
    this.fetchComments()
  }

}
</script>

<style scoped>

</style>