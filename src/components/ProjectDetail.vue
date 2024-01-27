<template>
  <div class="project-detail">
    <div v-if="description" class="project-detail__item">
      <div class="project-detail__description" v-html="description"></div>
    </div>
    <picture-list class="project-detail__item" :images="images"></picture-list>
  </div>
</template>

<script lang="ts">
import PictureList from './multimedia/PictureList.vue';

export default {
  props: {
    description: {
      type: String,
      default: '',
    },
    videos: {
      type: Array,
      default: () => [],
    },
    images: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    PictureList,
  },
  name: 'project-detail',
};
</script>

<style lang="stylus">
.project-detail
  margin 40px 0
  &__item + &__item
    margin-top 20px
  &__description
    font-size 20px
</style>
