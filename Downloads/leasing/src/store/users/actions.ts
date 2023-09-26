import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import { userQuery, employeeUserResponseType } from '@/types'
import router from '@/router'
import authApi from '@/api/Auth'

export enum UsersActionTypes {
    GET_ALLUSERS = 'GET_ALLUSERS',
    ADD_USER = 'ADD_USER',
    GET_USERBYID = 'GET_USERBYID',
    UPDATE_USERBYID = 'UPDATE_USERBYID',
    DELETE_USERBYID = 'DELETE_USERBYID',
    RESTORE_USERBYID = 'RESTORE_USERBYID'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [UsersActionTypes.GET_ALLUSERS]({ commit }: AugmentedActionContext, payload: userQuery ): void;
    [UsersActionTypes.ADD_USER]({ commit }: AugmentedActionContext, payload: { companyId: number; body: employeeUserResponseType; lang: string }): void;
    [UsersActionTypes.GET_USERBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; userId: number }): void;
    [UsersActionTypes.UPDATE_USERBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; userId: number; body: employeeUserResponseType }): void;
    [UsersActionTypes.DELETE_USERBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; userId: number }): void;
    [UsersActionTypes.RESTORE_USERBYID]({ commit }: AugmentedActionContext, payload: { companyId: number; userId: number }): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [UsersActionTypes.GET_ALLUSERS]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.getAllUsers(data.companyId, data.query)
        if (res)
            commit(MutationTypes.SET_ALLUSERS, res.userResponse)
            commit(MutationTypes.SET_TOTALUSERS, res.totalRecords)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [UsersActionTypes.ADD_USER]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.addUser(data.companyId, data.body, data.lang)
        if (res.status == 'success') {
            router.push({ name: 'Employees', query: { page: 1 } })
        } else if (res.status != 'success') {
            commit(MutationTypes.SET_USER_ERROR, res.userResponse)
        } 
        commit(MutationTypes.SET_LOADER, false)
    },
    async [UsersActionTypes.GET_USERBYID]({ commit }, data) {
        commit(MutationTypes.SET_USERBYIDLOADER, true)
        const res = await authApi.getUserById(data.companyId, data.userId)
        commit(MutationTypes.SET_ORDERED_CAR, res.userResponse[0]['carOrders'])
        commit(MutationTypes.SET_USERBYID, res.userResponse[0])
        commit(MutationTypes.SET_USERBYIDLOADER, false)
    },
    async [UsersActionTypes.UPDATE_USERBYID]({ commit }, data) {
        commit(MutationTypes.SET_USERBYIDLOADER, true)
        const res = await authApi.updateUserById(data.companyId, data.userId, data.body)
        if (res.status == 'success') {
            router.push({ name: 'Employees', query: { page: 1 } })
            commit(MutationTypes.SET_ISUSERUPDATED, true)
        } else if (res.status != 'success') {
            commit(MutationTypes.SET_USER_ERROR, res.userResponse)
        }
        commit(MutationTypes.SET_USERBYIDLOADER, false)
    },
    async [UsersActionTypes.DELETE_USERBYID]({ commit }, data) {
        commit(MutationTypes.SET_USERBYIDLOADER, true)
        const res = await authApi.deleteUserById(data.companyId, data.userId)
        if (res.status == 'success') {
            router.push({ name: 'Employees', query: { page: 1 } })
        } else if (res.status == 'warning' || res.status == 'error') {
            commit(MutationTypes.SET_DELETEUSERBYIDRESPONSE, res.userResponse)
        }
        commit(MutationTypes.SET_USERBYIDLOADER, false)
    },
    async [UsersActionTypes.RESTORE_USERBYID]({ commit }, data) {
        commit(MutationTypes.SET_USERBYIDLOADER, true)
        const res  = await authApi.restoreUserById(data.companyId,  data.userId)
        if (res.status == 'success') {
            router.push({ name: 'Employees', query: { page: 1 } })
        } else if (res.status == 'warning' || res.status == 'error') {
            commit(MutationTypes.SET_DELETEUSERBYIDRESPONSE, res.userResponse)
        }
        commit(MutationTypes.SET_USERBYIDLOADER, false)
    }
}

