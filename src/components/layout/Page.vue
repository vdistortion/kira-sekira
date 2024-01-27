<template>
  <div class="page">
    <header class="page__header">
      <div class="l-wrapper">
        <div class="contacts">
          <div class="contacts__uppercase">
            Связаться со мной
            <a href="tel:+79104769029">+7 (910) 476-90-29</a>,
            <a href="https://t.me/kira_sekira313" target="_blank">Telegram</a>,
            <a href="https://wa.me/79104769029" target="_blank">WhatsApp</a>
          </div>
          <div class="contacts__lowercase">Пн - Сб 10:00-20:00</div>
        </div>
      </div>
      <div class="l-wrapper">
        <the-logo class="page__logo"></the-logo>
      </div>
      <div class="l-wrapper">
        <ul class="menu">
          <li class="menu__item">
            <router-link class="menu__link" to="/">Главная</router-link>
          </li>
          <li class="menu__item">
            <router-link class="menu__link" to="/" @click="animateScroll">Проекты</router-link>
          </li>
          <li class="menu__item">
            <router-link class="menu__link" to="/prices">Стоимость</router-link>
          </li>
        </ul>
      </div>
    </header>
    <main>
      <div class="l-wrapper">
        <page-title
          v-if="$route.name !== 'home' && title"
          class="page__title"
          :title="title"
          :link="link"
        ></page-title>
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import TheLogo from './Logo.vue';
import PageTitle from './PageTitle.vue';

export default {
  methods: {
    animateScroll() {
      setTimeout(() => {
        const anchor = document.querySelector('#projects');
        this.scroll.animateScroll(anchor);
      }, 0);
    },
  },
  inject: ['scroll'],
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
    margin 0 auto 20px
  &__title,
  &__tags
    margin 10px 0

.contacts
  font-family $fontFirst
  color $titleColor
  &__uppercase
    text-transform uppercase
  &__lowercase
    text-transform lowercase
  a
    font-weight 700
    color inherit

.menu
  padding-left 0
  list-style-type none
  display flex
  column-gap 40px
  justify-content center
  font-family $fontFirst

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
