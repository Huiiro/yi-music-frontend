<!-- SvgIcon -->
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  name: string
  className?: string
}>()

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => `svg-icon ${props.className ?? ''}`)
</script>

<style scoped>
.svg-icon {
  /* width: 1em; */
  /* height: 1em; */
  fill: currentColor;
  vertical-align: middle;
}
</style>
