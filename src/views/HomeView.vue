<template>
  <the-page title="Проекты" :tags="cloud" :activeTag="activeTag" @visible="onVisible">
    <project-list :projects="visibleProjects"></project-list>
  </the-page>
</template>

<script>
import ThePage from '../components/layout/Page.vue';
import ProjectList from '../components/ProjectList.vue';
import projects from '../projects/index';
import '../assets/styles.styl';

export default {
  methods: {
    onVisible(tag) {
      this.activeTag = this.activeTag === tag ? 'all' : tag;
    },
  },
  computed: {
    tags() {
      return Object.entries(projects).reduce((list, [id, project]) => {
        project.tags.forEach((tag) => {
          if (!list[tag]) list[tag] = [];
          list[tag].push(id);
        });
        return list;
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
    document.title = 'Портфолио';
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
  name: 'home',
};
</script>
