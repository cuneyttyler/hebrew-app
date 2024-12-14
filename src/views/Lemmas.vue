<template>
    <div class="row">
        <div v-if="verse" class="col-md-12">
            {{ verse.book }} {{ verse.chapter + 1 }} : {{ verse.verseIndex + 1 }}
        </div>
    </div>
    <div class="row text">
        <div class="col-md-12">
            <table class="table">
                <tbody>
                    <tr v-if="verse">
                        <td>
                            {{verse.text.en}}
                        </td>
                        <td>
                            {{verse.text.he}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row text">
        <div class="col-md-12">
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                        <th>Full Form</th>
                        <th>Lemma</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lemma in lemmas">
                        <td>{{ lemma.fullForm }}</td>
                        <td><a href="#!" @click="searchLemma(lemma.lemma)">{{ lemma.lemma }}</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
    components: {
        
    },
    data() {
        return {
            page: "Lemmas",
            alphabet: [
                'א', 'ב', 'ד', 'ג', 'ה',
                'ו', 'ז', 'ח', 'ט', 'י',
                'כ', 'ך', 'ל', 'מ', 'ם',
                'נ', 'ן', 'ס', 'ע', 'פ',
                'ף', 'צ', 'ק', 'ר', 'ש',
                'ת'
            ],
            lemmas: [],
            verse: null,
            verseIndex: []
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    created() {
        this.loadVerse([this.$route.params.selectedSection, this.$route.params.selectedBook, this.$route.params.selectedChapter, this.$route.params.selectedVerse])
        this.$bus.on('verse', (verse) => {
            this.verse = verse
        })
    },
    methods: {
        loadVerse(verseIndex) {
            // @ts-ignore
            window.electron.loadVerse([verseIndex[0], verseIndex[1], verseIndex[2], verseIndex[3]], (data) => {
                this.lemmas = []
                data.forEach((d) => {
                    let lemma = []
                    for(let i in d.lemma) {
                        const letter = d.lemma[i]
                        if(this.alphabet.includes(letter)) {
                            lemma.push(letter)
                        }
                    }

                    this.lemmas.push({fullForm: d.fullForm, lemma: lemma.join(' - ')})
                })
                this.$bus.trigger('fetch_verse')
            })
        },
        searchLemma(lemma) {
            this.$bus.trigger("show_vocab", {search: lemma})
        }
    }
})
</script>

<style scoped>
.text table {
    border-collapse: separate;
    border-spacing: 0.5em;
}
.text table tr td {
    padding-left: 10px;
    text-align: left;
    vertical-align: top;
    font-size: 17pt;
}
</style>
