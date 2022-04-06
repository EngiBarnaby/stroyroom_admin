<template>
  <div>
    {{aaaaa}}
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Nomenclatures",

  data(){
    return {
      nomenclatures : [],
    }
  },

  methods : {
    async fetchData(){
      let {data} = await this.$http.get("marketplace/nomenclature_manager/")
      this.nomenclatures = data.results
    }
  },

  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>