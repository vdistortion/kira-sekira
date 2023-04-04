<template>
  <svg-icon type="mdi" :path="path"></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft, mdiLinkVariant } from '@mdi/js';
export default {
  computed: {
    path() {
      return this.icons[this.icon];
    },
  },
  data() {
    return {
      icons: {
        mdiArrowLeft,
        mdiLinkVariant,
      },
    };
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  components: {
    SvgIcon,
  },
  name: 'app-icon',
}
</script>
