<template>
  <div class="logo">
    <span>твой фотограф</span>
    <span class="openhouse">Kira Sekira</span>
  </div>
</template>

<script>
export default {
  name: 'the-logo',
};
</script>

<style lang="stylus">
@require '../../assets/colors.styl'

.logo
  display flex
  flex-direction column
  color $titleColor
  text-align center
  font-size 50px
  font-family monospace
  .openhouse
    font-family Openhouse, sans-serif
    font-size 70px
</style>
