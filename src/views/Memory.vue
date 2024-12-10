<template>
    <WordList :words="words" :app_page="page" @show_vocab="showVocab"/>
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
      page: 'Memory',
      words: []
    }
  },
  created() {
    // @ts-ignore
    window.electron.loadMemoryData((data) => { 
      this.words = data
    })
  },
  methods: {
    showVocab(data) {
      this.$emit('show_vocab', data)
    }
  }
})
</script>

<style scoped>
</style>
