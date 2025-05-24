# TestsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTestGet**](#apitestget) | **GET** /api/test | |

# **apiTestGet**
> apiTestGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

const { status, data } = await apiInstance.apiTestGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

