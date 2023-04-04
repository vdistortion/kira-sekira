<template>
  <div class="project-list">
    <div
      v-for="(project, link) in projects"
      :key="link"
      class="project-list__item"
    >
      <project-card
        :project="project"
        @click="$router.push(link)"
      ></project-card>
    </div>
  </div>
</template>

<script>
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
@require '../assets/smartgrid.styl'

.project-list
  row-flex()
  &__item
    col()
    col-size(24)
    col-size-w500(12)
    col-size-w1000(8)
    col-size-w1200(6)
    margin-bottom $offset
</style>
