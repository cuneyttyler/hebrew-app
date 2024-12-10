import { createRouter, createWebHistory } from 'vue-router'
import Vocabulary from '../views/Vocabulary.vue'
import Memory from '../views/Memory.vue'

const routes = [
  { path: '/', name: "Vocabulary", component: Vocabulary },
  { path: '/memory', name: "Memory", component: Memory },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
