import {
    BlueprintsApi,
    Configuration,
    InvCategoriesApi, 
    InvGroupsApi,
    InvTypesApi,
    type BlueprintDto, 
    type InvCategoryDto,
    type InvGroupDto,
    type InvTypeShortDto, 
} from "../api-client";

/**
 * Service layer that wraps the auto-generated API clients
 * Provides simplified interface for API operations with consistent error handling
 */
class ApiService {
    private invTypesApi: InvTypesApi;
    private blueprintsApi: BlueprintsApi;
    private invGroupsApi: InvGroupsApi;
    private invCategoriesApi: InvCategoriesApi;

    constructor(config: Configuration) {
        this.invTypesApi = new InvTypesApi(config);
        this.blueprintsApi = new BlueprintsApi(config);
        this.invGroupsApi = new InvGroupsApi(config);
        this.invCategoriesApi = new InvCategoriesApi(config);
    }

    /**
     * Get inventory types matching the optional search string
     */
    public async getInvTypes(searchString?: string): Promise<InvTypeShortDto[]> {
        try {
            const response = await this.invTypesApi.apiInvTypesGet(searchString);
            return response.data;
        } catch (error) {
            console.error("Error fetching InvTypes:", error);
            throw error;
        }
    }

    /**
     * Get all blueprints
     */
    public async getBlueprints(): Promise<BlueprintDto[]> {
        try {
            const response = await this.blueprintsApi.apiBlueprintsGet();
            return response.data;
        } catch (error) {
            console.error("Error fetching Blueprints:", error);
            throw error;
        }
    }

    /**
     * Get all inventory groups
     */
    public async getInvGroups(): Promise<InvGroupDto[]> {
        try {
            const response = await this.invGroupsApi.apiInvGroupsGet();
            return response.data;
        } catch (error) {
            console.error("Error fetching InvGroups:", error);
            throw error;
        }
    }

    /**
     * Get all inventory categories
     */
    public async getInvCategories(): Promise<InvCategoryDto[]> {
        try {
            const response = await this.invCategoriesApi.apiInvCategoriesGet();
            return response.data;
        } catch (error) {
            console.error("Error fetching InvCategories:", error);
            throw error;
        }
    }
}

const config = new Configuration({
    basePath: "https://localhost:7017"
});

const apiService = new ApiService(config);

export default apiService;