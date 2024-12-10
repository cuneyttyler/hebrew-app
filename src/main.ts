import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import $bus from './services/EventBus'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$bus = $bus;
app.mount('#app')
