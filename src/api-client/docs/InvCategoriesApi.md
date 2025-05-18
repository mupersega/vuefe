# InvCategoriesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiInvCategoriesGet**](#apiinvcategoriesget) | **GET** /api/InvCategories | |

# **apiInvCategoriesGet**
> Array<InvCategoryDto> apiInvCategoriesGet()


### Example

```typescript
import {
    InvCategoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvCategoriesApi(configuration);

const { status, data } = await apiInstance.apiInvCategoriesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InvCategoryDto>**

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

