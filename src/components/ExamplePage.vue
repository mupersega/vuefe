<template>
  <MainLayout :show-top-bar="true" :show-main="true">
    <template #top-bar>
      <div>This is the top bar content.</div>
    </template>
    <template #content>
      <div>This is the main content.</div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from './MainLayout.vue';
</script>
