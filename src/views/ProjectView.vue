<template>
  <the-page :title="project.name" :link="project.link" :tags="project.tags">
    <project-detail
      :description="project.detail || project.description"
      :videos="project.videos"
      :images="project.images"
    ></project-detail>
  </the-page>
</template>

<script>
import ThePage from '../components/layout/Page.vue';
import ProjectDetail from '../components/ProjectDetail.vue';
import projects from '../projects/index';
import '../assets/styles.styl';

export default {
  computed: {
    project() {
      return projects[this.$route.params.id];
    },
  },
  mounted() {
    document.title = this.project.name;
  },
  components: {
    ThePage,
    ProjectDetail,
  },
  name: 'view',
};
</script>
