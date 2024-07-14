import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import { createNotivue } from 'notivue'

import router from './router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { fullscreenImagePlugin } from 'vue-3-fullscreen-image-directive-plugin';
import 'vue-3-fullscreen-image-directive-plugin/style.css';
import 'notivue/notification.css'
import 'notivue/notification-progress.css'
import 'notivue/animations.css'

import './axios';
import './index.css';

import App from './App.vue';

const pinia = createPinia();
const notivue = createNotivue({
  position: 'top-right',
  enqueue: true,
  limit: 5,
  notifications: {
    global: {
      duration: 3000
    }
  }
})

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(notivue)
app.use(router)
app.use(fullscreenImagePlugin)
app.mount('#app')
