<template>
  <the-background></the-background>
  <router-view></router-view>
</template>

<script>
import TheBackground from './components/layout/Background.vue';

export default {
  components: {
    TheBackground,
  },
  name: 'app',
};
</script>
