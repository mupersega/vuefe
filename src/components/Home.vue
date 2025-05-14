<script setup lang="ts">
</script>

<template>
  <div class="home-wrapper">
    <h1>mupersega<span class="accent">.eve</span></h1>
  </div>
</template>
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
  .accent {
    color: var(--flame);
  }
  .home-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    /* padding: 2rem; */
    color: var(--jet);
    height: 100%;
  }

  p {
    color: var(--jet);
    font-size: 1.25rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  section {
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    color: var(--gray);
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
</style>