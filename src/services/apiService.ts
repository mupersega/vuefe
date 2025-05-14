import { InvTypesApi, Configuration, type InvTypeShortDto } from "../api-client";

class ApiService {
    private invTypesApi: InvTypesApi;

    constructor(config: Configuration) {
        this.invTypesApi = new InvTypesApi(config);
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
}

const config = new Configuration({
    basePath: "https://localhost:7017"
});

const apiService = new ApiService(config);

export default apiService;