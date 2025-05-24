# InvTypesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiInvTypesGet**](#apiinvtypesget) | **GET** /api/InvTypes | |
|[**apiInvTypesIdGet**](#apiinvtypesidget) | **GET** /api/InvTypes/{id} | |

# **apiInvTypesGet**
> Array<InvTypeDto> apiInvTypesGet()


### Example

```typescript
import {
    InvTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvTypesApi(configuration);

let ids: Array<number>; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiInvTypesGet(
    ids
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ids** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|


### Return type

**Array<InvTypeDto>**

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

# **apiInvTypesIdGet**
> InvTypeDto apiInvTypesIdGet()


### Example

```typescript
import {
    InvTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvTypesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiInvTypesIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**InvTypeDto**

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

