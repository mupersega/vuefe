<template>
  <div class="app-container">
    <!-- <Tex /> -->
    <Sidebar />
    <main>
      <div class="top-bar">
        <SearchControls />
      </div class="top-bar">
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import Sidebar from './components/pages/sidebar/Sidebar.vue';
  // import Tex from './components/Tex.vue';
  import SearchControls from './components/pages/searchControls/SearchControls.vue';
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
  }

  main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .page-content {
    display: flex;
    overflow-y: scroll;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

</style>
