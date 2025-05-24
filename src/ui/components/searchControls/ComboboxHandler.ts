import { reactive, watch, ref } from 'vue';

/**
 * Creates a reusable combobox handler with centralized state management
 */
export function createComboboxHandler<T extends Record<string, any>>(options: {
    labelField: keyof T;
    valueField: keyof T;
    searchFn: (query: string, limit?: number, isStartsWith?: boolean) => Promise<T[]>;
    onSelect?: (item: T) => void;
    onChange?: (value: string) => void;
    areItemsEqual?: (arr1: any[], arr2: any[]) => boolean;
    defaultSearchMode?: 'startsWith' | 'contains';
}){
    // Default comparator for arrays
    const defaultAreEqual = (arr1: any[], arr2: any[]): boolean => {
        if (arr1.length !== arr2.length) return false;
        return true; // Simple length check by default
    };
    
    const areItemsEqual = options.areItemsEqual || defaultAreEqual;    // Define search mode with a default - we make this a ref so we can directly use it with v-model
    const isStartsWith = ref(options.defaultSearchMode === 'contains' ? false : true);
    // Create reactive state for this combobox
    const state = reactive({
        items: [] as any[],
        searchQuery: '',
        selectedItem: null as any,
        isLoading: false,
        error: null as string | null
    });
    
    // Function to perform search with current parameters
    const performSearch = async (query: string) => {
        if (!query.trim()) {
            state.items = [];
            state.selectedItem = null;
            state.error = null;
            return;
        }
        
        state.isLoading = true;
        try {
            const results = await options.searchFn(query.trim(), 1000, isStartsWith.value);
            state.error = null;
            
            // Only update if results are different
            if (!areItemsEqual(state.items, results)) {
                state.items = [...results];
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
            state.error = `Failed to fetch data. ${err?.message || ''}`;
            state.items = [];
        } finally {
            state.isLoading = false;
        }
    };
    
    // Setup watcher for search query
    watch(() => state.searchQuery, async (query) => {
        // Skip if selected item's label matches the query
        if (state.selectedItem && 
            query === String(state.selectedItem[options.labelField])) {
            return;
        }

        const trimmedQuery = query.trim();
        
        // Clear results if query is empty
        if (trimmedQuery === '') {
            state.items = [];
            state.selectedItem = null;
            state.error = null;
            return;
        }
        
        // Perform the search
        await performSearch(trimmedQuery);
    });
    
    // Watch for changes in search mode
    watch(isStartsWith, () => {
        // If there's an active query, re-run the search with the new mode
        if (state.searchQuery.trim()) {
            performSearch(state.searchQuery);
        }
    });
    
    // Handler functions for the combobox
    const handleSelect = (item: T) => {
        state.selectedItem = item;
        state.error = null;
        if (options.onSelect) {
            options.onSelect(item);
        }
    };
    
    const handleInput = (value: string) => {
        state.searchQuery = value;
    };
    
    // Override the search query (useful for resetting or forcing a search)
    const setSearchQuery = (query: string) => {
        state.searchQuery = query;
    };
    
    // Toggle search mode between startsWith and contains
    const toggleSearchMode = () => {
        isStartsWith.value = !isStartsWith.value;
    };
    
    return {
        state,
        isStartsWith,
        handleSelect,
        handleInput,
        setSearchQuery,
        toggleSearchMode,
        fields: {
            label: options.labelField,
            value: options.valueField
        }
    };
}
