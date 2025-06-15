import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Unit, UnitItem, CreateUnitOptions, UpdateUnitOptions } from '@/interfaces/Unit';
import unitService from '@/services/unitService';

export const useUnitStore = defineStore('unit', () => {
  // State
  const currentUnitId = ref<string | null>(null);
  const isLoading = ref(false);
  
  // Computed properties
  const allUnits = computed(() => unitService.getAllUnits());
  
  const currentUnit = computed(() => 
    currentUnitId.value ? unitService.getUnitById(currentUnitId.value) : null
  );
  
  const hasUnits = computed(() => allUnits.value.length > 0);
  
  const hasCurrentUnit = computed(() => currentUnit.value !== null);
  
  const currentUnitItems = computed(() => currentUnit.value?.items || []);
  
  const currentUnitSummary = computed(() => 
    currentUnitId.value ? unitService.getUnitSummary(currentUnitId.value) : null
  );

  // Actions
  
  /**
   * Create a new unit
   */
  const createUnit = (options: CreateUnitOptions): Unit => {
    isLoading.value = true;
    try {
      const unit = unitService.createUnit(options);
      return unit;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create a new unit and set it as current
   */
  const createAndSetCurrentUnit = (options: CreateUnitOptions): Unit => {
    const unit = createUnit(options);
    setCurrentUnit(unit.id);
    return unit;
  };

  /**
   * Update an existing unit
   */
  const updateUnit = (id: string, options: UpdateUnitOptions): Unit | null => {
    isLoading.value = true;
    try {
      return unitService.updateUnit(id, options);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Delete a unit
   */
  const deleteUnit = (id: string): boolean => {
    isLoading.value = true;
    try {
      const success = unitService.deleteUnit(id);
      if (success && currentUnitId.value === id) {
        currentUnitId.value = null;
      }
      return success;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Set the current active unit
   */
  const setCurrentUnit = (unitId: string | null): boolean => {
    const success = unitService.setCurrentUnit(unitId);
    if (success) {
      currentUnitId.value = unitId;
    }
    return success;
  };

  /**
   * Clear the current unit
   */
  const clearCurrentUnit = (): void => {
    setCurrentUnit(null);
  };

  /**
   * Add an item to the current unit
   */
  const addItemToCurrentUnit = (item: Omit<UnitItem, 'addedAt'>): boolean => {
    if (!currentUnitId.value) {
      return false;
    }
    return unitService.addItemToUnit(currentUnitId.value, item);
  };

  /**
   * Add multiple items to the current unit
   */
  const addItemsToCurrentUnit = (items: Omit<UnitItem, 'addedAt'>[]): boolean => {
    if (!currentUnitId.value) {
      return false;
    }
    
    let allSuccessful = true;
    items.forEach(item => {
      const success = unitService.addItemToUnit(currentUnitId.value!, item);
      if (!success) allSuccessful = false;
    });
    
    return allSuccessful;
  };

  /**
   * Remove an item from the current unit
   */
  const removeItemFromCurrentUnit = (typeId: number): boolean => {
    if (!currentUnitId.value) {
      return false;
    }
    return unitService.removeItemFromUnit(currentUnitId.value, typeId);
  };

  /**
   * Update item quantity in the current unit
   */
  const updateItemQuantityInCurrentUnit = (typeId: number, quantity: number): boolean => {
    if (!currentUnitId.value) {
      return false;
    }
    return unitService.updateItemQuantity(currentUnitId.value, typeId, quantity);
  };

  /**
   * Check if an item exists in the current unit
   */
  const hasItemInCurrentUnit = (typeId: number): boolean => {
    return currentUnitItems.value.some(item => item.typeId === typeId);
  };

  /**
   * Get item quantity in the current unit
   */
  const getItemQuantityInCurrentUnit = (typeId: number): number => {
    const item = currentUnitItems.value.find(item => item.typeId === typeId);
    return item ? item.quantity : 0;
  };

  /**
   * Search units
   */
  const searchUnits = (query: string): Unit[] => {
    return unitService.searchUnits(query);
  };

  /**
   * Get sorted units
   */
  const getSortedUnits = (sortBy: 'name' | 'created' | 'updated' | 'items', ascending: boolean = true): Unit[] => {
    return unitService.getSortedUnits(sortBy, ascending);
  };

  /**
   * Export all units
   */
  const exportUnits = () => {
    return unitService.exportUnits();
  };

  /**
   * Import units
   */
  const importUnits = (unitExport: any, overwrite: boolean = false): boolean => {
    return unitService.importUnits(unitExport, overwrite);
  };

  /**
   * Get a unit by ID (reactive)
   */
  const getUnitById = (id: string): Unit | null => {
    return unitService.getUnitById(id);
  };

  /**
   * Create a unit from current workshop blueprints
   */
  const createUnitFromWorkshop = (workshopItems: any[], name: string): Unit | null => {
    if (workshopItems.length === 0) {
      return null;
    }

    const unitItems: Omit<UnitItem, 'addedAt'>[] = workshopItems.map(item => ({
      typeId: item.typeId,
      quantity: item.count || 1,
      typeName: item.typeName
    }));

    return createAndSetCurrentUnit({
      name,
      description: `Created from workshop with ${unitItems.length} items`,
      items: unitItems
    });
  };

  return {
    // State
    currentUnitId,
    isLoading,
    
    // Computed
    allUnits,
    currentUnit,
    hasUnits,
    hasCurrentUnit,
    currentUnitItems,
    currentUnitSummary,
    
    // Actions
    createUnit,
    createAndSetCurrentUnit,
    updateUnit,
    deleteUnit,
    setCurrentUnit,
    clearCurrentUnit,
    addItemToCurrentUnit,
    addItemsToCurrentUnit,
    removeItemFromCurrentUnit,
    updateItemQuantityInCurrentUnit,
    hasItemInCurrentUnit,
    getItemQuantityInCurrentUnit,
    searchUnits,
    getSortedUnits,
    exportUnits,
    importUnits,
    getUnitById,
    createUnitFromWorkshop
  };
});

export default useUnitStore;
