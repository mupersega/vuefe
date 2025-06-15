# IndustryActivityMaterialsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiIndustryActivityMaterialsGet**](#apiindustryactivitymaterialsget) | **GET** /api/industry-activity-materials | |
|[**apiIndustryActivityMaterialsTypeIdActivityIdMaterialTypeIdGet**](#apiindustryactivitymaterialstypeidactivityidmaterialtypeidget) | **GET** /api/industry-activity-materials/{typeId}/{activityId}/{materialTypeId} | |

# **apiIndustryActivityMaterialsGet**
> Array<IndustryActivityMaterial> apiIndustryActivityMaterialsGet()


### Example

```typescript
import {
    IndustryActivityMaterialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IndustryActivityMaterialsApi(configuration);

let typeId: number; // (optional) (default to undefined)
let activityId: number; // (optional) (default to undefined)
let materialTypeId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiIndustryActivityMaterialsGet(
    typeId,
    activityId,
    materialTypeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **typeId** | [**number**] |  | (optional) defaults to undefined|
| **activityId** | [**number**] |  | (optional) defaults to undefined|
| **materialTypeId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**Array<IndustryActivityMaterial>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIndustryActivityMaterialsTypeIdActivityIdMaterialTypeIdGet**
> IndustryActivityMaterial apiIndustryActivityMaterialsTypeIdActivityIdMaterialTypeIdGet()


### Example

```typescript
import {
    IndustryActivityMaterialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IndustryActivityMaterialsApi(configuration);

let typeId: number; // (default to undefined)
let activityId: number; // (default to undefined)
let materialTypeId: number; // (default to undefined)

const { status, data } = await apiInstance.apiIndustryActivityMaterialsTypeIdActivityIdMaterialTypeIdGet(
    typeId,
    activityId,
    materialTypeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **typeId** | [**number**] |  | defaults to undefined|
| **activityId** | [**number**] |  | defaults to undefined|
| **materialTypeId** | [**number**] |  | defaults to undefined|


### Return type

**IndustryActivityMaterial**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

