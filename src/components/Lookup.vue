<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchInvTypeShortsContains, searchInvTypeShortsStartsWith } from '../services/db';
import type { InvTypeShortDto } from '../api-client';
import CustomCombobox from './CustomCombobox.vue'; // Import the new component
import MeButtonGroup, {type MeButtonGroupOption } from './shared/MeButtonGroup.vue';
import MainLayout from './Layout/MainLayout.vue'; // Import MainLayout

const invTypes = ref<InvTypeShortDto[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedInvType = ref<InvTypeShortDto | null>(null);
const isStartsWith = ref(true);

// Helper function to compare two arrays of InvTypeShortDto - can be removed if not used elsewhere
// as CustomCombobox handles its own internal state based on input.
const areInvTypeArraysEqual = (arr1: InvTypeShortDto[], arr2: InvTypeShortDto[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].typeId !== arr2[i].typeId) {
      return false;
    }
  }
  return true;
};

const options = ref<MeButtonGroupOption[]>([
  { id: 1, name: 'Starts With', selected: true },
  { id: 2, name: 'Contains', selected: false },
]);

const handleOptionSelected = (selectedOption: MeButtonGroupOption) => {
  options.value = options.value.map(opt => ({
    ...opt,
    selected: opt.id === selectedOption.id
  }));
  isStartsWith.value = selectedOption.id === 1; // Assuming ID 1 is 'Starts With'
  // Optionally, re-trigger search if the search query is not empty
  if (searchQuery.value.trim() !== '') {
    // This will trigger the watch handler for searchQuery
    const currentQuery = searchQuery.value;
    // Temporarily change to ensure watch triggers if new value is same as old, then restore.
    // This is a common pattern to force a watcher to re-run when dependent reactive state changes.
    searchQuery.value = ' '; // Use a non-empty temporary value if currentQuery could be empty
    searchQuery.value = currentQuery;
  }
};

// Watch for changes in searchQuery (user typing) to fetch new items
watch(searchQuery, (newQuery, _oldQuery) => {
  if (selectedInvType.value && newQuery === selectedInvType.value.typeName) {
    if (newQuery.trim() === '') {
      invTypes.value = [];
      selectedInvType.value = null; // Clear selection if input is cleared
      error.value = null;
    }
    return;
  }

  const trimmedQuery = newQuery.trim();
  if (trimmedQuery !== '') {
    isLoading.value = true;
    const func = isStartsWith.value ? searchInvTypeShortsStartsWith : searchInvTypeShortsContains;
    func(trimmedQuery, 1000) // searchInvTypeShorts is your API call
      .then((response) => {
        error.value = null;
        // The CustomCombobox will filter these items based on its own input value (which is searchQuery)
        // So, we just need to provide the raw list from the API.
        if (!areInvTypeArraysEqual(invTypes.value, response)) {
          invTypes.value = response;
        }
        // If response is empty, CustomCombobox will show "No results found"
      })
      .catch((err) => {
        console.error("Error fetching InvTypes:", err);
        error.value = "Failed to fetch item types. " + (err.message || '');
        invTypes.value = []; // Clear items on API error
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    invTypes.value = [];
    selectedInvType.value = null; // Clear selection if input is cleared
    error.value = null;
  }
});

function handleComboboxSelect(item: InvTypeShortDto) {
  selectedInvType.value = item;
  error.value = null; // Clear any previous errors
}

</script>
<template>
  <MainLayout :show-top-bar="true" :show-main="true">
    <template #top-bar>
      <div class="header">
        <!-- <h2>Item Lookup</h2> -->
        <section class="item-lookup-section">
          <MeButtonGroup :options="options" :multi="false" @optionSelected="handleOptionSelected" />
          <CustomCombobox :items="invTypes" v-model="searchQuery" labelField="typeName" valueField="typeId"
            placeholder="Type to search items..." @select="handleComboboxSelect" class="search-input-container" />
        </section>
      </div>
    </template>
    <template #content>
      <div class="content">
        <p>Use the search box above to find item types.</p>
        <p>Selected item details will appear below the search box.</p>
        <div class="messages-feedback-area"> <!-- Wrapper for all messages -->
          <!-- <div v-if="isLoading" class="loading-message" aria-live="polite">Loading item types...</div> -->
          <div v-if="error && !isLoading" class="error-message" role="alert">{{ error }}</div>

          <div v-if="selectedInvType && !error && !isLoading" class="selected-item-details">
            <h3>Selected Item:</h3>
            <p>Name: {{ selectedInvType.typeName }}</p>
            <p>ID: {{ selectedInvType.typeId }}</p>
          </div>

          <div v-if="!isLoading && !error && searchQuery.trim() === '' && !selectedInvType" class="info-message">
            Type in the box above to search for items.
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>
<style scoped>

.item-lookup-section {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  /* gap: 1.5rem; */
  color: var(--gray);
  box-sizing: border-box;
  filter: drop-shadow(
    0 0 3px var(--night)
  );
}

.loading-message,
.error-message,
.info-message,
.selected-item-details {
  width: 100%;
  text-align: center;
}

.error-message {
  color: var(--flame, red);
  font-weight: bold;
}

.selected-item-details {
  border: 1px solid var(--gray);
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: var(--jet);
  color: var(--platinum);
}

.info-message {
  color: var(--silver);
}

.header {
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  /* gap: 0.5rem; */
  color: var(--white);
  height: 100%;
  justify-content: flex-end;
}

</style>