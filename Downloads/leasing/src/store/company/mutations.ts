import { MutationTree } from 'vuex'
import { State } from './index'
import { companyResponseType } from '@/types'

export enum MutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_COMPANYBYID = 'SET_COMPANYBYID',
    SET_ISCOMPANYUPDATED = 'SET_ISCOMPANYUPDATED',
    SET_LOGOERROR = 'SET_LOGOERROR',
}

export type Mutations<S = State> = {
    [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_COMPANYBYID](state: S, payload: companyResponseType): void;
    [MutationTypes.SET_ISCOMPANYUPDATED](state: S, payload: boolean): void;
    [MutationTypes.SET_LOGOERROR](state: S, payload: string): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_COMPANYBYID](state, payload) {
        state.getCompanyById = payload
    },
    [MutationTypes.SET_ISCOMPANYUPDATED](state, payload) {
        state.isCompanyUpdated = payload
    },
    [MutationTypes.SET_LOGOERROR](state, payload) {
        state.logoError = payload
    }
}
