<template>
  <div class="page-title">
    <app-icon
      v-if="$route.name !== 'home'"
      class="page-title__back"
      icon="mdiArrowLeft"
      title="На главную"
      @click="$router.push('/')"
    ></app-icon>
    <h1 class="page-title__name">{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import AppIcon from '../ui/Icon.vue';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  components: {
    AppIcon,
  },
  name: 'page-title',
};
</script>

<style lang="stylus">
.page-title
  display flex
  column-gap 20px
  align-items center
  &__back
    cursor pointer
  &__name
    color $titleColor
    font-size 40px
    margin 0
    font-family $fontFirst
</style>
