<template>
  <the-background></the-background>
  <router-view></router-view>
</template>

<script>
import SmoothScroll from 'smooth-scroll';
import TheBackground from './components/layout/Background.vue';

export default {
  created() {
    new SmoothScroll('a[href*="#"]', {
        speed: 500,
        speedAsDuration: true,
    });
  },
  components: {
    TheBackground,
  },
  name: 'app',
};
</script>
