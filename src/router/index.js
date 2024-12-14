import { createRouter, createWebHistory } from 'vue-router'
import Vocabulary from '../views/Vocabulary.vue'
import Memory from '../views/Memory.vue'
import Bible from '../views/Bible.vue'
import Lemmas from '../views/Lemmas.vue'

const routes = [
  { path: '/', name: "Vocabulary", component: Vocabulary },
  { path: '/memory', name: "Memory", component: Memory },
  { path: '/bible/:selectedSection/:selectedBook/:selectedChapter', name: 'Bible', component: Bible},
  { path: '/lemmas/:selectedSection/:selectedBook/:selectedChapter/:selectedVerse', name: 'Lemmas', component: Lemmas}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
