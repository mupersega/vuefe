<template>
  <div class="app-container">
    <AppNav />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
  import AppNav from './components/AppNav/AppNav.vue';
</script>

<style scoped>
/* 
main vars
  --white: #ffffffff;
  --platinum: #e1e0dcff;
  --silver: #b0ada7ff;
  --gray: #7e7a72ff;
  --jet: #302e2bff;
  --eerie-black: #201f1dff;
  --night: #0b0a0aff;
  --flame: #eb5e28ff;
  --burnt-sienna: #ed6d3cff;  --white: #ffffffff;
  --platinum: #e1e0dcff;
  --silver: #b0ada7ff;
  --gray: #7e7a72ff;
  --jet: #302e2bff;
  --eerie-black: #201f1dff;
  --night: #0b0a0aff;
  --flame: #eb5e28ff;
  --burnt-sienna: #ed6d3cff;
*/
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
    /* background-color: var(--white); */
  }

</style>
