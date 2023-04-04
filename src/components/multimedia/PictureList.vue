<template>
  <div v-if="images.length">
    <masonry-wall :items="images" :column-width="520" :gap="10">
      <template #default="{ item, index }">
        <div
          class="picture-list__item1"
          @click="showImg(index)"
        >
          <picture-card :image="item.src" :description="item.title"></picture-card>
        </div>
      </template>
    </masonry-wall>
    <vue-easy-lightbox
      :visible="visible"
      :imgs="images"
      :index="index"
      move-disabled
      @hide="handleHide"
    ></vue-easy-lightbox>
  </div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';
import PictureCard from './PictureCard.vue';

export default {
  methods: {
    showImg(index) {
      this.index = index
      this.visible = true
    },
    handleHide() {
      this.visible = false;
    },
  },
  data() {
    return {
      visible: false,
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
    VueEasyLightbox,
    PictureCard,
  },
  name: 'picture-list',
};
</script>
