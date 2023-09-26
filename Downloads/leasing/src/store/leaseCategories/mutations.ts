import { MutationTree } from 'vuex'
import { State } from './index'
import { leaseCategoryResponseType } from '@/types'

export enum MutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_ALLLEASECATEGORIES = 'SET_ALLLEASECATEGORIES',
    SET_LEASECATEGORYBYID = 'SET_LEASEBYID',
    SET_UPDATELEASECATEGORYRESPONSE = 'SET_UPDATELEASECATEGORYRESPONSE'
}

export type Mutations<S = State> = {
    [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_ALLLEASECATEGORIES](state: S, payload: leaseCategoryResponseType[]): void;
    [MutationTypes.SET_LEASECATEGORYBYID](state: S, payload: leaseCategoryResponseType): void;
    [MutationTypes.SET_UPDATELEASECATEGORYRESPONSE](state: S, payload: Array<string>): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_ALLLEASECATEGORIES](state, payload) {
        state.allLeaseCategories = payload
    },
    [MutationTypes.SET_LEASECATEGORYBYID](state, payload) {
        state.leaseCategoryByID = payload
    },
    [MutationTypes.SET_LEASECATEGORYBYID](state, payload) {
        state.leaseCategoryByID = payload
    },
    [MutationTypes.SET_UPDATELEASECATEGORYRESPONSE](state, payload) {
        state.updateLeaseCategoryResponse = payload
    }
}
