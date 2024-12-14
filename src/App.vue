<template>
    <div class="my-nav btn-group d-flex justify-content-start" role="group" aria-label="Learning Hebrew">
      <router-link to="/"><button type="button" class="btn" :class="{'btn-secondary': page == 'Vocabulary'}" @click="page = 'Vocabulary'">Vocabulary</button></router-link>
      <router-link to="/memory"><button type="button" class="btn" :class="{'btn-secondary': page == 'Memory'}" @click="page = 'Memory'">Memory</button></router-link>
      <router-link v-bind:to="'/bible/' + selectedSection + '/' + selectedBook + '/' + selectedChapter"><button type="button" class="btn" :class="{'btn-secondary': page == 'Bible'}" @click="page = 'Bible'">Bible</button></router-link>
      <router-link v-bind:to="'/lemmas/' + verseIndex[0] + '/' + verseIndex[1] + '/' + verseIndex[2]  + '/' + verseIndex[3]" v-if="verseIndex.length > 0"><button type="button" class="btn" :class="{'btn-secondary': page == 'Lemmas'}" @click="page = 'Lemmas'">Lemmas</button></router-link>
    </div>
    <router-view></router-view>
    <footer class="d-flex justify-content-end">Powered by&nbsp;<a href="https://www.pealim.com" target="_blank"><i>Pealim.com</i></a>&nbsp;and&nbsp;<a href="https://www.sefaria.org" target="_blank">Sefaria.org</a></footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  },
  data() {
    return {
      page: 'Vocabulary',
      selectedSection: 0,
      selectedBook: 0,
      selectedChapter: 0,
      verseIndex: []
    }
  },
  created() {
    // @ts-ignore
    window.electron.registerEvents()
    this.$bus.on('show_vocab', (data) => {
      this.page = 'Vocabulary',
      this.$router.push({
          path: '/',
          query: data
        })
    })
    this.$bus.on('section_selected', (sectionIndex) => {
      this.selectedSection = sectionIndex
    })
    this.$bus.on('book_selected', (bookIndex) => {
      this.selectedBook = bookIndex
    })
    this.$bus.on('chapter_selected', (chapterIndex) => {
      this.selectedChapter = chapterIndex
    })
    this.$bus.on('show_lemmas', (verse) => {
      this.page = "Lemmas"
      this.verseIndex = verse.indexes
      this.verse = verse.verse
      this.$router.push({
        path: '/lemmas/' + this.verseIndex[0] + '/' + this.verseIndex[1] + '/' + this.verseIndex[2] + '/' + this.verseIndex[3]
      })
    })
    this.$bus.on('fetch_verse', () => {
      this.$bus.trigger('verse', this.verse)
    })
    this.$router.push({
      path: '/'
    })
  }
})
</script>

<style scoped>
.my-nav {
  margin-bottom: 20px;
}
</style>
