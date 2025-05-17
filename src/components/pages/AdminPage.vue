<script setup lang="ts">
import { ref, computed } from 'vue';
import { adminActions, type AdminAction } from '@/lib/adminActions';
import MeButtonGroup from '../shared/MeButtonGroup.vue';

const message = ref('');
const isLoading = ref(false);
const isError = ref(false);

import type { MeButtonGroupOption } from '../shared/MeButtonGroup.vue';

// Extract all unique tags from admin actions
const allTags = Array.from(new Set(
    adminActions.flatMap(action => action.tags)
)).sort();

// Create tag filter options
const tagFilterOptions = ref<MeButtonGroupOption[]>(
    allTags.map((tag, index) => ({
        id: index + 1,
        name: tag,
        selected: false,
        disabled: false
    }))
);

// Filtered actions based on selected tags
const filteredActions = computed<AdminAction[]>(() => {
    const selectedTags = tagFilterOptions.value
        .filter(option => option.selected)
        .map(option => option.name);
        
    // If no tags are selected, show all actions
    if (selectedTags.length === 0) {
        return adminActions;
    }
    
    // Otherwise, filter actions that have at least one of the selected tags
    return adminActions.filter(action => 
        action.tags.some(tag => selectedTags.includes(tag))
    );
});

const executeAction = async (actionId: string) => {
    const action = adminActions.find(a => a.id === actionId);
    if (!action) return;
    
    // If action is dangerous, confirm with the user
    if (action.dangerous && !confirm(`Are you sure you want to ${action.label.toLowerCase()}? This action cannot be undone.`)) {
        return;
    }
    
    isLoading.value = true;
    message.value = '';
    isError.value = false;
    
    try {
        await action.action();
        message.value = `${action.label} completed successfully.`;
    } catch (error) {
        console.error(`Error executing action ${action.label}:`, error);
        message.value = `Failed to ${action.label.toLowerCase()}.`;
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
};

</script>
<template>
    <div class="page-wrapper">
        <div class="header">
            <h1>Admin</h1>
        </div>
        <div class="content">
            <p>This panel provides administrative tools for application management.</p>
            
            <div class="admin-controls-wrapper">
                <h2>Database Actions</h2>
                
                <!-- Tag filters -->
                <div class="filter-section">
                    <span class="filter-label">Filter by tags:</span>                    <MeButtonGroup 
                        :options="tagFilterOptions" 
                        :multi="true"
                        @update:options="(options) => tagFilterOptions = options"
                    />
                </div>
                
                <div class="actions-grid">
                    <div 
                        v-for="action in filteredActions" 
                        :key="action.id"
                        class="action-card"
                        :class="{ 'danger-card': action.dangerous }"
                    >
                        <div class="action-header">
                            <font-awesome-icon v-if="action.icon" :icon="action.icon" class="action-icon" />
                            <span class="action-title">{{ action.label }}</span>
                        </div>
                        <div class="action-description">
                            {{ action.description }}
                        </div>
                        <div class="action-footer">
                            <div class="action-tags">
                                <span v-for="tag in action.tags" :key="tag" class="tag">{{ tag }}</span>
                            </div>
                            <button 
                                @click="executeAction(action.id)"
                                :class="{ 'danger-btn': action.dangerous }"
                                :disabled="isLoading"
                            >
                                Execute
                            </button>
                        </div>
                    </div>
                </div>
                
                <div v-if="message" class="message-container" :class="{ 'error': isError }">
                    {{ message }}
                </div>
                
                <div v-if="isLoading" class="loading-indicator">
                    <font-awesome-icon icon="spinner" spin />
                    Processing...
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.header h1 {
    color: var(--translucent-white-3);
    margin-bottom: 0.25rem;
}

.content p {
    color: var(--gray);
    margin-top: 0;
    margin-bottom: 1.5rem;
}

.admin-controls-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background-color: var(--jet);
    box-shadow: 1px 1px 3px var(--night);
    border-radius: 0.5rem;
    border: 1px solid var(--translucent-white-3);
}

.admin-controls-wrapper h2 {
    color: var(--silver);
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.75rem;
    margin: 1rem 0;
}

.filter-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--translucent-white-1);
    margin-top: 0.75rem;
}

.filter-label {
    font-size: 0.85rem;
    color: var(--gray);
    white-space: nowrap;
}

.action-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--eerie-black);
    border-radius: 0.4rem;
    border: 1px solid var(--translucent-white-1);
    transition: all 0.2s;
    height: 100%;
    min-height: 8rem;
    position: relative;
}

.action-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.4rem;
    border: 0px solid transparent;
    pointer-events: none;
    transition: border-color 0.15s ease, border-width 0.15s ease;
}

.action-card:hover {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.action-card:hover::after {
    border: 1px solid turquoise;
    box-shadow: 0 0 5px 0 rgba(64, 224, 208, 0.15);
}

.danger-card {
    border: 1px solid rgba(244, 67, 54, 0.3);
    position: relative;
}

.danger-card::before {
    content: '';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    background-color: rgba(244, 67, 54, 0.7);
    border-radius: 50%;
    box-shadow: 0 0 4px 1px rgba(244, 67, 54, 0.3);
}

.action-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.action-icon {
    font-size: 1rem;
    color: var(--flame);
    opacity: 0.85;
}

.danger-card .action-icon {
    color: rgba(244, 67, 54, 0.85);
}

.action-title {
    font-weight: 600;
    color: var(--silver);
}

.action-description {
    font-size: 0.85rem;
    color: var(--gray);
    flex-grow: 1;
    margin-bottom: 0.5rem;
}

.action-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    min-height: 2.2rem;
}

.action-tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
}

.tag {
    background-color: var(--night);
    color: var(--gray);
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.25rem;
    text-transform: lowercase;
    border: 1px solid var(--translucent-white-1);
    transition: all 0.2s ease;
}

.tag:hover {
    border-color: rgba(64, 224, 208, 0.4); /* turquoise with opacity */
    color: var(--silver);
}

.action-card button {
    padding: 0.5rem 1rem;
    background-color: var(--oxford-blue);
    color: var(--silver);
    border: 1px solid var(--translucent-white-1);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
    align-self: flex-end;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
}

.action-card button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.25rem;
    border: 0px solid transparent;
    box-shadow: 0 0 0 0 transparent;
    pointer-events: none;
    transition: border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.15s ease;
}

.action-card button:hover {
    background-color: var(--royal-blue);
    color: var(--platinum);
}

.action-card button:hover::after {
    border: 1px solid turquoise;
}

.action-card button:active::after {
    box-shadow: 0 0 3px 2px turquoise inset;
}

.action-card button.danger-btn {
    background-color: var(--oxford-blue);
    color: var(--silver);
    border: 1px solid var(--translucent-white-1);
}

.action-card button.danger-btn:hover {
    background-color: var(--royal-blue);
    color: var(--platinum);
    border-color: var(--translucent-white-2);
}

.message-container {
    padding: 0.75rem;
    background-color: rgba(64, 224, 208, 0.05); /* Subtle turquoise background */
    border-left: 4px solid turquoise;
    border-radius: 0.25rem;
    margin-top: 1rem;
    color: var(--silver);
    transition: all 0.3s ease;
}

.message-container.error {
    background-color: rgba(244, 67, 54, 0.1);
    border-left-color: #f44336;
}

.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    color: var(--translucent-white-7);
    margin-top: 0.5rem;
}
</style>