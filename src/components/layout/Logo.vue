<template>
  <div class="logo">Твой фотограф Kira Sekira</div>
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
  letter-spacing .2em
  line-height 1.6
  font-family 'Playfair Display', serif
  text-transform uppercase

  @media (max-width: 1400px)
    font-size 30px
</style>
