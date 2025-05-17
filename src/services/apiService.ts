import { BlueprintsApi, InvTypesApi, Configuration, type InvTypeShortDto, type BlueprintDto } from "../api-client";

class ApiService {
    private invTypesApi: InvTypesApi;
    private blueprintsApi: BlueprintsApi;

    constructor(config: Configuration) {
        this.invTypesApi = new InvTypesApi(config);
        this.blueprintsApi = new BlueprintsApi(config);
    }

    public async getInvTypes(searchString?: string): Promise<InvTypeShortDto[]> {
        try {
            const response = await this.invTypesApi.apiInvTypesGet(searchString);
            return response.data;
        } catch (error) {
            console.error("Error fetching InvType:", error);
            throw error;
        }
    }

    public async getBlueprints(): Promise<BlueprintDto[]> {
        try {
            const response = await this.blueprintsApi.apiBlueprintsGet();
            return response.data;
        } catch (error) {
            console.error("Error fetching Blueprints:", error);
            throw error;
        }
    }
}

const config = new Configuration({
    basePath: "https://localhost:7017"
});

const apiService = new ApiService(config);

export default apiService;