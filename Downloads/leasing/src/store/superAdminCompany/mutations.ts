import { MutationTree } from 'vuex'
import { State } from './index'
import { companyResponseType, companyLeaseRateAdd, leaseRateResponseType } from '@/types'

export enum superAdminMutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_ALL_COMPANIES = 'SET_ALL_COMPANIES',
    SET_ALL_TOTAL_COMPANIES = 'SET_ALL_TOTAL_COMPANIES',
    SET_COMPANY_ERROR = 'SET_COMPANY_ERROR',
    SET_USER_ERROR = 'SET_USER_ERROR',
    SET_SUPERADMIN_COMPANYID = 'SET_SUPERADMIN_COMPANYID',
    SET_COMPANY_LEASE_RATE = 'SET_COMPANY_LEASE_RATE',
    SET_LEASE_RATE_ERROR = 'SET_LEASE_RATE_ERROR',
    SET_LEASERATEDATA_RESPONSE = 'SET_LEASERATEDATA_RESPONSE',
    SET_LEASERATEDATA_LOADER = 'SET_LEASERATEDATA_LOADER',
    SET_LEASERATEDATA_MSG = 'SET_LEASERATEDATA_MSG',
    SET_NOTINLEASERATE_DATA = 'SET_NOTINLEASERATE_DATA'
}

export type Mutations<S = State> = {
    [superAdminMutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [superAdminMutationTypes.SET_ALL_COMPANIES](state: S, payload: companyResponseType[]): void;
    [superAdminMutationTypes.SET_ALL_TOTAL_COMPANIES](state: S, payload: number): void;
    [superAdminMutationTypes.SET_COMPANY_ERROR](state: S, payload: string): void;
    [superAdminMutationTypes.SET_USER_ERROR](state: S, payload: string): void;
    [superAdminMutationTypes.SET_SUPERADMIN_COMPANYID](state: S, payload: number): void;
    [superAdminMutationTypes.SET_COMPANY_LEASE_RATE](state: S, payload: companyLeaseRateAdd): void;
    [superAdminMutationTypes.SET_LEASE_RATE_ERROR](state: S, payload: string): void;
    [superAdminMutationTypes.SET_LEASERATEDATA_RESPONSE](state: S, payload: string): void;
    [superAdminMutationTypes.SET_LEASERATEDATA_LOADER](state: S, payload: boolean): void;
    [superAdminMutationTypes.SET_LEASERATEDATA_MSG](state: S, payload: Array<string>): void;
    [superAdminMutationTypes.SET_NOTINLEASERATE_DATA](state: S, payload: leaseRateResponseType): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [superAdminMutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [superAdminMutationTypes.SET_ALL_COMPANIES](state, payload) {
        state.allCompanies = payload
    },
    [superAdminMutationTypes.SET_ALL_TOTAL_COMPANIES](state, payload) {
        state.totalCompanies = payload
    },
    [superAdminMutationTypes.SET_COMPANY_ERROR](state, payload) {
        state.companyError = payload
    },
    [superAdminMutationTypes.SET_USER_ERROR](state, payload) {
        state.userError = payload
    },
    [superAdminMutationTypes.SET_SUPERADMIN_COMPANYID](state, payload) {
        state.superAdminCompanyId = payload
    },
    [superAdminMutationTypes.SET_COMPANY_LEASE_RATE](state, payload) {
        state.companyLeaseRate = payload
    },
    [superAdminMutationTypes.SET_LEASE_RATE_ERROR](state, payload) {
        state.leaseRateError = payload
    },        
    [superAdminMutationTypes.SET_LEASERATEDATA_RESPONSE](state, payload) {
        state.leaseRateDataResponse = payload
    },
    [superAdminMutationTypes.SET_LEASERATEDATA_LOADER](state, payload) {
        state.leaseRateDataLoader = payload
    },
    [superAdminMutationTypes.SET_LEASERATEDATA_MSG](state, payload) {
        state.leaseRateDataMessage = payload
    },        
    [superAdminMutationTypes.SET_NOTINLEASERATE_DATA](state, payload) {
        state.notInLeaseRateData = payload
    }
}
