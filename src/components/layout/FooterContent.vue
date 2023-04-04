<template>
  <app-card class="footer-content">
    <ul class="footer-content__contacts">
      <li>
        <a href="https://github.com/astrotrain55" target="_blank">GitHub</a>
      </li>
      <li>
        <a href="https://www.npmjs.com/~astrotrain" target="_blank">npmjs</a>
      </li>
      <li>
        <a href="https://t.me/valentin_fatherland" target="_blank">Telegram</a>
      </li>
    </ul>
    <img src="@/assets/qr-code.gif" alt="Контакты">
  </app-card>
</template>

<script>
import AppCard from '../ui/Card.vue';

export default {
  components: {
    AppCard,
  },
  name: 'footer-content',
};
</script>

<style lang="stylus">
.footer-content
  display flex
  justify-content space-between
  align-items center
  margin-bottom 10px
  &__contacts
    flex-grow 1
    list-style-type none
    padding-left 0
</style>
