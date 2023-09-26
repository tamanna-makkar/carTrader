import { BaseApi } from './base'
import { UserLogInResponse } from '@/types'
import { AxiosRequestConfig } from 'axios'
import { AxiosError } from 'axios'
import { VueCookieNext } from 'vue-cookie-next'
import router from '@/router'

class NoAuthApi extends BaseApi {
    public constructor() {
        super(process.env.VUE_APP_API_URL)
        this.instance.interceptors.response.use(this._handleResponse, this._handleError)
        this.instance.interceptors.request.use(this._handleRequest)
    }
    public refreshToken = () => this.instance.post<UserLogInResponse>(`api/token/refresh`)
    protected _handleRequest = (config: AxiosRequestConfig) => {
        config.withCredentials = true
        return config
    }
    protected _handleError = async (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response
            switch (status) {
                case 401:
                    VueCookieNext.removeCookie('companyId')
                    VueCookieNext.removeCookie('adminCompanyId')
                    VueCookieNext.removeCookie('employeeCarPolicyId')
                    VueCookieNext.removeCookie('roles')
                    VueCookieNext.removeCookie('latestcarOrderId')
                    VueCookieNext.removeCookie('status')
                    sessionStorage.clear()
                    localStorage.clear()
                    router.push({ name: 'login' })
                    return Promise.reject(error)
                default:
                    router.push({ name: 'ErrorPage' })
                    return Promise.reject(error)
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            return Promise.reject(error)
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject(error)
        }
    }
}

const noAuthApi: NoAuthApi = new NoAuthApi()

export default noAuthApi
