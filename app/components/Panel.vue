<template>
  <div class="c-panel">
    <h2 class="c-panel__title">
      {{ title }}
    </h2>
    <div class="c-panel__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  date() {
    return {};
  },
};
</script>
