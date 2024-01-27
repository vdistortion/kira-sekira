<template>
  <div class="picture-card">
    <img class="picture-card__image" :src="image" :alt="description" />
    <h2 class="picture-card__description" v-html="description"></h2>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  name: 'picture-card',
};
</script>

<style lang="stylus">
.picture-card
  &__image
    width 100%
    max-width 100%
  &__description
    text-align center
    font-size inherit
    margin 5px 0 0
</style>
