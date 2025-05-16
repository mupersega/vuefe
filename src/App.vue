<template>
  <div class="app-container">
    <!-- <Tex /> -->
    <AppNav />
    <main>
      <div class="top-bar">
        <SearchControls />
      </div class="top-bar">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
  import AppNav from './components/appNav/AppNav.vue';
  // import Tex from './components/Tex.vue';
  import SearchControls from './components/lookup/SearchControls.vue';
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

  .top-bar {
    grid-area: top-bar;
    display: flex;
    flex-direction: row;
    padding: 1rem;
    /* background-color: var(--platinum); */
  }

  main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    position: relative;
  }

</style>
