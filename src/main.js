import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueParticles from 'vue-particles';
import MasonryWall from '@yeger/vue-masonry-wall';
import App from './App.vue';
import router from './router';
import './assets/styles.styl';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueParticles)
  .use(MasonryWall)
  .mount('#app');
