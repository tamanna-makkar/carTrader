import { BaseApi } from './base'
import { UserForgetPasswordRequest, UserForgetPasswordResponse, UserLogInRequest, UserLogInResponse, resetPasswordRequest, resetPasswordResponse } from '../types'
import { AxiosRequestConfig } from 'axios'
import router from '@/router'
import { AxiosError } from 'axios'
import { VueCookieNext } from 'vue-cookie-next'

class NoAuthApi extends BaseApi {
    public constructor() {
        super(process.env.VUE_APP_API_URL)
        this.instance.interceptors.response.use(this._handleResponse, this._handleError)
        this.instance.interceptors.request.use(this._handleRequest)
    }
    protected _handleRequest = (config: AxiosRequestConfig) => {
        config.withCredentials = true
        return config
    }
    public postUserLogIn = (body: UserLogInRequest) => this.instance.post<UserLogInResponse>(`api/login_check`, body)
    public forgetPassword = (lang: string, body: UserForgetPasswordRequest) => this.instance.post<UserForgetPasswordResponse>(`password/forgot/${lang}`, body)
    public resetPassword = (data: resetPasswordRequest) => this.instance.post<resetPasswordResponse>(`password/reset/${data['email']}/${data['activationKey']}`, data['body'])
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
