<template>
  <the-page title="Проекты" :tags="cloud" :activeTag="activeTag" @visible="onVisible">
    <div class="home-page">
      <div class="home-page__item">
        <div class="home-page__image">
          <img src="/images/about.jpg" alt="Фотограф в Москве Kira Sekira">
        </div>
        <div class="home-page__content">
          — Специалист визуального искусства
          <br>
          — Опыт работы 3 года
          <br>
          — Твой проводник в мир космической фотографии
          <br>
          — Раскрываю твой внутренний стержень
          <br>
          — Создаю тонкую грань между тобой и искусством
        </div>
      </div>
      <div id="projects" class="home-page__item">
        <div class="home-page__title">Фотограф в Москве Kira Sekira</div>
      </div>
      <project-list :projects="visibleProjects"></project-list>
    </div>
  </the-page>
</template>

<script>
import ThePage from '../components/layout/Page.vue';
import ProjectList from '../components/ProjectList.vue';
import projects from '../projects';
import '../assets/styles.styl';

export default {
  methods: {
    onVisible(tag) {
      this.activeTag = this.activeTag === tag ? 'all' : tag;
    },
  },
  computed: {
    tags() {
      return Object.entries(projects).reduce((acc, [id, project]) => {
        project.tags.forEach((tag) => {
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(id);
        });
        return acc;
      }, {
        all: Object.keys(projects),
      });
    },
    cloud() {
      return Object.keys(this.tags);
    },
    visibleProjects() {
      return this.tags[this.activeTag].reduce((list, id) => ({
        ...list,
        [id]: projects[id],
      }), {});
    },
  },
  mounted() {
    document.title = 'Kira Sekira';
  },
  data() {
    return {
      activeTag: 'all',
    };
  },
  components: {
    ThePage,
    ProjectList,
  },
  name: 'home-view',
};
</script>

<style lang="stylus">
@require '../assets/smartgrid.styl'

.home-page
  &__item
    row-flex()
    font-family 'CenturyGothic'
    color #101431
    font-size 38px
    letter-spacing .1em
    line-height 1.1
  &__title
    width 100%
    text-align center
    margin-top 40px
    margin-bottom 40px

    @media (max-width: 1000px)
      font-size 24px
  &__image
    col()
    col-size(14.4)

    @media (max-width: 1400px)
      col-size(12)

    @media (max-width: 1000px)
      col-size(24)
  img
    max-width 100%
    max-height 600px
  &__content
    col()
    col-size(9.6)
    padding-left 20px
    font-size 30px
    letter-spacing .1em
    line-height 2

    @media (max-width: 1400px)
      col-size(12)
      line-height 1.5

    @media (max-width: 1000px)
      col-size(24)
      padding-left 0
      font-size 24px
</style>
