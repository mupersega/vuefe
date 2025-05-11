<script setup lang="ts">

</script>

<template>
  <nav>
    <RouterLink to="/">Go Herrrrm</RouterLink>
    <RouterLink to="/counter">Go to HelloWorld</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
  nav {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    padding: 0% 1rem;
  }
</style>
