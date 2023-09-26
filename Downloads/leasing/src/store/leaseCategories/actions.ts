import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import router from '@/router'
import { leaseCategoryResponseType } from '@/types'

export enum leaseActionTypes {
    'GET_ALLCATEGORIES' = 'GET_ALLCATEGORIES',
    'GET_LEASEBYID' = 'GET_LEASEBYID',
    'UPDATE_LEASEBYID' = 'UPDATE_LEASEBYID',
    'DELETE_LEASEBYID' = 'DELETE_LEASEBYID',
    'ADD_LEASECATEGORY' = 'ADD_LEASECATEGORY'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [leaseActionTypes.GET_ALLCATEGORIES]({ commit }: AugmentedActionContext, payload: { companyId: number }): void;
    [leaseActionTypes.GET_LEASEBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; leaseCategoryId: number }): void;
    [leaseActionTypes.UPDATE_LEASEBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; leaseCategoryId: number; data: leaseCategoryResponseType }): void;
    [leaseActionTypes.DELETE_LEASEBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; leaseCategoryId: number }): void;
    [leaseActionTypes.ADD_LEASECATEGORY]({ commit }: AugmentedActionContext, payload: { companyId: number; data: leaseCategoryResponseType }): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [leaseActionTypes.GET_ALLCATEGORIES]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.getAllLeaseCategories(data.companyId)
        if (res)
            commit(MutationTypes.SET_ALLLEASECATEGORIES, res.leaseCategoryResponse)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [leaseActionTypes.GET_LEASEBYID]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.getLeaseCategoryByID(data.companyId, data.leaseCategoryId)
        if (res)
            commit(MutationTypes.SET_LEASECATEGORYBYID, res.leaseCategoryResponse)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [leaseActionTypes.UPDATE_LEASEBYID]({ commit }, leaseCategory) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.updateLeaseCategoryByID(leaseCategory.companyId, leaseCategory.leaseCategoryId, leaseCategory.data)
        if (res.status === 'success')
            router.push({ name: 'LeaseCategoryOverview' })
        else if (res.status === 'warning')
            commit(MutationTypes.SET_UPDATELEASECATEGORYRESPONSE, res.leaseCategoryResponse)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [leaseActionTypes.DELETE_LEASEBYID]({ commit }, leaseCategory) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.deleteLeaseCategoryByID(leaseCategory.companyId, leaseCategory.leaseCategoryId)
        if (res.status === 'success')
            router.push({ name: 'LeaseCategoryOverview' })
        else if (res.status == 'warning' || res.status == 'error')
            commit(MutationTypes.SET_UPDATELEASECATEGORYRESPONSE, res.leaseCategoryResponse)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [leaseActionTypes.ADD_LEASECATEGORY]({ commit }, leaseCategory) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.leaseCategoryAdd(leaseCategory.companyId, leaseCategory.data)
        if (res.status === 'success')
            router.push({ name: 'LeaseCategoryOverview' })
        else if (res.status === 'warning')
            commit(MutationTypes.SET_UPDATELEASECATEGORYRESPONSE, res.leaseCategoryResponse)
        commit(MutationTypes.SET_LOADER, false)
    }
}

