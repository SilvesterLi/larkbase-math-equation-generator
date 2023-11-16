import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import {i18n} from './locales/i18n.js'



import VueMathjax from 'vue-mathjax-next';
const app = createApp(App);
app.use(i18n)
app.use(VueMathjax)
app.mount('#app')
