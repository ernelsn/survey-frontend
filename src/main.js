import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import router from './router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { fullscreenImagePlugin } from 'vue-3-fullscreen-image-directive-plugin';
import 'vue-3-fullscreen-image-directive-plugin/style.css';

import './axios';
import './index.css';

import App from './App.vue';

const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(fullscreenImagePlugin)
app.mount('#app')
