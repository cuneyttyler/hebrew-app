<template>
    <div class="my-nav btn-group d-flex justify-content-start" role="group" aria-label="Learning Hebrew">
      <router-link to="/"><button type="button" class="btn" :class="{'btn-secondary': page == 'Vocabulary'}" @click="page = 'Vocabulary'">Vocabulary</button></router-link>
      <router-link to="/memory"><button type="button" class="btn" :class="{'btn-secondary': page == 'Memory'}" @click="page = 'Memory'">Memory</button></router-link>
    </div>
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  },
  data() {
    return {
      page: 'Vocabulary'
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
