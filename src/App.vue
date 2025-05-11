<script>
import NavLink from './components/NavLink.vue'; 
  export default {
    components: {
      NavLink
    },
    data() {
      return {
        navExpanded: true,
      }
    }
  }
</script>

<template>
  <div class="app-container">
    <nav :class="{expanded: navExpanded}">
      <div class="actions">
        <button class="expander" @click="navExpanded = !navExpanded">
          <span v-if="navExpanded"><</span>
          <span v-else>></span>
        </button>
      </div>
      <div class="links">
        <NavLink to="/" :icon="['fas', 'house']" text="Home" :navExpanded="navExpanded" />
        <NavLink to="/item" :icon="['fas', 'magnifying-glass']" text="Item" :navExpanded="navExpanded" />
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
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
  .app-container {
    display: grid;
    grid-template-columns: min-content 3fr;
    grid-template-rows: 1fr;
    grid-template-areas:
      "nav main";
    height: 100vh;
    width: 100vw;
  }
  nav {
    grid-area: nav;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    background-color: var(--eerie-black);
    color: var(--white);
    transition: width 0.3s ease;
  }
  nav.expanded {
    width: 200px;
    .expander:hover {
      color: var(--flame);
      padding-right: 1.25rem;
    }
  }
  nav:not(.expanded) {
    width: 60px;
    .expander:hover {
      color: var(--flame);
      padding-right: 0.75rem;
    }
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .expander {
    cursor: pointer;
    align-self: flex-end;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    transition: padding-right 0.2s ease;
    color: var(--gray);
    font-weight: bold;
  }
  main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--white);
    color: var(--jet);
  }

</style>
