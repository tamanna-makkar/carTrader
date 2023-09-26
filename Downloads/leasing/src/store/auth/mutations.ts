import { MutationTree } from 'vuex'
import { State } from './index'
import { carBrandsModelType, currentUserResponseType, carPolicyResponseType, employeeUserResponseType, employeeUserUpdateType } from '@/types'

export enum AuthMutationTypes {
    SET_USER = 'SET_USER',
    SET_LOADER = 'SET_LOADER',
    SET_ERROR = 'SET_ERROR',
    SET_CARPOLICYBRANDSMODELS = 'SET_CARPOLICYBRANDSMODELS',
    SET_CARPOLICYBYID = 'SET_CARPOLICYBYID',
    UPDATE_USER = 'UPDATE_USER',
    SET_RESETSUCCESS = 'SET_RESETSUCCESS',
    SET_PASSWORD_ERRORS = 'SET_PASSWORD_ERRORS',
    SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
    SET_RESET_PASSWORD_ERROR = 'SET_RESET_PASSWORD_ERROR',
}

export type Mutations<S = State> = {
    [AuthMutationTypes.SET_USER](state: S, payload: currentUserResponseType): void;
    [AuthMutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [AuthMutationTypes.SET_ERROR](state: S, payload: string): void;
    [AuthMutationTypes.SET_CARPOLICYBRANDSMODELS](state: S, payload: carBrandsModelType[]): void;
    [AuthMutationTypes.SET_CARPOLICYBYID](state: S, payload: carPolicyResponseType): void;
    [AuthMutationTypes.UPDATE_USER](state: S, payload: employeeUserResponseType | employeeUserUpdateType): void;
    [AuthMutationTypes.SET_RESETSUCCESS](state: S, payload: boolean): void;
    [AuthMutationTypes.SET_PASSWORD_ERRORS](state: S, payload: string[]): void;
    [AuthMutationTypes.SET_ACCESS_TOKEN](state: S, payload: string): void;
    [AuthMutationTypes.SET_RESET_PASSWORD_ERROR](state: S, payload: string): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [AuthMutationTypes.SET_USER](state, payload) {
        state.currentUser = payload
    },
    [AuthMutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [AuthMutationTypes.SET_ERROR](state, payload) {
        state.isError = payload
    },
    [AuthMutationTypes.SET_CARPOLICYBRANDSMODELS](state, payload) {
        state.carPolicyBrandsModels = payload
    },
    [AuthMutationTypes.SET_CARPOLICYBYID](state, payload) {
        state.carPolicyByID = payload
    },
    [AuthMutationTypes.UPDATE_USER](state, payload) {
        state.currentUser = Object.assign({}, state.currentUser, { incomeTax: payload.incomeTax, privateUse: payload.privateUse })
    },
    [AuthMutationTypes.SET_RESETSUCCESS](state, payload) {
        state.showResetSuccess = payload
    },
    [AuthMutationTypes.SET_PASSWORD_ERRORS](state, payload) {
        state.passwordErrors = payload
    },
    [AuthMutationTypes.SET_ACCESS_TOKEN](state, payload) {
        state.accessToken = payload
    },
    [AuthMutationTypes.SET_RESET_PASSWORD_ERROR](state, payload) {
        state.resetPasswordError = payload
    }
}
