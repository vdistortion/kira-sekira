<template>
  <div class="video-card">
    <youtube-video
      :id="id"
      :name="name"
      @onReady="setTitle"
    ></youtube-video>
    <h2 class="video-card__title">
      {{ title || name }}
    </h2>
  </div>
</template>

<script>
import { YoutubeVideo } from '../../../plugins/youtube';

export default {
  methods: {
    setTitle(title) {
      this.title = title;
    },
  },
  data() {
    return {
      title: '',
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  components: {
    YoutubeVideo,
  },
  name: 'video-card',
};
</script>

<style lang="stylus">
.video-card
  &__title
    margin 10px 0
</style>
