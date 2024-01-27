<template>
  <the-background></the-background>
  <router-view></router-view>
</template>

<script lang="ts">
import SmoothScroll from 'smooth-scroll';
import TheBackground from './components/layout/Background.vue';

export default {
  scroll: new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true,
  }),
  provide() {
    return {
      scroll: this.$options.scroll,
    };
  },
  components: {
    TheBackground,
  },
  name: 'app',
};
</script>
