<script setup lang="ts">
defineProps({
  showTopBar: {
    type: Boolean,
    default: true,
  },
  showMain: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
    <div class="layout-main-wrapper">
        <div class="top-bar">
            <slot v-if="showTopBar" name="top-bar" />
        </div>
        <div class="main-content">
            <slot v-if="showMain" name="main" />
        </div>
    </div>
</template>
<style>
.layout-main-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.layout-main-wrapper .top-bar {
    width: 100%;
    /* background-color: var(--mid-night); */
    height: var(--top-bar-height);
}
.layout-main-wrapper .main-content {
    width: 100%;
    color: var(--jet);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
}
</style>