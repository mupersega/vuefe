<template>
  <div class="app-container">
    <!-- <Tex /> -->
    <AppNav />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
  import AppNav from './components/pages/base/AppNav/AppNav.vue';
  // import Tex from './components/Tex.vue';
</script>

<style scoped>
  .app-container {
    display: grid;
    grid-template-columns: min-content 3fr;
    grid-template-rows: 1fr;
    grid-template-areas:
      "nav main";
    height: 100vh;
    width: 100vw;
  }

  main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    position: relative;
    /* background-color: var(--white); */
  }

</style>
