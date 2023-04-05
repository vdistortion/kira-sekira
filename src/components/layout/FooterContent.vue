<template>
  <app-card class="footer-content">
    <ul class="footer-content__contacts">
      <li>
        <a href="https://t.me/kira_sekira313" target="_blank">Telegram</a>
      </li>
      <li>
        <a href="https://wa.me/79104769029" target="_blank">WhatsApp</a>
      </li>
      <li>
        <a href="tel:+79104769029">+7 (910) 476-90-29</a>
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
