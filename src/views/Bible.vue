<template>
    <div class="row">
        <div class="col-md-4">
            <select v-model="selectedSection">
                <option v-for="section, i in books" v-bind:value="i">{{ section.section }}</option>
            </select>
        </div>
        <div class="col-md-3">
            <select v-model="selectedBook">
                <option v-for="book, i in books[selectedSection].books" v-bind:value="i">{{ book }}</option>
            </select>
        </div>
        <div class="col-md-3">
            <select v-model="selectedChapter">
                <option v-for="chapter in numChapters" v-bind:value="chapter - 1">{{ chapter}}</option>
            </select>
        </div>
        <div class="d-flex justify-content-end col-md-8">
            English: <input type="checkbox" v-model="showEn">&nbsp;
            Hebrew: <input type="checkbox" v-model="showHe">
        </div>
    </div>
    <div class="row text" v-if="showText">
        <div class="col-md-12">
            <table>
                <tbody>
                    <tr v-for="verse, i in text[selectedChapter]">
                        <td>{{ i + 1 }}. </td>
                        <td v-if="showEn">
                            {{verse.en}}
                        </td>
                        <td v-if="showHe">
                            {{verse.he}}
                        </td>
                        <td>
                            <button type="button" class="btn btn-secondary" @click="showLemmas(i)">Lemmas</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled: isFirstChapter()}"><a class="page-link" href="#" @click="previousChapter()">Previous</a></li>
        <li class="page-item" :class="{disabled: isLastChapter()}"><a class="page-link" href="#" @click="nextChapter()">Next</a></li>
      </ul>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
    components: {
        
    },
    data() {
        return {
            page: "Bible",
            books: [
                {section: "Pentateuch" , books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]},
                {section: "Major Prophets", books: ['Joshua', 'Judges', 'Samuel I', 'Samuel II', 'Kings I', 'Kings II', 'Isaiah', 'Jeremiah', 'Ezekiel']},
                {section: "Minor Prophets", books: ['Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi']},
                {section: "Writings", books: ['Psalms', 'Proverbs', 'Job', 'Song of Songs', 'Ruth', 'Lamentations', 'Ecclesiastes', 'Esther', 'Daniel', 'Ezra', 'Nehemiah', 'Chronicles I', 'Chronicles II']}
            ],
            selectedSection: 0,
            selectedBook: 0,
            selectedChapter: 0,
            text: [],
            showText: false,
            showEn: true,
            showHe: true
        }
    },
    computed: {
        numChapters: function() {
            return this.text ? this.text.length : 0
        }
    },
    watch: {
        selectedSection: function(newVal) {
            this.$bus.trigger('section_selected', newVal)
            this.selectedBook = 0
            this.selectedChapter = 0
            this.loadBook(newVal, 0)
        },
        selectedBook: function(newVal) {
            this.$bus.trigger('book_selected', newVal)
            this.selectedChapter = 0
            this.loadBook(this.selectedSection, newVal)
        },
        selectedChapter: function(newVal) {
            this.$bus.trigger('chapter_selected', newVal)
            this.selectedChapter = newVal
        },
        showEn: function(newVal) {
            if(!newVal) {
                this.showHe = true
            }
        },
        showHe: function(newVal) {
            if(!newVal) {
                this.showEn = true
            }
        }
    },
    created() {
        this.selectedSection = this.$route.params.selectedSection
        let selectedBook = this.$route.params.selectedBook
        setTimeout(() => {
            this.selectedBook = selectedBook
            setTimeout(() => {
                let selectedChapter = this.$route.params.selectedChapter
                this.selectedChapter = selectedChapter
                this.showText = true
            }, 50)
        }, 50)
    },
    methods: {
        loadBook(sectionIndex:number, bookIndex: number) {
            // @ts-ignore
            window.electron.loadBook(parseInt(sectionIndex), parseInt(bookIndex), (data) => {
                this.text = []
                for(let i in data.en) {
                    let chapter = []
                    for(let j in data.en[i]) {
                        chapter.push({"en": data.en[i][j], "he": data.he[i][j]})
                    }
                    this.text.push(chapter)
                }
            })
        },
        showLemmas(index) {
            this.$bus.trigger('show_lemmas', {
                indexes: [parseInt(this.selectedSection) + 1, parseInt(this.selectedBook) + 1, parseInt(this.selectedChapter) + 1, parseInt(index) + 1], 
                verse: {
                    section: this.books[this.selectedSection].section,
                    book: this.books[this.selectedSection].books[this.selectedBook],
                    chapter: this.selectedChapter,
                    verseIndex: index,
                    text: this.text[this.selectedChapter][index]
                }})
        },
        isFirstChapter() {
            return this.selectedChapter == 0
        },
        isLastChapter() {
            return this.selectedChapter == this.text.length - 1
        },
        previousChapter() {
            this.selectedChapter--;
        },
        nextChapter() {
            this.selectedChapter++;
        }
    }
})
</script>

<style scoped>
.text {
    margin-top: 20px;
}
.text table {
    border-collapse: separate;
    border-spacing: 0.5em;
}
.text table tr td {
    padding-left: 10px;
    text-align: left;
    vertical-align: top;
    font-size: 16pt;
}
</style>
