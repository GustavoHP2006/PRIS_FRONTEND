// import './assets/main.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap"
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useStore } from './stores/useStore'
import piniaPersistedState from 'pinia-plugin-persistedstate';
const app = createApp(App)
const pinia = createPinia()
import { mask } from 'vue-the-mask';

pinia.use(piniaPersistedState)
app.use(createPinia())
app.use(router)
app.directive('mask', mask);
app.config.globalProperties.$store = useStore()
app.config.globalProperties.$router = router
app.config.globalProperties.$axios = axios

app.mount('#app')
