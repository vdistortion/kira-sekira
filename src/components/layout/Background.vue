<template>
  <vue-particles class="background" :color="color" :linesColor="color"></vue-particles>
</template>

<script>
export default {
  data() {
    return {
      color: '#99a1b3',
    };
  },
  name: 'the-background',
};
</script>

<style lang="stylus">
.background
  position fixed
  width 100%
  height 100vh
  z-index -1
</style>
