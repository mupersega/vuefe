<script setup lang="ts">
export interface NavLinkProps {
  to: string;
  icon: string[]; // Assuming icon is an array of strings like ['fas', 'home']
  text: string;
  navExpanded?: boolean;
}

const props = withDefaults(defineProps<NavLinkProps>(), {
  navExpanded: true,
});
</script>

<template>
  <RouterLink :to="props.to" :class="{ selected: $route.path === props.to, 'nav-expanded': props.navExpanded }">
    <div class="routerlink-content">
      <font-awesome-icon :icon="props.icon" />
      <span class="link-text" v-if="props.navExpanded">{{ props.text }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
  a {
    color: var(--platinum);
    text-decoration: none;
    height: 3rem;
    border-bottom: 1px solid var(--jet);
    width: 100%;
    transition: color .125s cubic-bezier(0.25, 0.1, 0.25, 1.0), padding-left .125s cubic-bezier(0.25, 0.1, 0.25, 1.0), background-color .125s cubic-bezier(0.25, 0.1, 0.25, 1.0), border-left .125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
    position: relative;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -150px;
      width: 150px;
      height: 150px;
      background-color: var(--burnt-sienna);
      z-index: -1;
      opacity: 0;
      rotate: 0deg;
      filter: drop-shadow(0 0 3px var(--eerie-black));
      /* transition: rotate 0.3s ease, opacity 0.3s ease, background-color 0.3s ease, left 0.3s ease, top 0.3s ease; */
      transition: rotate 0.3s cubic-bezier(0.68, -0, 0.265, 1.2), background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0), left 0.3s cubic-bezier(0.68, -0.2, 0.265, 1.55), top 0.3s cubic-bezier(0.68, -0.2, 0.265, 1.55);
    }
  }

  
  a:hover {
    color: var(--white);
    background-color: var(--jet);
  }

  a.selected {
    color: var(--flame);
    background-color: var(--translucent-white-02);
    z-index: 1;
    font-weight: bold;
    .link-text {
      color: var(--white)
    }
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -2.8rem;
      width: 100px;
      height: 100px;
      background-color: var(--eerie-black);
      z-index: -1;
      /* rotate: 10deg; */
      background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
      opacity: 1;
    }
  }
  
  .nav-expanded.selected {
    /* background: linear-gradient(to right, var(--translucent-white-02) 50%, var(--eerie-black) 95%); */
    padding-left: 0.75rem;
    &::before {
      content: '';
      position: absolute;
      top: -50px;
      left: -38px;
      width: 100px;
      height: 100px;
      background-color: var(--eerie-black);
      z-index: -1;
      rotate: 24deg;
      background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
      transition: rotate 0.3s cubic-bezier(0.68, 0, 0.265, 1.2), background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0), left 0.3s cubic-bezier(0.68, -0.2, 0.265, 1.2), top 0.3s cubic-bezier(0.68, -0.2, 0.265, 1.2);
      opacity: 1;
    }
  }

  .routerlink-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 100%;
    padding-left: 1.25rem;
    mix-blend-mode: screen;
  }

  .link-text {
    opacity: 1;
    transition: opacity 0.3s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1.0);
    color: var(--silver);
    @starting-style {
      opacity: 0;
    }
  }
</style>
