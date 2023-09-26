import { MutationTree } from 'vuex'
import { State } from './index'
import { companyOrdersResponse } from '@/types'

export enum MutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_ALL_ORDERS = 'SET_ALL_ORDERS',
    SET_ALL_TOTAL_ORDERS = 'SET_ALL_TOTAL_ORDERS'
}

export type Mutations<S = State> = {
    [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_ALL_ORDERS](state: S, payload: companyOrdersResponse[]): void;
    [MutationTypes.SET_ALL_TOTAL_ORDERS](state: S, payload: number): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_ALL_ORDERS](state, payload) {
        state.allOrders = payload
    },
    [MutationTypes.SET_ALL_TOTAL_ORDERS](state, payload) {
        state.totalOrders = payload
    }
}
