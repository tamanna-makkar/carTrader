import { BaseApi } from './base'
import { passwordBody, updatePasswordResponse, currentUserDetailsResponse, getCarPolicyRequest, getCarPolicyResponse, carPolicyAddType, carPolicyAddResponse, getAllCarPolicies, OptionsConfiguration, OptionsConfigurationRequest, carBrandsModel, getAllLeaseCategoriesResponse, getLeaseCategoryByIDResponse, leaseCategoryResponseType, updateLeaseCategoryByIDResponse, carDiscountDetails, discountAddRequest, discountAddResponse, discountDeleteRequest, discountDeleteResponse, employeeResponseType, userQueryType, employeeUserResponseType, getCarsByIdType, deleteUserResponseType, allSavedCars, carOrderDetails, carOrderBody, generalCarOrderResponse, companyGetByIdResponseType, companyResponseType, deleteCompanyLogoById, carOrderAddType, carOrderResponseType, employeeUserUpdateType, wizardStepsRequest, wizardStepsResponse, getAllCompaniesResponseType, companyAddResponse, companyLeaseRateResponse, companyAddRequest, companyLeaseRateAdd, uploadLeaseRateResponseType, uploadLeaseRateBodyType, taxSettingsAddRequest, taxSettingsAddResponse, getCompanyLeaseRateResponse, carColorsResponse, notInLeaseDataResponseType, getAllCompanyOrdersType } from '../types'
import router from '@/router'
import { AxiosRequestConfig, AxiosError } from 'axios'
import { VueCookieNext } from 'vue-cookie-next'
import { store } from '@/store'
import { AuthActionTypes } from '@/store/auth/actions'
let refreshingToken = null;

function refreshToken() {
    return store.dispatch(AuthActionTypes.REFRESH_TOKEN)
}

class AuthApi extends BaseApi {
    public constructor() {
        super(process.env.VUE_APP_API_URL)
        this.instance.interceptors.response.use(this._handleResponse, this._handleError)
        this.instance.interceptors.request.use(this._handleRequest)
    }
    public getCurrentUSer = () => this.instance.get<currentUserDetailsResponse>('current-user')

    // car Policy
    public carPolicyAdd = (companyId: number, body: carPolicyAddType) => this.instance.post<carPolicyAddResponse>(`company/${companyId}/car-policy/add`, body)
    public carPolicyUpdate = (companyId: number, carPolicyId: number, body: carPolicyAddType) => this.instance.post<carPolicyAddResponse>(`company/${companyId}/car-policy/update/${carPolicyId}`, body)
    public getCarPolicyById = (data: getCarPolicyRequest) => this.instance.get<getCarPolicyResponse>(`company/${data['companyId']}/car-policy/get/${data['carPolicyId']}`)
    public getAllCarPolicies = (companyId: number) => this.instance.get<getAllCarPolicies>(`company/${companyId}/car-policy/get-all`)
    public deleteCarPolicyDocument = (companyId: number, carPolicyId: number) => this.instance.delete<carPolicyAddResponse>(`company/${companyId}/car-policy/${carPolicyId}/delete-document`)
    public downloadCarPolicyDocument = (companyId: number, carPolicyId: number) => this.instance.post<Blob>(`company/${companyId}/car-policy/${carPolicyId}/download-document`)
    public deleteCarPolicy = (companyId: number, carPolicyId: number) => this.instance.delete<carPolicyAddResponse>(`company/${companyId}/car-policy/${carPolicyId}/delete`)
    public getCarColors = () => this.instance.get<carColorsResponse>('get-car-colors')
    // Options
    public getOptionsConfiguration = (vehicleId: number, body: OptionsConfigurationRequest) => this.instance.post<OptionsConfiguration>(`jato/vehicle/${vehicleId}/configure/options`, body)
    public getCarBrandsModels = () => this.instance.get<carBrandsModel>(`jato/car-brands-models`)

    // users
    public getAllUsers = (companyId: number, params: userQueryType) => this.instance.get<employeeResponseType>(`company/${companyId}/user/get-all/${params.page ? params.page : 1}`, { params: params })
    public addUser = (companyId: number, body: employeeUserResponseType, lang: string) => this.instance.post<deleteUserResponseType>(`company/${companyId}/user/add/${lang}`, body)
    public getUserById = (companyId: number, userId: number) => this.instance.get<employeeResponseType>(`company/${companyId}/user/get/${userId}`)
    public updateUserById = (companyId: number, userId: number, body: employeeUserResponseType | employeeUserUpdateType) => this.instance.put<deleteUserResponseType>(`company/${companyId}/user/update/${userId}`, body)
    public deleteUserById = (companyId: number, userId: number) => this.instance.delete<deleteUserResponseType>(`company/${companyId}/user/delete/${userId}`)
    public restoreUserById = (companyId: number, userId: number) => this.instance.put<deleteUserResponseType>(`/company/${companyId}/user/restore/${userId}`)
    // Lease Categories
    public getAllLeaseCategories = (companyId: number) => this.instance.get<getAllLeaseCategoriesResponse>(`company/${companyId}/lease-category/get-all`)
    public getLeaseCategoryByID = (companyId: number, leaseCategoryID: number) => this.instance.get<getLeaseCategoryByIDResponse>(`company/${companyId}/lease-category/get/${leaseCategoryID}`)
    public updateLeaseCategoryByID = (companyId: number, leaseCategoryID: number, body: leaseCategoryResponseType) => this.instance.put<updateLeaseCategoryByIDResponse>(`company/${companyId}/lease-category/update/${leaseCategoryID}`, body)
    public deleteLeaseCategoryByID = (companyId: number, leaseCategoryID: number) => this.instance.delete<updateLeaseCategoryByIDResponse>(`company/${companyId}/lease-category/${leaseCategoryID}/delete`)
    public leaseCategoryAdd = (companyId: number, body: leaseCategoryResponseType) => this.instance.post<updateLeaseCategoryByIDResponse>(`company/${companyId}/lease-category/add`, body)

    // getCarsById
    public getCarsByID = (vehicleId: number) => this.instance.get<getCarsByIdType>(`jato/cars/${vehicleId}`)

    // Saved Cars
    public getAllSavedCars = (params: userQueryType) => this.instance.get<allSavedCars>(`car-order/get-all`, { params: params })
    public getCarOrderDetails = (id: number) => this.instance.get<carOrderDetails>(`car-order/get/${id}`)
    public deleteSavedOrderCar = (id: number) => this.instance.delete<carOrderDetails>(`car-order/${id}/delete`)
    public saveCarOrder = (body: carOrderBody) => this.instance.post<carOrderResponseType>(`car-order/add`, body)

    // Company
    public getCompanyByID = (companyId: number) => this.instance.get<companyGetByIdResponseType>(`company/get/${companyId}`)
    public updateCompanyByID = (companyId: number, body: companyResponseType) => this.instance.post<deleteCompanyLogoById>(`company/update/${companyId}`, body)
    public deleteCompanyLogoById = (companyId: number) => this.instance.delete<deleteCompanyLogoById>(`company/${companyId}/delete-file`)
    // eslint-disable-next-line

    // superAdmin companies
    public getAllCompanies = (params: userQueryType) => this.instance.get<getAllCompaniesResponseType>(`company/get-all/${params.page ? params.page : 1}`, { params: params })
    public companyAdd = (body: companyAddRequest) => this.instance.post<companyAddResponse>(`company/add`, body)
    public companyUpdate = (companyId: number, body: companyAddRequest) => this.instance.post<companyAddResponse>(`company/update/${companyId}`, body)
    public companyLeaseRateAdd = (companyId: number, body: companyLeaseRateAdd) => this.instance.post<companyLeaseRateResponse>(`company/${companyId}/lease-rate/add`, body)
    public companyLeaseRateUpdate = (companyId: number, leaseRateId: number, body: companyLeaseRateAdd) => this.instance.put<companyLeaseRateResponse>(`company/${companyId}/lease-rate/update/${leaseRateId}`, body)
    public getCompanyLeaseRate = (companyId: number) => this.instance.get<getCompanyLeaseRateResponse>(`company/${companyId}/lease-rate/get-all`)

    public uploadLeaseRate = (body: uploadLeaseRateBodyType) => this.instance.post<uploadLeaseRateResponseType>(`lease-rate/upload`, body)
    public logLeaseRate = () => this.instance.get<uploadLeaseRateResponseType>(`lease-rate/log-data`)
    public getNotInLeaseRateData = (params: userQueryType) => this.instance.get<notInLeaseDataResponseType>(`external-data/not-in-lease-rate-data/${params.page ? params.page : 1}`, { params: params })
    // car order-insert
    public carOrderAdd = (body: carOrderAddType) => this.instance.post<carOrderResponseType>('car-order/add', body)
    public carOrderUpdate = (body: carOrderAddType, id: number) => this.instance.put<carOrderResponseType>(`car-order/update/${id}`, body)
    public carOrderGeneratePdf = (lang: string, carOrderId: number) => this.instance.get<generalCarOrderResponse>(`car-order/${carOrderId}/generate-pdf/${lang}`)
    public carOrderDownloadPdf = (lang: string, carOrderId: number) => this.instance.post<Blob>(`car-order/${carOrderId}/download-document/${lang}`)
    // search
    public postWizardSteps = (body: wizardStepsRequest) => this.instance.post<wizardStepsResponse>('user/search/api', body)

    //Auth
    public updatePassword = (id: number, body: passwordBody) => this.instance.post<updatePasswordResponse>(`password/update/${id}`, body)

    // Tax settings
    public taxSettingsAdd = (body: taxSettingsAddRequest) => this.instance.post<taxSettingsAddResponse>(`tax-settings/add`, body)
    public getTaxSettingsByYear = (year: number) => this.instance.get<taxSettingsAddRequest>(`tax-settings/get/${year}`)
    public taxSettingsDelete = (year: number) => this.instance.delete<taxSettingsAddRequest>(`tax-settings/${year}/delete`)

    // Discounts
    public getCarBrandsDiscount = (companyId: number, params: userQueryType) => this.instance.get<carDiscountDetails>(`company/${companyId}/car-discount/get-all`, { params: params })
    public addCarDiscount = (companyId: number, body: discountAddRequest) => this.instance.post<discountAddResponse>(`company/${companyId}/car-discount/add`, body)
    public deleteCarDiscount = (companyId: number, data: discountDeleteRequest) => this.instance.delete<discountDeleteResponse>(`company/${companyId}/car-discount/delete`, { data })
    public resetAllCarDiscount = (companyId: number) => this.instance.delete<discountDeleteResponse>(`company/${companyId}/car-discount/delete-all-company-discount`)

    // superAdmin company orders
    public getAllCarOrders = (params: userQueryType) => this.instance.get<getAllCompanyOrdersType>(`company-orders/get-all/${params.page ? params.page : 1}`, { params: params })

    protected _handleError = async (error: AxiosError) => {
        const config = error.config
        if (error.response) {
            const { status } = error.response
            switch (status) {
                // 500/404/403
                case 401:
                    try {
                        refreshingToken = refreshingToken ? refreshingToken : refreshToken();
                        await refreshingToken;
                        refreshingToken = null;
                        return this.instance(config)
                    } catch (e) {
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
                    }
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
    protected _handleRequest = (config: AxiosRequestConfig) => {
        config.headers.Authorization = `Bearer ${store.state.auth.accessToken}`
        if (config.url?.split('/').includes('download-document'))
            config.responseType = 'blob'
        return config
    }
}


const authApi: AuthApi = new AuthApi()

export default authApi
