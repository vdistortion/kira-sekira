<template>
  <div v-if="tags.length > 1" class="tags-cloud">
    <app-card v-if="isHomePage">
      <h2 class="tags-cloud__title">Облако тегов</h2>
      <div class="tags-cloud__list">
        <a
          v-for="tag in sortedTags"
          :key="tag"
          href="#"
          class="tags-cloud__tag"
          :class="{ active: activeTag === tag }"
          @click.prevent="$emit('visible', tag)"
        >
          <span v-if="tag === 'all'">Все проекты</span>
          <span v-else>#{{ tag }}</span>
        </a>
      </div>
    </app-card>
    <app-card v-else>
      <h2 class="tags-cloud__title">Теги</h2>
      <div class="tags-cloud__list">
        <div
          v-for="tag in sortedTags"
          :key="tag"
          class="tags-cloud__tag"
        >
          <span>#{{ tag }}</span>
        </div>
      </div>
    </app-card>
  </div>
</template>

<script>
import AppCard from '../ui/Card.vue';

export default {
  computed: {
    isHomePage() {
      return this.$route.name === 'home';
    },
    sortedTags() {
      const sortedTags = this.tags
        .filter((tag) => tag !== 'all')
        .sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });

      return this.isHomePage ? ['all', ...sortedTags] : sortedTags;
    },
  },
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    activeTag: {
      type: String,
      default: '',
    },
  },
  emits: ['visible'],
  components: {
    AppCard,
  },
  name: 'tags-cloud',
};
</script>

<style lang="stylus">
@require '../../assets/colors.styl'

.tags-cloud
  &__title
    color $tagColor
    font-size 18px
    margin 0
  &__list
    margin-top 5px
  &__tag
    display inline-block
    text-decoration none
    color currentColor
    margin-right 10px
    &.active
      color $activeTagColor
</style>
