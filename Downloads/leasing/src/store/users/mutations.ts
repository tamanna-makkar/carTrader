import { MutationTree } from 'vuex'
import { State } from './index'
import { employeeUserResponseType, orderedCarType } from '@/types'

export enum MutationTypes {
    SET_LOADER = 'SET_LOADER',
    SET_ALLUSERS = 'SET_ALLUSERS',
    SET_TOTALUSERS = 'SET_TOTALUSERS',
    SET_USERBYID = 'SET_USERBYID',
    SET_USERBYIDLOADER = 'SET_USERBYIDLOADER',
    SET_DELETEUSERBYIDRESPONSE = 'SET_DELETEUSERBYIDRESPONSE',
    SET_USER_ERROR = 'SET_USER_ERROR',
    SET_ISUSERUPDATED = 'SET_ISUSERUPDATED',
    SET_ORDERED_CAR = 'SET_ORDERED_CAR'
}

export type Mutations<S = State> = {
    [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_ALLUSERS](state: S, payload: employeeUserResponseType[]): void;
    [MutationTypes.SET_TOTALUSERS](state: S, payload: number): void;
    [MutationTypes.SET_USERBYID](state: S, payload: employeeUserResponseType): void;
    [MutationTypes.SET_USERBYIDLOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_DELETEUSERBYIDRESPONSE](state: S, payload: string): void;
    [MutationTypes.SET_USER_ERROR](state: S, payload: string): void;
    [MutationTypes.SET_ISUSERUPDATED](state: S, payload: boolean): void;
    [MutationTypes.SET_ORDERED_CAR](state: S, payload: orderedCarType): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_LOADER](state, payload) {
        state.loader = payload
    },
    [MutationTypes.SET_ALLUSERS](state, payload) {
        state.getAllUsers = payload
    },
    [MutationTypes.SET_TOTALUSERS](state, payload) {
        state.totalUsers = payload
    },
    [MutationTypes.SET_USERBYID](state, payload) {
        state.userById = payload
    },
    [MutationTypes.SET_USERBYIDLOADER](state, payload) {
        state.userByIdLoader = payload
    },
    [MutationTypes.SET_DELETEUSERBYIDRESPONSE](state, payload) {
        state.deleteUserResponse = payload
    },
    [MutationTypes.SET_USER_ERROR](state, payload) {
        state.userError = payload
    },
    [MutationTypes.SET_ISUSERUPDATED](state, payload) {
        state.isUserUpdated = payload
    },        
    [MutationTypes.SET_ORDERED_CAR](state, payload) {
        state.orderedCar = payload
    }
}
