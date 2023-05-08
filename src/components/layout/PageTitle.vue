<template>
  <div class="page-title">
    <app-icon
      v-if="$route.name !== 'home'"
      class="page-title__back"
      icon="mdiArrowLeft"
      title="На главную"
      @click="$router.push('/')"
    ></app-icon>
    <a v-if="link" class="page-title__link" :href="link" target="_blank">
      <h1 class="page-title__name">
        {{ title }}
        <app-icon icon="mdiLinkVariant"></app-icon>
      </h1>
    </a>
    <h1 v-else class="page-title__name">{{ title }}</h1>
  </div>
</template>

<script>
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
@require '../../assets/colors.styl'

.page-title
  display flex
  column-gap 20px
  align-items center
  &__back
    cursor pointer
  &__link
    text-decoration none
    border-bottom 2px solid $titleColor
  &__name
    color $titleColor
    font-size 40px
    margin 0
    font-family 'CenturyGothic'
</style>
