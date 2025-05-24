import { db, debugQB } from '@/services/db';
import apiService from '@/services/ApiService';

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
 * Test the API service function for inventory types
 * @param searchString Optional search string to filter results
 * @returns Promise that resolves when the operation completes
 */
export const testInvTypesApi = async (searchString?: string): Promise<void> => {
    const functionName = 'apiService.getInvTypes()';
    const endpoint = `/api/InvTypes${searchString ? `?searchString=${searchString}` : ''}`;
    try {
        console.log(`Testing API Service function: ${functionName}`);
        console.log(`Underlying API endpoint: ${endpoint}`);
        const startTime = performance.now();
        const results = await apiService.getInvTypes(searchString);
        const duration = Math.round(performance.now() - startTime);
        
        // Analyze the first item to determine structure
        const sampleItem = results.length > 0 ? results[0] : null;
        const itemStructure = sampleItem ? Object.keys(sampleItem) : [];
          console.log('%cAPI Service Test Results: getInvTypes()', 'color: #4CAF50; font-weight: bold;');
        console.log(`Service Function: apiService.getInvTypes(${searchString ? `"${searchString}"` : ''})`);
        console.log(`Underlying Endpoint: ${endpoint}`);
        console.log(`Status: Success ✓ (${duration}ms)`);
        console.log(`Items: ${results.length}`);
        console.log('Data Structure:', itemStructure);
        console.table(results.slice(0, 3));
        
        return Promise.resolve();
    } catch (error: any) {        console.error('%cAPI Service Test Failed: getInvTypes()', 'color: #F44336; font-weight: bold;');
        console.error(`Service Function: apiService.getInvTypes(${searchString ? `"${searchString}"` : ''})`);
        console.error(`Underlying Endpoint: ${endpoint}`);
        console.error(`Error:`, error);
        return Promise.reject(error);
    }
};

/**
 * Test the API service function for blueprints
 * @returns Promise that resolves when the operation completes
 */
export const testBlueprintsApi = async (): Promise<void> => {
    const functionName = 'apiService.getBlueprints()';
    const endpoint = '/api/Blueprints';
    try {
        console.log(`Testing API Service function: ${functionName}`);
        console.log(`Underlying API endpoint: ${endpoint}`);
        const startTime = performance.now();
        const results = await apiService.getBlueprints();
        const duration = Math.round(performance.now() - startTime);
        
        // Analyze the first item to determine structure
        const sampleItem = results.length > 0 ? results[0] : null;
        const itemStructure = sampleItem ? Object.keys(sampleItem) : [];
          console.log('%cAPI Service Test Results: getBlueprints()', 'color: #4CAF50; font-weight: bold;');
        console.log(`Service Function: apiService.getBlueprints()`);
        console.log(`Underlying Endpoint: ${endpoint}`);
        console.log(`Status: Success ✓ (${duration}ms)`);
        console.log(`Items: ${results.length}`);
        console.log('Data Structure:', itemStructure);
        console.table(results.slice(0, 3));
        
        return Promise.resolve();
    } catch (error: any) {        console.error('%cAPI Service Test Failed: getBlueprints()', 'color: #F44336; font-weight: bold;');
        console.error(`Service Function: apiService.getBlueprints()`);
        console.error(`Underlying Endpoint: ${endpoint}`);
        console.error(`Error:`, error);
        return Promise.reject(error);
    }
};

/**
 * Test the API service function for inventory groups
 * @returns Promise that resolves when the operation completes
 */
export const testInvGroupsApi = async (): Promise<void> => {
    const functionName = 'apiService.getInvGroups()';
    const endpoint = '/api/InvGroups';
    try {
        console.log(`Testing API Service function: ${functionName}`);
        console.log(`Underlying API endpoint: ${endpoint}`);
        const startTime = performance.now();
        const results = await apiService.getInvGroups();
        const duration = Math.round(performance.now() - startTime);
        
        // Analyze the first item to determine structure
        const sampleItem = results.length > 0 ? results[0] : null;
        const itemStructure = sampleItem ? Object.keys(sampleItem) : [];
          console.log('%cAPI Service Test Results: getInvGroups()', 'color: #4CAF50; font-weight: bold;');
        console.log(`Service Function: apiService.getInvGroups()`);
        console.log(`Underlying Endpoint: ${endpoint}`);
        console.log(`Status: Success ✓ (${duration}ms)`);
        console.log(`Items: ${results.length}`);
        console.log('Data Structure:', itemStructure);
        console.table(results.slice(0, 3));
        
        return Promise.resolve();
    } catch (error: any) {        console.error('%cAPI Service Test Failed: getInvGroups()', 'color: #F44336; font-weight: bold;');
        console.error(`Service Function: apiService.getInvGroups()`);
        console.error(`Underlying Endpoint: ${endpoint}`);
        console.error(`Error:`, error);
        return Promise.reject(error);
    }
};

/**
 * Test the API service function for inventory categories
 * @returns Promise that resolves when the operation completes
 */
export const testInvCategoriesApi = async (): Promise<void> => {
    const functionName = 'apiService.getInvCategories()';
    const endpoint = '/api/InvCategories';
    try {
        console.log(`Testing API Service function: ${functionName}`);
        console.log(`Underlying API endpoint: ${endpoint}`);
        const startTime = performance.now();
        const results = await apiService.getInvCategories();
        const duration = Math.round(performance.now() - startTime);
        
        // Analyze the first item to determine structure
        const sampleItem = results.length > 0 ? results[0] : null;
        const itemStructure = sampleItem ? Object.keys(sampleItem) : [];
          console.log('%cAPI Service Test Results: getInvCategories()', 'color: #4CAF50; font-weight: bold;');
        console.log(`Service Function: apiService.getInvCategories()`);
        console.log(`Underlying Endpoint: ${endpoint}`);
        console.log(`Status: Success ✓ (${duration}ms)`);
        console.log(`Items: ${results.length}`);
        console.log('Data Structure:', itemStructure);
        console.table(results.slice(0, 3));
        
        return Promise.resolve();
    } catch (error: any) {        console.error('%cAPI Service Test Failed: getInvCategories()', 'color: #F44336; font-weight: bold;');
        console.error(`Service Function: apiService.getInvCategories()`);
        console.error(`Underlying Endpoint: ${endpoint}`);
        console.error(`Error:`, error);
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
    },
    {
        id: 'debug query builder',
        label: 'Debug Query Builder',
        description: 'Debugs the query builder and logs the results.',
        icon: ['fas', 'bug'],
        tags: ['debug', 'query', 'builder'],
        action: debugQB
    },
    {
        id: 'test-inv-types-api',
        label: 'Test apiService.getInvTypes()',
        description: 'Tests the API service function for retrieving inventory types.',
        icon: ['fas', 'vial'],
        tags: ['api', 'testing', 'connectivity', 'service'],
        action: () => testInvTypesApi()
    },
    {
        id: 'test-blueprints-api',
        label: 'Test apiService.getBlueprints()',
        description: 'Tests the API service function for retrieving blueprints.',
        icon: ['fas', 'vial'],
        tags: ['api', 'testing', 'connectivity', 'service'],
        action: () => testBlueprintsApi()
    },
    {
        id: 'test-inv-groups-api',
        label: 'Test apiService.getInvGroups()',
        description: 'Tests the API service function for retrieving inventory groups.',
        icon: ['fas', 'vial'],
        tags: ['api', 'testing', 'connectivity', 'service'],
        action: () => testInvGroupsApi()
    },
    {
        id: 'test-inv-categories-api',
        label: 'Test apiService.getInvCategories()',
        description: 'Tests the API service function for retrieving inventory categories.',
        icon: ['fas', 'vial'],
        tags: ['api', 'testing', 'connectivity', 'service'],
        action: () => testInvCategoriesApi()
    },
    {
        id: 'test-all-apis',
        label: 'Test All API Service Functions',
        description: 'Tests all available API service functions in the apiService.',
        icon: ['fas', 'network-wired'],
        tags: ['api', 'testing', 'connectivity', 'service'],        action: async () => {
            console.log('%cTesting All API Service Functions', 'color: #2196F3; font-weight: bold;');
            console.log('Testing individual service functions from apiService.ts:');
            await testInvTypesApi();
            await testBlueprintsApi();
            await testInvGroupsApi();
            await testInvCategoriesApi();
            console.log('%cAll API Service function tests completed', 'color: #2196F3; font-weight: bold;');
            return Promise.resolve();
        }
    },
    // Additional admin actions can be added here as the admin functionality grows
];