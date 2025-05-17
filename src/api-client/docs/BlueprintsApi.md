# BlueprintsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiBlueprintsGet**](#apiblueprintsget) | **GET** /api/Blueprints | |

# **apiBlueprintsGet**
> Array<BlueprintDto> apiBlueprintsGet()


### Example

```typescript
import {
    BlueprintsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlueprintsApi(configuration);

const { status, data } = await apiInstance.apiBlueprintsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<BlueprintDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

