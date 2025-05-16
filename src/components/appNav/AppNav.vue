<script setup lang="ts">
import NavLink, { type NavLinkProps } from './NavLink.vue';
import { ref } from 'vue';

const navExpanded = ref(false);

const navItems: NavLinkProps[] = [
  { to: "/", icon: ['fas', 'house'], text: "Home" },
  { to: "/draft", icon: ['fas', 'compass-drafting'], text: "Draft" },
  { to: "/work", icon: ['fas', 'industry'], text: "Work" },
  { to: "/sdf", icon: ['fas', 'sliders'], text: "Lookup" },
  { to: "/awefsd", icon: ['fas', 'users'], text: "Character" },
  { to: "/explore", icon: ['fas', 'book'], text: "Library" },
];
</script>
<template>
  <nav :class="{ expanded: navExpanded }">
    <div class="actions">
      <div class="nav-top-spacer">
        <div class="faded">
          <span v-if="navExpanded" class="first">mupersega</span>
          <span v-else class="first">mu</span>
        </div>
        <span v-if="navExpanded" class="accent second">.eve</span>
        <span v-else="navExpanded" class="accent second">.eve</span>
      </div>
      <div class="links">
        <NavLink v-for="item in navItems" :key="item.to" :to="item.to" :icon="item.icon" :text="item.text"
          :navExpanded="navExpanded" />
      </div>
      <button class="expander" @click="navExpanded = !navExpanded">
        <span v-if="navExpanded">&lt;</span>
        <span v-else>&gt;</span>
      </button>
    </div>
  </nav>
</template>
<style scoped>
nav {
  grid-area: nav;
  display: flex;
  flex-direction: column;
  color: var(--white);
  transition: width 0.3s cubic-bezier(0.68, 0, 0.265, 1.2), background-color 0.05s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  border-right: 1px solid var(--jet);
  outline: 1px solid transparent;
  outline-offset: 0px;
  background-color: #ffffff05;
  z-index: 1;
  box-shadow: 0 0 3px 1px var(--night);

  &:hover {
    background-color: #ffffff08;
  }
}

nav.expanded {
  width: 12rem;

  .expander:hover {
    color: var(--flame);
    padding-right: 1.15rem;
  }
}

nav:not(.expanded) {
  width: var(--sidebar-width-compressed);

  .expander:hover {
    color: var(--flame);
    padding-right: 0.9rem;
  }
}

.nav-top-spacer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
  font-weight: bold;
  color: var(--silver);
  background-color: var(--mid-night);
  height: var(--top-bar-height);
  width: 100%;
  position: relative;
}

.accent {
  color: var(--flame);
}

.links {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  flex: 1;
}

.expander {
  cursor: pointer;
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  transition: padding-right 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  color: var(--gray);
  font-weight: bold;
  height: 100%;
  width: 100%;
}

.first {
  opacity: 1;
  transition: opacity 0.3s 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  @starting-style {
    opacity: 0;
  }
}

.second {
  opacity: 1;
  transition: opacity 0.2s 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  @starting-style {
    opacity: 0;
  }
}
</style>