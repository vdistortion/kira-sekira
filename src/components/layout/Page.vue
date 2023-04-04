<template>
  <div class="page">
    <header v-if="$route.name === 'home'" class="page__header">
      <div class="l-wrapper">
        <the-logo class="page__logo"></the-logo>
      </div>
    </header>
    <main>
      <div class="l-wrapper">
        <page-title
          class="page__title"
          :title="title"
          :link="link"
        ></page-title>
        <tags-cloud
          v-if="tags.length"
          class="page__tags"
          :tags="tags"
          :active-tag="activeTag"
          @visible="$emit('visible', $event)"
        ></tags-cloud>
        <slot></slot>
      </div>
    </main>
  </div>
  <footer>
    <div class="l-wrapper">
      <footer-content></footer-content>
    </div>
  </footer>
</template>

<script>
import TheLogo from './Logo.vue';
import PageTitle from './PageTitle.vue';
import TagsCloud from './TagsCloud.vue';
import FooterContent from './FooterContent.vue';

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
    TheLogo,
    PageTitle,
    TagsCloud,
    FooterContent,
  },
  name: 'the-page',
};
</script>

<style lang="stylus">
.page
  flex-grow 1
  &__header
    margin 40px 0
  &__logo
    max-width 1280px
    margin 0 auto
  &__title,
  &__tags
    margin 10px 0
</style>
