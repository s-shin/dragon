<template>
  <div class="p-header">
    <nav :class="['p-header__nav', { 'is-active': isMenuOpened }]" ref="nav">
      <span class="p-header__nav__logo" @click="toggleMenu">D</span>
      <ul class="p-header__nav__menu">
        <li>新規対局</li>
        <li>棋譜読み込み</li>
        <li>棋譜保存</li>
      </ul>
    </nav>
    <h1 class="p-header__title">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  props: {
    title: {
      type: String,
      default: 'No title',
    },
  },
  data() {
    return {
      isMenuOpened: false,
    };
  },
  beforeMount() {
    document.body.addEventListener('click', (e) => {
      if (!this.$refs.nav.contains(e.target)) {
        this.isMenuOpened = false;
      }
    });
  },
  methods: {
    toggleMenu() {
      this.isMenuOpened = !this.isMenuOpened;
    },
  },
};
</script>
