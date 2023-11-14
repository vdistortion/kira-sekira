#!/bin/sh

sed -i 's/arguments.callee/Object.deepExtend/g' ./node_modules/particles.js/particles.js
sed -i 's/mounted/async mounted/g' ./node_modules/vue-particles/src/vue-particles/vue-particles.vue
sed -i 's/require/await import/g' ./node_modules/vue-particles/src/vue-particles/vue-particles.vue
