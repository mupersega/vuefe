import { db } from '@/services/db';

/**
 * Administrative actions for the EVE application
 */

/**
 * Deletes the current Dexi database
 * @returns Promise that resolves when the operation completes
 */
export const deleteDexiDb = async (): Promise<void> => {
    try {
        await db.delete();
        return Promise.resolve();
    } catch (error) {
        console.error('Error deleting Dexi DB:', error);
        return Promise.reject(error);
    }
};

/**
 * Structure for defining admin actions 
 */
export interface AdminAction {
    id: string;
    label: string;
    icon?: string[]; // e.g., ['fas', 'trash']
    description: string;
    dangerous?: boolean; // Indicates if action needs confirmation
    tags: string[]; // Categories this action belongs to
    action: () => Promise<void>;
}

/**
 * Collection of available admin actions
 */
export const adminActions: AdminAction[] = [
    {        
        id: 'delete-dexi',
        label: 'Delete Current Dexi DB',
        description: 'Completely removes the current Dexi database. This action cannot be undone.',
        icon: ['fas', 'trash'],
        dangerous: true,
        tags: ['database', 'cleanup', 'settings'],
        action: deleteDexiDb
    }
    // Additional admin actions can be added here as the admin functionality grows
];