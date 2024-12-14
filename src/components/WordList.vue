<template>
  <div class="wordlist">
    <div class="form-group row">
      <div class="col-md-4">
        <input type="search" class="form-control" id="search" aria-describedby="searchHelp" placeholder="Search..." v-model="search">
      </div>
      <div class="col-md-4 d-flex justify-content-start">
        <button type="button" class="btn" @click="search = ''">Clear</button>
      </div>
      <div class="d-flex col-md-4 justify-content-end">{{ itemCount }} words, {{ pageCount }} pages in total</div>
    </div>
    <table class="table word-list-table">
      <thead class="thead-dark">
          <tr>
              <th>Hebrew</th>
              <th>Transliteration</th>
              <th class="root">Root</th>
              <th>POS</th>
              <th>Pattern</th>
              <th>Translation</th>
              <th>Action</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="word,i in pagedWords()" v-bind:key="i">
              <td><a v-bind:href="word.Url" target="_blank">{{ word.Hebrew }}</a></td>
              <td>{{ word.Transliteration }}</td>
              <td>
                  <a href="#" @click="showRoot(word)">{{ word.Root }}</a>
              </td>
              <td>
                  {{ word.POS }}
              </td>
              <td>
                   <a href="#" @click="showPattern(word)">{{ word.POS_Pattern }}</a>
              </td>
              <td>{{ word.Translation }}</td>
              <td>
                <div class="btn-group" role="group" aria-label="Save" v-if="app_page == 'Vocabulary' && !isSaved(word)">
                  <button type="button" class="btn btn-secondary" @click="save(word)">Save</button>
                </div>
                <div class="btn-group" role="group" aria-label="Delete" v-if="app_page == 'Memory'">
                  <button type="button" class="btn btn-secondary" @click="remove(word)">Remove</button>
                </div>
              </td>
          </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled: isFirstPage()}"><a class="page-link" href="#!" @click="changePage(1)">First</a></li>
        <li class="page-item" :class="{disabled: isFirstPage()}"><a class="page-link" href="#!" @click="changePage(page - 1)">Previous</a></li>
        <li class="page-item" v-if="!isFirstPage()"><a class="page-link" href="#!" @click="changePage(page - 1)">{{page - 1}}</a></li>
        <li class="page-item disabled"><a class="page-link" href="#">{{page}}</a></li>
        <li class="page-item" v-if="!isLastPage() && pageCount > 2"><a class="page-link" href="#!" @click="changePage(page + 1)">{{page + 1}}</a></li>
        <li class="page-item" :class="{disabled: isLastPage()}"><a class="page-link" href="#!" @click="changePage(page + 1)">Next</a></li>
        <li class="page-item" :class="{disabled: isLastPage()}"><a class="page-link" href="#!" @click="changePage(pageCount)">Last</a></li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WordList',
  props: { 
    app_page: String,
    words: Array<any>,
    savedWords: Array<any>,
    paramSearch: String,
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      search: ''
    }
  },
  created() {
    this.search = this.paramSearch ? this.paramSearch : ''
  },
  computed:{
    pageCount: function(){
      return Math.floor(this.filteredWords().length / this.pageSize + 1)
    },
    itemCount: function() {
      return this.filteredWords().length
    }
  },
  watch: {
    // @ts-ignore
    search: function(val) {
      this.page = 1
    }
  },
  methods: {
    filteredWords() {
      if(!this.search || this.search.trim() == '') return this.words

      return this.words.filter((word) => {
        return word.Hebrew.toLowerCase().includes(this.search.trim().toLowerCase()) || word.Transliteration.toLowerCase().includes(this.search.trim().toLowerCase()) 
        || word.Root.toLowerCase().includes(this.search.trim().toLowerCase()) || word.POS.toLowerCase().includes(this.search.trim().toLowerCase()) 
        || word.POS_Pattern.toLowerCase().includes(this.search.trim().toLowerCase()) || word.Translation.toLowerCase().includes(this.search.trim().toLowerCase())
      })

    },
    pagedWords() {
      const first: Number = (this.page - 1) * this.pageSize
      const last: Number = (this.page - 1) * this.pageSize + this.pageSize
      return this.filteredWords().filter((_, index: Number) => {
        return first <= index && index < last
      })
    },
    isFirstPage() {
      return this.page == 1
    },
    isCurrentPage(page: number) {
      return this.page == page
    },
    isLastPage() {
      return this.page == this.pageCount
    },
    changePage(page) {
      this.page = page
    },
    isSaved(word) {
      return this.savedWords.find((w) => w.Id == word.Id) != null
    },
    save(word) {
      // @ts-ignore
      window.electron.saveWord(Object.assign({}, word))
      this.savedWords.push(word)
    },
    remove(word) {
      // @ts-ignore
      window.electron.removeWord(Object.assign({}, word))
      const index = this.words.findIndex((w) => w.Id == word.Id)
      this.words.splice(index, 1)
    },
    showRoot(word) {
      if(this.app_page == 'Vocabulary') { 
        this.search = word.Root
      } else {
        this.$bus.trigger("show_vocab", {search: word.Root})
      }
    },
    showPattern(word) {
      if(this.app_page == 'Vocabulary') { 
        this.search = word.POS_Pattern
      } else {
        this.$bus.trigger("show_vocab", {search: word.POS_Pattern})
      }
    }
  }
})
</script>

<style scoped>
.word-list-table thead tr td.root {
  width: 100px;
}
</style>

