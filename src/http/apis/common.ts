import $http from '@/http/core/request'
import { authRequestParams } from "@/hooks/socket";

/**
 * 获取socket链接地址
 **/
export function getWebsocketAuth (params: authRequestParams) {
    const path:string = '/auth'
    return $http.post(path, params, {baseUrl: params.request_url, cacheTime: 50000})
}
