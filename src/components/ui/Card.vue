<template>
  <div class="card" :class="{ project }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Boolean,
      default: false,
    },
  },
  name: 'app-card',
};
</script>

<style lang="stylus">
@require '../../assets/colors.styl'

.card
  box-sizing border-box
  height 100%
  padding 10px
  box-shadow 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05)
  background-color rgba($projectCard, .7)
  transition background-color .2s
  &.project
    cursor pointer
    min-height 200px
    &:hover
      background-color rgba($hoverCard, .7)
</style>
