# InvGroupsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiInvGroupsGet**](#apiinvgroupsget) | **GET** /api/InvGroups | |

# **apiInvGroupsGet**
> Array<InvGroupDto> apiInvGroupsGet()


### Example

```typescript
import {
    InvGroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvGroupsApi(configuration);

const { status, data } = await apiInstance.apiInvGroupsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InvGroupDto>**

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

