<template>
  <div class="project-card">
    <app-card project>
      <div class="project-card__wrapper">
        <div class="project-card__name">{{ project.name }}</div>
        <div class="project-card__description" v-html="project.description"></div>
        <div class="project-card__cover">
          <img :src="getSrc(project.images)" alt="cover">
        </div>
        <div class="project-card__tags">
          <div
            v-for="tag in tags"
            :key="tag"
            class="project-card__tag"
          >{{ tag }}</div>
        </div>
      </div>
    </app-card>
  </div>
</template>

<script>
import AppCard from './ui/Card.vue';

export default {
  methods: {
    getSrc(images) {
      const imageWebp = images.find((img) => img.name === 'main.webp');
      const imageJpg = images.find((img) => img.name === 'main.jpg');
      return imageWebp ? imageWebp.src : imageJpg ? imageJpg.src : images[0].src;
    },
  },
  computed: {
    tags() {
      return this.project.tags
        .map((tag) => `#${tag}`)
        .sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
    },
  },
  props: {
    project: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    AppCard,
  },
  name: 'project-card',
};
</script>

<style lang="stylus">
@require '../assets/colors.styl'

.project-card
  height 100%
  &__wrapper
    display flex
    flex-direction column
    box-sizing border-box
    height 100%
  &__name
    padding 10px 0
    color $titleColor
    font-weight 500
    font-size 36px
    font-family 'CenturyGothic'
    text-align center
    margin-bottom 20px

    @media (max-width: 1400px)
      font-size 30px

    @media (max-width: 1000px)
      font-size 24px
  &__cover
    max-height 650px
    text-align center
  img
    width auto
    height auto
    max-width 100%
    max-height 100%
  &__tags
    display flex
    flex-wrap wrap
    column-gap 5px
    margin-top auto
    padding 10px 0
  &__tag
    color $tagColor
    font-weight 500
    font-size 14px
</style>
