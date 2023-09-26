import { MutationTree } from 'vuex'
import { State } from './index'
import { wizardStepsResponseAllHits } from '@/types'

export enum MutationTypes {
    SET_WIZARDS_LOADER = 'SET_WIZARDS_LOADER',
    SET_WIZARDS_RESULTS = 'SET_WIZARDS_RESULTS',
    SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
}

export type Mutations<S = State> = {
    [MutationTypes.SET_WIZARDS_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_WIZARDS_RESULTS](state: S, payload: wizardStepsResponseAllHits[]): void;
    [MutationTypes.SET_TOTAL_RECORDS](state: S, payload: number): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_WIZARDS_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_WIZARDS_RESULTS](state, payload) {
        state.wizardResults = payload
    },
    [MutationTypes.SET_TOTAL_RECORDS](state, payload) {
        state.totalRecords = payload
    }
}
