import HttpCache, {IResult} from './cache'
import {toQueryUrl} from '@/utils/common'
import event from '@/event/mitt'
import { getDeviceNo } from "@/utils/device";

let device: any = ''

getDeviceNo()
    .then(no => {
        device = no
    })

interface requestOptions {
    baseUrl: string;
    readonly path: string;
    params: any;
    loading: boolean;
    alertError: boolean;
    timeout: number;
    cacheTime: number;
    headers: any;
    responseType: XMLHttpRequestResponseType;
    pf: number;
    auth: number;
    method: 'POST' | 'GET' | 'DELETE'
}

type httpOptions = {
    baseUrl?: string;
    loading?: boolean;
    alertError?: boolean;
    timeout?: number;
    cacheTime?: number;
    headers?: any;
    responseType?: XMLHttpRequestResponseType;
    pf?: number;
    auth?: number;
}

/**
 * 默认请求配置
 * @baseUrl 基础路径
 * @path api路由
 * @params 参数,get post 都是 {}
 * @loading 请求时是否显示全局遮罩 loading
 * @alertError 请求报错是否弹框显示错误信息
 * @cacheTime 接口返回数据缓存时间 当 <= 0 时不缓存
 * @timeout 响应超时时间
 * @responseType 返回数据类型
 * @headers 请求头
 * @pf 是否 开启protobuf 0 不开启 1 开启
 * @auth < 0 不拦截接口的用户权限 0 弹框提示登录 1 强制跳转登录
 * */
const defaultRequestOptions: requestOptions = {
    baseUrl: __ENV__ === 'dev' ? '/proxy' : API_URL,
    path: '',
    params: {},
    loading: false,
    alertError: true,
    cacheTime: 1000,
    timeout: 20000,
    responseType: 'text',
    pf: 1,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'platform': '3',
    },
    auth: 1,
    method: 'GET'
}

/// 请求前
function handleBeforeRequest(options: requestOptions) {
    const {loading} = options
    // if (loading) show()

    // if (timer) {
    //   clearTimeout(timer)
    //   timer = null
    // }
}

// 请求后
function handleAfterRequest(options: requestOptions, response?: any) {
    console.log('\n======API result start=====')
    console.log('接口:', options.path)
    console.log('入参:', options.params)
    console.log('返回:', response)
    console.log('======API result end=========\n')
    const status = response?.status || -1
    // hide()
    // 弹框提示错误信息
    if ((status !== 0 && options.alertError) || [400, 401, 403, 404, 500, 501, 502, 503, 504].includes(status)) {
        event.emit('toast', {msg: response.msg})
    }
}

// 数据缓存上线100条
const httpStore = new HttpCache(100)

const request = async (options: requestOptions) => {
    const {baseUrl, path, cacheTime, params, timeout, headers, responseType, method} = options
    const httpCacheKey: string = HttpCache.createKey(path as string, params)
    const result: IResult = httpStore.get(httpCacheKey, cacheTime as number)
    handleBeforeRequest(options)

    // 缓存未过期
    if (result.code === 1) {
        handleAfterRequest(options, result.data)
        return Promise.resolve(result.data)
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        // 判断是否启用protobuf
        const body: any = params

        xhr.open(method as string, baseUrl as string + path, true)

        xhr.setRequestHeader('device_info', device as string)
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key] as string)
        }
        xhr.responseType = responseType as XMLHttpRequestResponseType
        xhr.send(method === 'POST' ? JSON.stringify(body) : null)
        xhr.timeout = timeout as number
        xhr.ontimeout = () => {
            handleAfterRequest(options, {status: 503, msg: '请求超时'})
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const result = xhr.responseText

                        const response = JSON.parse(result)

                        // 如果该接口缓存
                        if (Number(cacheTime) > 0) {
                            httpStore.put(httpCacheKey, {cacheTime: Date.now(), path: path, data: response})
                        }

                        handleAfterRequest(options, response)
                        resolve(response)
                    } catch (err) {
                        handleAfterRequest(options, {status: 500, msg: err})
                        reject(err)
                    }
                } else {
                    handleAfterRequest(options, {status: xhr.status, msg: '网络异常请稍后再试！'})
                    reject(xhr.responseText)
                }
            }
        }
    })
}

export default {
    post(path: string = '', params: any = {}, options: httpOptions) {

        const _options = mergeRequestOptions(options)

        const requestOption: requestOptions = {
            ..._options,
            path,
            params,
            method: 'POST'
        } as requestOptions

        return request(requestOption)
    },

    get(path: string = '', params: any = {}, options: httpOptions) {
        const _options = mergeRequestOptions(options)

        const _path = toQueryUrl(path, params)

        const requestOption: requestOptions = {
            ..._options,
            params: {},
            path: _path,
            method: 'GET'
        } as requestOptions
        return request(requestOption)
    }
}

function mergeRequestOptions(options: httpOptions = {}): httpOptions {

    return {
        baseUrl: options.baseUrl || defaultRequestOptions.baseUrl,
        loading: options.loading || defaultRequestOptions.loading,
        alertError: options.alertError || defaultRequestOptions.alertError,
        cacheTime: options.cacheTime || defaultRequestOptions.cacheTime,
        timeout: options.timeout || defaultRequestOptions.timeout,
        responseType: options.responseType || defaultRequestOptions.responseType,
        pf: options.pf || defaultRequestOptions.pf,
        headers: {
            ...defaultRequestOptions.headers,
            ...options.headers
        },
        auth: options.auth || defaultRequestOptions.auth
    }
}
