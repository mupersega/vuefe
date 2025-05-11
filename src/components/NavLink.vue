<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    icon: {
      type: Array,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    navExpanded: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<template>
  <RouterLink :to="to">
    <div class="routerlink-content">
      <font-awesome-icon :icon="icon" />
      <span v-if="navExpanded">{{ text }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
a {
  color: var(--white);
  text-decoration: none;
  height: 35px;
  padding-left: 0.5rem;
}

a:hover {
  color: var(--flame);
}

a:active {
  color: var(--jet);
  svg {
    transform: scale(0.9);
    transition: transform 0.1s ease;
  }
}

.routerlink-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}
</style>
