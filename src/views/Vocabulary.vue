<template>
    <WordList :words="words" :savedWords="savedWords" :app_page="page" :paramSearch="search"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WordList from '../components/WordList.vue'

export default defineComponent({
  name: 'App',
  components: {
    WordList
  },
  data() {
    return {
      page: "Vocabulary",
      words: [],
      savedWords: [],
      search: ''
    }
  },
  created() {
    // @ts-ignore
    window.electron.loadData((data) => { 
      data.forEach((d: any) => {
        d["Root_Url"] = d["Root Url"]
        d["POS_Pattern"] = d["POS Pattern"]
        d["POS_Pattern_Url"] = d["POS Pattern Url"]
        delete d["Root Url"]
        delete d["POS Pattern"]
        delete d["POS Pattern Url"]
      })
      this.words = data
    })
    // @ts-ignore
    window.electron.loadMemoryData((data) => { 
      data.forEach((d: any) => {
        d["Root_Url"] = d["Root Url"]
        d["POS_Pattern"] = d["POS Pattern"]
        d["POS_Pattern_Url"] = d["POS Pattern Url"]
        delete d["Root Url"]
        delete d["POS Pattern"]
        delete d["POS Pattern Url"]
      })
      this.savedWords = data
    })

    this.search = this.$route.query ? this.$route.query.search : ''
  }
})
</script>

<style scoped>
</style>
