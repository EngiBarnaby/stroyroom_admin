<template>
  <v-container>
    <v-dialog
        @click:outside="closeDeleteNomenclatureDialog"
        v-model="deleteNomenclatureDialog"
        width="500">
      <v-card>
        <v-card-title>
          Вы точно хотите удалить номенклатуру?
        </v-card-title>
        <v-card-actions>
          <v-btn outlined color="error" @click="closeDeleteNomenclatureDialog">Нет</v-btn>
          <v-btn outlined color="success" @click="deleteNomenclature">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row >
      <v-col md="4" class="ml-5">

        <v-col md="4" class="ml-5">
          <v-select
              hide-details
              :items="quantity"
              label="Кол-во"
              v-model="psz"
              @input="fetchData"

          ></v-select>
        </v-col>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-text-field
            hide-details
            append-icon="mdi-magnify"
            label="Поиск"
            placeholder="Поиск"
            v-model="search"
            v-debounce:1s="fetchData"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="end">

    </v-row>
    <v-row justify="space-between" class="mb-4">
      <h4>Список номенклатур</h4>
      <div>
        <v-btn outlined color="success" @click="$router.push('/add-nomenclature')">
          Добавить номенклатуру
        </v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col xs="10" sm="6" md="4" lg="4" v-for="nomenclature in nomenclatures" :key="nomenclature.id" >
        <v-card height="400" class="pa-4" style="overflow: auto;">

          <div class="edit-btn">

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="onDeleteNomenclature(nomenclature)"
                >
                  <v-icon large color="error">
                    mdi-delete-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Удалить</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="goToEditNomenclature(nomenclature)"
                >
                  <v-icon large>
                    mdi-pencil-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Изменить</span>
            </v-tooltip>

          </div>

          <v-card-subtitle>
            <h6>{{nomenclature.name}}</h6>
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-carousel
                    cycle
                    hide-delimiters
                    :show-arrows="false"
                    height="auto">
                  <v-carousel-item
                      show-arrows-on-hover
                      hide-delimiters
                      v-for="(item,i) in nomenclature.images"
                      :key="i"
                      :src="item"
                  ></v-carousel-item>
                </v-carousel>
              </v-col>
              <v-col cols="8">
                <div v-if="nomenclature._category">
                  Категория : {{nomenclature._category}}
                </div>
                <div v-else>
                  Категория нет
                </div>
                <div v-if="nomenclature._sub_category">
                  Подкатегория : {{nomenclature._sub_category}}
                </div>
                <div v-else>
                  Подкатегория нет
                </div>
                <div v-if="nomenclature._measurement">
                  Единица измерения : {{nomenclature._measurement.name}}
                </div>
                <div v-else>
                  Единица измерения нет
                </div>

                <v-row justify="center" class="mt-2 mb-2">
                  <h6>Габариты</h6>
                </v-row>

                <div>Высота : {{nomenclature.height}}</div>
                <div>Ширина : {{nomenclature.width}}</div>
                <div>Длина : {{nomenclature.long}}</div>
                <div>Вес : {{nomenclature.weight}}</div>

              </v-col>
            </v-row>
            Описание : {{nomenclature.description}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

<!--    <v-data-table-->
<!--        :items="nomenclatures"-->
<!--        :headers="tableHeaders"-->
<!--        disable-pagination-->
<!--        hide-default-header-->
<!--        :hide-default-footer="true"-->
<!--        class="elevation-1 table-bordered"-->
<!--        @dblclick:row="goToEditNomenclature"-->
<!--    >-->

<!--      <template v-slot:header="{ props }">-->
<!--        <th  v-for="(head, i) in props.headers" class="header-text" :key="i" style="{font-size: 8px}">{{ head.text }}</th>-->
<!--      </template>-->

<!--      <template v-slot:no-data>-->
<!--        <p>Нет данных</p>-->
<!--      </template>-->

<!--    </v-data-table>-->

    <div class="text-center">
      <v-pagination
          v-model="page"
          :length="length"
          :total-visible="7"
          @input="fetchData"
      ></v-pagination>
    </div>

  </v-container>
</template>

<script>
import api from "@/plugins/axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Nomenclatures",

  data(){
    return {
      deleteNomenclatureDialog : false,

      currentNomenclature : {},
      nomenclatures : [],
      // tableHeaders : [
      //   { text: "ID", value: "id"},
      //   { text: "Название", value: "name" },
      //   {text: "Описание", value : "description"},
      //   {text : "Категория", value : "_category"}
      // ],
      page : 1,
      psz : 50,
      quantity : [10, 20, 30, 40, 50],
      count : 0,

      search : "",
    }
  },

  methods : {

    async deleteNomenclature(){
      await api.delete(`marketplace/nomenclature_manager/${this.currentNomenclature.id}`)
      this.nomenclatures = this.nomenclatures.filter(el => el.id !== this.currentNomenclature.id)
      this.closeDeleteNomenclatureDialog()
    },

    closeDeleteNomenclatureDialog(){
      this.currentNomenclature = {}
      this.deleteNomenclatureDialog = false
    },

    onDeleteNomenclature(nomenclature){
      this.currentNomenclature = nomenclature
      this.deleteNomenclatureDialog = true
    },

    goToEditNomenclature(nomenclature) {
      this.$router.push({ name: "edit-nomenclature", params: { id: nomenclature.id } });
    },


    async fetchData(){
      let {data} = await api(`marketplace/nomenclature_manager/?psz=${this.psz}&page=${this.page}&search=${this.search}`)
      this.count = data.count
      this.nomenclatures = data.results
    }
  },

  computed : {
    length(){
      return Math.ceil(this.count / this.psz)
    },
  },

  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>

.edit-btn {
  position: absolute;
  top: 2px;
  right: 5px;
}


</style>