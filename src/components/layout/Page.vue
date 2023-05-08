<template>
  <div class="page">
    <header class="page__header">
      <div class="l-wrapper">
        <the-logo class="page__logo"></the-logo>
      </div>
      <div v-if="$route.name === 'home'" class="l-wrapper">
        <ul class="menu">
          <li class="menu__item">
            <a class="menu__link" href="#">Главная</a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#projects">Проекты</a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">Стоимость</a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">Контакты</a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">Оставить отзыв</a>
          </li>
        </ul>
      </div>
    </header>
    <main>
      <div class="l-wrapper">
        <page-title
          v-if="$route.name !== 'home'"
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
</template>

<script>
import TheLogo from './Logo.vue';
import PageTitle from './PageTitle.vue';
import TagsCloud from './TagsCloud.vue';

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
  },
  name: 'the-page',
};
</script>

<style lang="stylus">
@require '../../assets/colors.styl'

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
.menu
  padding-left 0
  list-style-type none
  display flex
  column-gap 40px
  justify-content center
  font-family 'CenturyGothic'

  @media (max-width: 1000px)
    flex-direction column
    align-items center

  &__item
    font-size 20px
    letter-spacing .2em
    line-height 3
    color $titleColor
    text-transform lowercase

    @media (max-width: 1400px)
      font-size 14px
  &__link
    color inherit
    text-decoration none
</style>
