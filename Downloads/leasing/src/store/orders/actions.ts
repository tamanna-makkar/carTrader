import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import { userQuery } from '@/types'

export enum ordersActionTypes {
    GET_ALLORDERS = 'GET_ALLORDERS'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [ordersActionTypes.GET_ALLORDERS]({ commit }: AugmentedActionContext, payload: userQuery): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [ordersActionTypes.GET_ALLORDERS]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.getAllCarOrders(data.query)
        commit(MutationTypes.SET_ALL_ORDERS, res.companyOrdersResponse)
        commit(MutationTypes.SET_ALL_TOTAL_ORDERS, res.totalRecords)
        commit(MutationTypes.SET_LOADER, false)
    }
}

