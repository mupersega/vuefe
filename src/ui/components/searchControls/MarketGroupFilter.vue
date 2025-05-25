<template>
  <div class="market-group">
    <p>{{ baseNode.marketGroupName }}</p>
    <div class="filter-options">
      <!-- Display child nodes (recursively) -->
      <div v-if="hasChildren" class="children">
        <div 
          v-for="child in baseNode.children"
          :key="child.marketGroupId" 
          class="child-item"
        >
          <!-- For direct children that have their own children, use recursion -->
          <div v-if="child.children && child.children.length > 0">
            <MarketGroupFilter 
              :baseNode="child"
              @select="forwardSelection"
            />
          </div>
          <!-- For direct children that are leaf nodes, show select button -->
          <div v-else>
            <p>{{ child.marketGroupName }}</p>
            <button @click="selectChild(child)">Select</button>
          </div>
        </div>
      </div>
      <!-- Display types if this is a leaf node with types -->
      <div v-if="baseNode.hasTypes" class="types">
        <button @click="selectGroup">Select All Types</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MarketGroupNodeDto } from '@/api-client';

export default defineComponent({
  name: 'MarketGroupFilter',
  // Add self-reference for recursion
  components: {
    MarketGroupFilter: () => import('./MarketGroupFilter.vue')
  },
  props: {
    baseNode: {
      type: Object as PropType<MarketGroupNodeDto>,
      required: true
    }
  },
  computed: {
    hasChildren() {
      return this.baseNode.children && this.baseNode.children.length > 0;
    }
  },
  methods: {
    selectGroup() {
      // Emit event when this group is selected
      this.$emit('select', this.baseNode);
    },
    selectChild(node: MarketGroupNodeDto) {
      // Emit event when a child is selected
      this.$emit('select', node);
    },
    forwardSelection(node: MarketGroupNodeDto) {
      // Forward selection events from child components up the tree
      this.$emit('select', node);
    }
  }
});
</script>

<style scoped>
.market-group {
  margin-left: 10px;
  border-left: 1px solid var(--translucent-white-3);
  padding-left: 10px;
}

.children {
  margin-top: 5px;
}

.child-item {
  margin-left: 10px;
  padding: 5px;
  border-left: 1px solid var(--translucent-white-3);
}

.types {
  margin-top: 5px;
}

button {
  background-color: var(--eerie-black);
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.3rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover {
  color: var(--flame);
  border-color: var(--flame);
}
</style>