import $http from '@/http/core/request'

export function userRegister(params: any) {
    const path:string = '/api/user/register'
    return $http.post(path, params, { alertError: true, cacheTime: 10000 })
}
