# TypeNamesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTypeNamesGet**](#apitypenamesget) | **GET** /api/TypeNames | |

# **apiTypeNamesGet**
> Array<TypeNameDto> apiTypeNamesGet()


### Example

```typescript
import {
    TypeNamesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TypeNamesApi(configuration);

const { status, data } = await apiInstance.apiTypeNamesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TypeNameDto>**

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

