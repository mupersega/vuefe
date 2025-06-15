# IndustryActivityProductsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiIndustryActivityProductsGet**](#apiindustryactivityproductsget) | **GET** /api/industry-activity-products | |
|[**apiIndustryActivityProductsTypeIdActivityIdProductTypeIdGet**](#apiindustryactivityproductstypeidactivityidproducttypeidget) | **GET** /api/industry-activity-products/{typeId}/{activityId}/{productTypeId} | |

# **apiIndustryActivityProductsGet**
> Array<IndustryActivityProduct> apiIndustryActivityProductsGet()


### Example

```typescript
import {
    IndustryActivityProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IndustryActivityProductsApi(configuration);

let typeId: number; // (optional) (default to undefined)
let activityId: number; // (optional) (default to undefined)
let productTypeId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiIndustryActivityProductsGet(
    typeId,
    activityId,
    productTypeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **typeId** | [**number**] |  | (optional) defaults to undefined|
| **activityId** | [**number**] |  | (optional) defaults to undefined|
| **productTypeId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**Array<IndustryActivityProduct>**

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

# **apiIndustryActivityProductsTypeIdActivityIdProductTypeIdGet**
> IndustryActivityProduct apiIndustryActivityProductsTypeIdActivityIdProductTypeIdGet()


### Example

```typescript
import {
    IndustryActivityProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IndustryActivityProductsApi(configuration);

let typeId: number; // (default to undefined)
let activityId: number; // (default to undefined)
let productTypeId: number; // (default to undefined)

const { status, data } = await apiInstance.apiIndustryActivityProductsTypeIdActivityIdProductTypeIdGet(
    typeId,
    activityId,
    productTypeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **typeId** | [**number**] |  | defaults to undefined|
| **activityId** | [**number**] |  | defaults to undefined|
| **productTypeId** | [**number**] |  | defaults to undefined|


### Return type

**IndustryActivityProduct**

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

