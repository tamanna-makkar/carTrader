import { MutationTree } from 'vuex'
import { State } from './index'
import { carDiscountDetails, discountAddResponse, discountDeleteResponse } from '@/types'

export enum MutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_ALL_DISCOUNTCARS = 'SET_ALL_DISCOUNTCARS',
    SET_UPDATE_DISCOUNT_RES = 'SET_UPDATE_DISCOUNT_RES'
}

export type Mutations<S = State> = {
    [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_ALL_DISCOUNTCARS](state: S, payload: carDiscountDetails): void;
    [MutationTypes.SET_UPDATE_DISCOUNT_RES](state: S, payload: discountAddResponse | discountDeleteResponse): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_ALL_DISCOUNTCARS](state, payload) {
        state.getCarBrandsDiscount = payload
    },
    [MutationTypes.SET_UPDATE_DISCOUNT_RES](state, payload) {
        state.setDiscountResponse = payload
    },
}
