<template>
  <div v-if="videos.length" class="video-list">
    <div
      v-for="video in videos"
      :key="video.src"
      class="video-list__item"
    >
      <video-card
        :id="video.src"
        :name="video.title"
      ></video-card>
    </div>
  </div>
</template>

<script>
import VideoCard from './VideoCard.vue';

export default {
  props: {
    videos: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    VideoCard,
  },
  name: 'video-list',
};
</script>

<style lang="stylus">
@require '../../assets/smartgrid.styl'

.video-list
  row-flex()
  &__item
    col()
    col-size(24)
    col-size-w1000(12)
    margin-bottom $offset
</style>
