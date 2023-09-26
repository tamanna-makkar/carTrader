import { MutationTree } from 'vuex'
import { State } from './index'
import { carPolicyResponseType } from '@/types'

export enum carPolicyMutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_ALLPOLICIES = 'GET_ALLPOLICIES',
    DELETE_CARPOLICYRESPONSE = 'DELETE_CARPOLICYRESPONSE',
    SET_DOCUMENT_RESPONSE = 'SET_DOCUMENT_RESPONSE',
    SET_CAR_COLORS = 'SET_CAR_COLORS'
}

export type Mutations<S = State> = {
    [carPolicyMutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [carPolicyMutationTypes.SET_ALLPOLICIES](state: S, payload: carPolicyResponseType[]): void;
    [carPolicyMutationTypes.DELETE_CARPOLICYRESPONSE](state: S, payload: string): void;
    [carPolicyMutationTypes.SET_DOCUMENT_RESPONSE](state: S, payload: string): void;
    [carPolicyMutationTypes.SET_CAR_COLORS](state: S, payload: Array<string>): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [carPolicyMutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [carPolicyMutationTypes.SET_ALLPOLICIES](state, payload) {
        state.getAllCarPolicies = payload
    },
    [carPolicyMutationTypes.DELETE_CARPOLICYRESPONSE](state, payload) {
        state.deleteCarPolicyResponse = payload
    },
    [carPolicyMutationTypes.SET_DOCUMENT_RESPONSE](state, payload) {
        state.documentResponse = payload
    },
    [carPolicyMutationTypes.SET_CAR_COLORS](state, payload) {
        state.carColors = payload
    }
}
