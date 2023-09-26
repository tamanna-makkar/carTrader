import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import { companyResponseType } from '@/types'

export enum CompanyActionTypes {
    GET_COMPANYBYID = 'GET_COMPANYBYID',
    UPDATE_COMPANYBYID = 'UPDATE_COMPANYBYID',
    DELETE_COMPANYLOGOBYID = 'DELETE_COMPANYLOGOBYID'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [CompanyActionTypes.GET_COMPANYBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; body: companyResponseType }): void;
    [CompanyActionTypes.UPDATE_COMPANYBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; body: companyResponseType }): void;
    [CompanyActionTypes.DELETE_COMPANYLOGOBYID]({ commit }: AugmentedActionContext, payload: { companyId: number }): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [CompanyActionTypes.GET_COMPANYBYID]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.getCompanyByID(data.companyId)
        commit(MutationTypes.SET_COMPANYBYID, res.companyResponse)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [CompanyActionTypes.UPDATE_COMPANYBYID]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.updateCompanyByID(data.companyId, data.body)
        if (res.companyResponse == 'Company updated' && res.status == 'success') {
            commit(MutationTypes.SET_ISCOMPANYUPDATED, true)
        } else if (res.status == 'error') {
            commit(MutationTypes.SET_LOGOERROR, res.fileResponse)
            if (res.companyResponse != 'Company updated') {
                commit(MutationTypes.SET_LOGOERROR, res.companyResponse)
            }    
        }
        commit(MutationTypes.SET_LOADER, false)
    },
    async [CompanyActionTypes.DELETE_COMPANYLOGOBYID]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        await authApi.deleteCompanyLogoById(data.companyId)
        commit(MutationTypes.SET_LOADER, false)
    }
}

