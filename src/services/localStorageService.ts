/**
 * Local Storage Service
 * 
 * Handles persistent storage of application data using localStorage with
 * proper error handling, serialization, and type safety.
 */

/**
 * Storage keys used by the application
 */
export const STORAGE_KEYS = {
  UNITS: 'eve-app-units',
  SETTINGS: 'eve-app-settings',
  CACHE: 'eve-app-cache'
} as const;

/**
 * Generic local storage service with type safety
 */
class LocalStorageService {
  
  /**
   * Check if localStorage is available
   */
  public isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Store data in localStorage with JSON serialization
   */
  public set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Failed to store data for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Retrieve data from localStorage with JSON deserialization
   */
  public get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to retrieve data for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  public remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove data for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all data from localStorage
   */
  public clear(): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys in localStorage
   */
  public getAllKeys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Failed to get localStorage keys:', error);
      return [];
    }
  }

  /**
   * Get the size of data stored for a specific key (in bytes)
   */
  public getSize(key: string): number {
    const item = localStorage.getItem(key);
    if (item === null) {
      return 0;
    }
    return new Blob([item]).size;
  }

  /**
   * Get the total size of all localStorage data (in bytes)
   */
  public getTotalSize(): number {
    let totalSize = 0;
    for (const key of this.getAllKeys()) {
      totalSize += this.getSize(key);
    }
    return totalSize;
  }

  /**
   * Check if a key exists in localStorage
   */
  public has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }
}

// Create and export a singleton instance
const localStorageService = new LocalStorageService();
export default localStorageService;
