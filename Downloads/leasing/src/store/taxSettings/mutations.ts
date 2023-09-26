import { MutationTree } from 'vuex'
import { State } from './index'
import { taxSettingsAddRequest } from '@/types'

export enum MutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_TAXSETTINGS = 'SET_TAXSETTINGS',
    SET_ADDTAXSETTINGSSUCESS = 'SET_ADDTAXSETTINGSSUCESS',
    SET_TAXSETTINGS_ERROR = 'SET_TAXSETTINGERROR'
}

export type Mutations<S = State> = {
    [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_TAXSETTINGS](state: S, payload: taxSettingsAddRequest): void;
    [MutationTypes.SET_ADDTAXSETTINGSSUCESS](state: S, payload: boolean): void;
    [MutationTypes.SET_TAXSETTINGS_ERROR](state: S, payload: string | Array<string>): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_TAXSETTINGS](state, payload) {
        state.getTaxSettingsByYear = payload
    },
    [MutationTypes.SET_ADDTAXSETTINGSSUCESS](state, payload) {
        state.isTaxSettingsAdded = payload
    },
    [MutationTypes.SET_TAXSETTINGS_ERROR](state, payload) {
        state.taxSettingErrors = payload
    }
}
