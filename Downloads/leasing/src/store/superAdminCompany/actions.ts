import { ActionContext, ActionTree } from 'vuex'
import { Mutations, superAdminMutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import router from '@/router'
import { userQuery, companyAddRequest, companyLeaseRateAdd, employeeUserResponseType, uploadLeaseRateBodyType, userQueryType } from '@/types'

export enum superAdminCompanyActionTypes {
    GET_ALLCOMPANIES = 'GET_ALLCOMPANIES',
    ADD_COMPANY = 'ADD_COMPANY',
    UPDATE_COMPANY = 'UPDATE_COMPANY',
    ADD_COMPANY_USER = 'ADD_COMPANY_USER',
    ADD_COMPANY_LEASERATE = 'ADD_COMPANY_LEASERATE',
    GET_COMPANY_LEASERATE = 'GET_COMPANY_LEASERATE',
    UPDATE_COMPANY_LEASERATE = 'UPDATE_COMPANY_LEASERATE',
    DELETE_COMPANY_LOGO = 'DELETE_COMPANY_LOGO',
    UPLOAD_LEASERATE = 'UPLOAD_LEASERATE',
    GET_NOTINLEASERATE = 'GET_NOTINLEASERATE'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [superAdminCompanyActionTypes.GET_ALLCOMPANIES]({ commit }: AugmentedActionContext, payload: userQuery): void;
    [superAdminCompanyActionTypes.ADD_COMPANY]({ commit }: AugmentedActionContext, payload: { body: companyAddRequest }): void;
    [superAdminCompanyActionTypes.UPDATE_COMPANY]({ commit }: AugmentedActionContext, payload: { companyId: number; body: companyAddRequest }): void;
    [superAdminCompanyActionTypes.ADD_COMPANY_USER]({ commit }: AugmentedActionContext, payload: { companyId: number; body: employeeUserResponseType; lang: string }): void;
    [superAdminCompanyActionTypes.ADD_COMPANY_LEASERATE]({ commit }: AugmentedActionContext, payload: { companyId: number; body: companyLeaseRateAdd }): void;
    [superAdminCompanyActionTypes.UPDATE_COMPANY_LEASERATE]({ commit }: AugmentedActionContext, payload: { companyId: number; leaseRateId: number; body: companyLeaseRateAdd }): void;
    [superAdminCompanyActionTypes.GET_COMPANY_LEASERATE]({ commit }: AugmentedActionContext, payload: { companyId: number }): void;
    [superAdminCompanyActionTypes.DELETE_COMPANY_LOGO]({ commit }: AugmentedActionContext, payload: { companyId: number }): void;
    [superAdminCompanyActionTypes.UPLOAD_LEASERATE]({ commit }: AugmentedActionContext, payload: { body: uploadLeaseRateBodyType }): void;
    [superAdminCompanyActionTypes.GET_NOTINLEASERATE]({ commit }: AugmentedActionContext, payload: { query: userQueryType } ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [superAdminCompanyActionTypes.GET_ALLCOMPANIES]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LOADER, true)
        const res = await authApi.getAllCompanies(data.query)
        commit(superAdminMutationTypes.SET_ALL_COMPANIES, res.companyResponse)
        commit(superAdminMutationTypes.SET_ALL_TOTAL_COMPANIES, res.totalRecords)
        commit(superAdminMutationTypes.SET_LOADER, false)
    },
    async [superAdminCompanyActionTypes.ADD_COMPANY]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LOADER, true)
        const res = await authApi.companyAdd(data.body)
        commit(superAdminMutationTypes.SET_SUPERADMIN_COMPANYID, null)
        commit(superAdminMutationTypes.SET_COMPANY_ERROR, '')
        if (res.companyId) {
            commit(superAdminMutationTypes.SET_SUPERADMIN_COMPANYID, res.companyId)
        } else {
            commit(superAdminMutationTypes.SET_COMPANY_ERROR, res.companyResponse)
        }
        commit(superAdminMutationTypes.SET_LOADER, false)
    },
    async [superAdminCompanyActionTypes.UPDATE_COMPANY]({ commit }, data) {
        const res = await authApi.companyUpdate(data.companyId, data.body)
        if (res.companyResponse !== 'Company updated') {
            commit(superAdminMutationTypes.SET_COMPANY_ERROR, res.companyResponse)
        }
    },
    async [superAdminCompanyActionTypes.DELETE_COMPANY_LOGO]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LOADER, true)
        await authApi.deleteCompanyLogoById(data.companyId)
        commit(superAdminMutationTypes.SET_LOADER, false)
    },
    async [superAdminCompanyActionTypes.ADD_COMPANY_USER]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LOADER, true)
        const res = await authApi.addUser(data.companyId, data.body, data.lang)
        commit(superAdminMutationTypes.SET_USER_ERROR, '')
        if (res.status != 'success') {
            commit(superAdminMutationTypes.SET_USER_ERROR, res.userResponse)
        } else {
            router.push({ name: 'Companies', query: { page: 1 } })
        }
        commit(superAdminMutationTypes.SET_LOADER, false)
    },
    async [superAdminCompanyActionTypes.ADD_COMPANY_LEASERATE]({ commit }, data) {
        const res = await authApi.companyLeaseRateAdd(data.companyId, data.body)
        if (res.status == 'error') {
           commit(superAdminMutationTypes.SET_LEASE_RATE_ERROR, res.companyLeaseRateResponse)
        }
    },
    async [superAdminCompanyActionTypes.UPDATE_COMPANY_LEASERATE]({ commit }, data) {
        const res = await authApi.companyLeaseRateUpdate(data.companyId, data.leaseRateId, data.body)
        if (res.companyLeaseRateResponse == 'Company Lease Rate updated') {
            router.push({ name: 'Companies', query: { page: 1 } })
        } else if (res.status == 'error') {
            commit(superAdminMutationTypes.SET_LEASE_RATE_ERROR, res.companyLeaseRateResponse)
        }
    },
    async [superAdminCompanyActionTypes.GET_COMPANY_LEASERATE]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LOADER, true)
        const res = await authApi.getCompanyLeaseRate(data.companyId)
        if (Array.isArray(res.companyLeaseRateResponse)) {
            commit(superAdminMutationTypes.SET_COMPANY_LEASE_RATE, res.companyLeaseRateResponse[0])
        }   
        commit(superAdminMutationTypes.SET_LOADER, false)
    },
    async [superAdminCompanyActionTypes.UPLOAD_LEASERATE]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LEASERATEDATA_LOADER, true)
        const res = await authApi.uploadLeaseRate(data.body)
        commit(superAdminMutationTypes.SET_LEASERATEDATA_RESPONSE, res.status)
        authApi.logLeaseRate()
        commit(superAdminMutationTypes.SET_LEASERATEDATA_MSG, res.leaseRateResponse)
        commit(superAdminMutationTypes.SET_LEASERATEDATA_LOADER, false)
    },
    async [superAdminCompanyActionTypes.GET_NOTINLEASERATE]({ commit }, data) {
        commit(superAdminMutationTypes.SET_LOADER, true)
        await authApi.getNotInLeaseRateData(data.query).then((res) => { 
            commit(superAdminMutationTypes.SET_NOTINLEASERATE_DATA, res['leaseRateResponse'])
        })
        commit(superAdminMutationTypes.SET_LOADER, false)
    }
}

