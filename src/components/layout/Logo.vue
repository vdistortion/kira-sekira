<template>
  <div class="logo">Твой фотограф Kira Sekira</div>
</template>

<script lang="ts">
export default {
  name: 'the-logo',
};
</script>

<style lang="stylus">
.logo
  display flex
  flex-direction column
  color $titleColor
  text-align center
  font-size 50px
  letter-spacing .2em
  line-height 1.6
  font-family $fontSecond
  text-transform uppercase

  @media (max-width: 1400px)
    font-size 30px
</style>
