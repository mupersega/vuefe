/**
 * Unit interfaces and types
 * 
 * A Unit represents a collection of items with their quantities that a user
 * has assembled in the workshop. Units can be saved, loaded, and managed locally.
 */

/**
 * Individual item within a unit
 */
export interface UnitItem {
  /** EVE Online type ID */
  typeId: number;
  /** Quantity of this item in the unit */
  quantity: number;
  /** Optional display name (cached for performance) */
  typeName?: string;
  /** Timestamp when this item was added to the unit */
  addedAt?: Date;
}

/**
 * Complete unit definition
 */
export interface Unit {
  /** Unique identifier for this unit */
  id: string;
  /** User-defined name for this unit */
  name: string;
  /** Optional description */
  description?: string;
  /** List of items in this unit */
  items: UnitItem[];
  /** When this unit was created */
  createdAt: Date;
  /** When this unit was last modified */
  updatedAt: Date;
  /** Optional tags for organization */
  tags?: string[];
  /** Whether this unit is marked as favorite */
  isFavorite?: boolean;
}

/**
 * Summary statistics for a unit
 */
export interface UnitSummary {
  /** Total number of unique item types */
  uniqueItems: number;
  /** Total quantity across all items */
  totalQuantity: number;
  /** Most recently added item */
  lastAddedItem?: UnitItem;
}

/**
 * Options for creating a new unit
 */
export interface CreateUnitOptions {
  /** Name for the unit */
  name: string;
  /** Optional description */
  description?: string;
  /** Initial items to include */
  items?: UnitItem[];
  /** Optional tags */
  tags?: string[];
}

/**
 * Options for updating an existing unit
 */
export interface UpdateUnitOptions {
  /** New name (optional) */
  name?: string;
  /** New description (optional) */
  description?: string;
  /** New tags (optional) */
  tags?: string[];
  /** Whether to mark as favorite (optional) */
  isFavorite?: boolean;
}

/**
 * Export format for units (for backup/sharing)
 */
export interface UnitExport {
  /** Export format version */
  version: string;
  /** Timestamp of export */
  exportedAt: Date;
  /** Array of units */
  units: Unit[];
}
