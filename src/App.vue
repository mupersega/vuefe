<template>
  <MainLayout :showSearchControls="!isAdminRoute">
    <RouterView />
  </MainLayout>
</template>

<script setup lang="ts">
  import MainLayout from '@ui/layouts/MainLayout.vue';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const isAdminRoute = computed(() => route.path === '/admin');
</script>

<style scoped>
  /* All styles moved to MainLayout.vue */
</style>
