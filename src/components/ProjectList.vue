<template>
  <div class="project-list">
    <div v-for="(project, link) in projects" :key="link" class="project-list__item">
      <project-card :project="project" @click="$router.push(link)"></project-card>
    </div>
  </div>
</template>

<script lang="ts">
import ProjectCard from './ProjectCard.vue';

export default {
  props: {
    projects: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ProjectCard,
  },
  name: 'project-list',
};
</script>

<style lang="stylus">
.project-list
  row-flex()
  &__item
    col()
    col-size(24)
    col-size-w500(12)
    margin-bottom $offset
</style>
