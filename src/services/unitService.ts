/**
 * Unit Service
 * 
 * Handles creation, management, and persistence of Units - collections of items
 * with quantities that users build in the workshop.
 */

import type { 
  Unit, 
  UnitItem, 
  UnitSummary, 
  CreateUnitOptions, 
  UpdateUnitOptions,
  UnitExport 
} from '@/interfaces/Unit';
import localStorageService, { STORAGE_KEYS } from './localStorageService';

/**
 * Service for managing units
 */
class UnitService {
  private units: Unit[] = [];
  private currentUnitId: string | null = null;

  constructor() {
    this.loadUnits();
    console.log('Unit Service initialized');
  }

  /**
   * Generate a unique ID for a unit
   */
  private generateId(): string {
    return `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load units from localStorage
   */
  private loadUnits(): void {
    try {
      const storedUnits = localStorageService.get<Unit[]>(STORAGE_KEYS.UNITS);
      if (storedUnits && Array.isArray(storedUnits)) {
        // Convert date strings back to Date objects
        this.units = storedUnits.map(unit => ({
          ...unit,
          createdAt: new Date(unit.createdAt),
          updatedAt: new Date(unit.updatedAt),
          items: unit.items.map(item => ({
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : undefined
          }))
        }));
        console.log(`Loaded ${this.units.length} units from storage`);
      }
    } catch (error) {
      console.error('Failed to load units from storage:', error);
      this.units = [];
    }
  }

  /**
   * Save units to localStorage
   */
  private saveUnits(): boolean {
    try {
      return localStorageService.set(STORAGE_KEYS.UNITS, this.units);
    } catch (error) {
      console.error('Failed to save units to storage:', error);
      return false;
    }
  }

  /**
   * Create a new unit
   */
  public createUnit(options: CreateUnitOptions): Unit {
    const now = new Date();
    const unit: Unit = {
      id: this.generateId(),
      name: options.name,
      description: options.description,
      items: options.items || [],
      createdAt: now,
      updatedAt: now,
      tags: options.tags || [],
      isFavorite: false
    };

    // Add addedAt timestamp to items
    unit.items = unit.items.map(item => ({
      ...item,
      addedAt: item.addedAt || now
    }));

    this.units.push(unit);
    this.saveUnits();
    
    console.log(`Created unit: ${unit.name} (${unit.id})`);
    return unit;
  }

  /**
   * Get all units
   */
  public getAllUnits(): Unit[] {
    return [...this.units];
  }

  /**
   * Get a unit by ID
   */
  public getUnitById(id: string): Unit | null {
    return this.units.find(unit => unit.id === id) || null;
  }

  /**
   * Update an existing unit
   */
  public updateUnit(id: string, options: UpdateUnitOptions): Unit | null {
    const unitIndex = this.units.findIndex(unit => unit.id === id);
    if (unitIndex === -1) {
      return null;
    }

    const unit = this.units[unitIndex];
    this.units[unitIndex] = {
      ...unit,
      name: options.name ?? unit.name,
      description: options.description ?? unit.description,
      tags: options.tags ?? unit.tags,
      isFavorite: options.isFavorite ?? unit.isFavorite,
      updatedAt: new Date()
    };

    this.saveUnits();
    console.log(`Updated unit: ${this.units[unitIndex].name} (${id})`);
    return this.units[unitIndex];
  }

  /**
   * Delete a unit
   */
  public deleteUnit(id: string): boolean {
    const unitIndex = this.units.findIndex(unit => unit.id === id);
    if (unitIndex === -1) {
      return false;
    }

    const deletedUnit = this.units.splice(unitIndex, 1)[0];
    
    // Clear current unit if it was deleted
    if (this.currentUnitId === id) {
      this.currentUnitId = null;
    }

    this.saveUnits();
    console.log(`Deleted unit: ${deletedUnit.name} (${id})`);
    return true;
  }

  /**
   * Add an item to a unit
   */
  public addItemToUnit(unitId: string, item: Omit<UnitItem, 'addedAt'>): boolean {
    const unit = this.getUnitById(unitId);
    if (!unit) {
      return false;
    }

    // Check if item already exists
    const existingItemIndex = unit.items.findIndex(existingItem => 
      existingItem.typeId === item.typeId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      unit.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      unit.items.push({
        ...item,
        addedAt: new Date()
      });
    }

    unit.updatedAt = new Date();
    this.saveUnits();
    
    console.log(`Added item ${item.typeId} (qty: ${item.quantity}) to unit ${unit.name}`);
    return true;
  }

  /**
   * Remove an item from a unit
   */
  public removeItemFromUnit(unitId: string, typeId: number): boolean {
    const unit = this.getUnitById(unitId);
    if (!unit) {
      return false;
    }

    const itemIndex = unit.items.findIndex(item => item.typeId === typeId);
    if (itemIndex === -1) {
      return false;
    }

    const removedItem = unit.items.splice(itemIndex, 1)[0];
    unit.updatedAt = new Date();
    this.saveUnits();

    console.log(`Removed item ${typeId} from unit ${unit.name}`);
    return true;
  }

  /**
   * Update item quantity in a unit
   */
  public updateItemQuantity(unitId: string, typeId: number, quantity: number): boolean {
    const unit = this.getUnitById(unitId);
    if (!unit) {
      return false;
    }

    const item = unit.items.find(item => item.typeId === typeId);
    if (!item) {
      return false;
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return this.removeItemFromUnit(unitId, typeId);
    }

    item.quantity = quantity;
    unit.updatedAt = new Date();
    this.saveUnits();

    console.log(`Updated item ${typeId} quantity to ${quantity} in unit ${unit.name}`);
    return true;
  }

  /**
   * Get summary statistics for a unit
   */
  public getUnitSummary(unitId: string): UnitSummary | null {
    const unit = this.getUnitById(unitId);
    if (!unit) {
      return null;
    }

    const summary: UnitSummary = {
      uniqueItems: unit.items.length,
      totalQuantity: unit.items.reduce((sum, item) => sum + item.quantity, 0),
      lastAddedItem: unit.items
        .sort((a, b) => {
          const dateA = a.addedAt ? a.addedAt.getTime() : 0;
          const dateB = b.addedAt ? b.addedAt.getTime() : 0;
          return dateB - dateA;
        })[0]
    };

    return summary;
  }

  /**
   * Set the current active unit
   */
  public setCurrentUnit(unitId: string | null): boolean {
    if (unitId !== null && !this.getUnitById(unitId)) {
      return false;
    }
    
    this.currentUnitId = unitId;
    console.log(`Set current unit: ${unitId}`);
    return true;
  }

  /**
   * Get the current active unit
   */
  public getCurrentUnit(): Unit | null {
    return this.currentUnitId ? this.getUnitById(this.currentUnitId) : null;
  }

  /**
   * Export units for backup/sharing
   */
  public exportUnits(): UnitExport {
    return {
      version: '1.0',
      exportedAt: new Date(),
      units: this.getAllUnits()
    };
  }

  /**
   * Import units from backup
   */
  public importUnits(unitExport: UnitExport, overwrite: boolean = false): boolean {
    try {
      if (overwrite) {
        this.units = [];
      }

      // Process imported units
      const importedUnits = unitExport.units.map(unit => ({
        ...unit,
        id: overwrite ? unit.id : this.generateId(), // Generate new IDs if not overwriting
        createdAt: new Date(unit.createdAt),
        updatedAt: new Date(unit.updatedAt),
        items: unit.items.map(item => ({
          ...item,
          addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
        }))
      }));

      this.units.push(...importedUnits);
      this.saveUnits();

      console.log(`Imported ${importedUnits.length} units`);
      return true;
    } catch (error) {
      console.error('Failed to import units:', error);
      return false;
    }
  }

  /**
   * Search units by name or description
   */
  public searchUnits(query: string): Unit[] {
    const lowerQuery = query.toLowerCase();
    return this.units.filter(unit => 
      unit.name.toLowerCase().includes(lowerQuery) ||
      (unit.description && unit.description.toLowerCase().includes(lowerQuery)) ||
      (unit.tags && unit.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  /**
   * Get units sorted by various criteria
   */
  public getSortedUnits(sortBy: 'name' | 'created' | 'updated' | 'items', ascending: boolean = true): Unit[] {
    const sorted = [...this.units].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'items':
          comparison = a.items.length - b.items.length;
          break;
      }
      
      return ascending ? comparison : -comparison;
    });

    return sorted;
  }
}

// Create and export a singleton instance
const unitService = new UnitService();
export default unitService;
