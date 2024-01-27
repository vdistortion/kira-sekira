<template>
  <div v-if="images.length">
    <masonry-wall v-if="visibleLayout" :items="images" :column-width="520" :gap="20">
      <template #default="{ item, index }">
        <div class="picture-list__item1" @click="showImg(index)">
          <picture-card :image="item.src" :description="item.title"></picture-card>
        </div>
      </template>
    </masonry-wall>
    <vue-easy-lightbox
      :visible="visibleSlider"
      :imgs="images"
      :index="index"
      move-disabled
      @hide="handleHide"
    ></vue-easy-lightbox>
  </div>
</template>

<script lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall';
import VueEasyLightbox from 'vue-easy-lightbox';
import PictureCard from './PictureCard.vue';

export default {
  methods: {
    showImg(index) {
      this.index = index;
      this.visibleSlider = true;
    },
    handleHide() {
      this.visibleSlider = false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.visibleLayout = true;
    });
  },
  data() {
    return {
      visibleLayout: false,
      visibleSlider: false,
      index: 0,
    };
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MasonryWall,
    VueEasyLightbox,
    PictureCard,
  },
  name: 'picture-list',
};
</script>
