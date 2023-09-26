import { ActionContext, ActionTree } from 'vuex'
import { Mutations, carPolicyMutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import router from '@/router'
import { carPolicyAddRequest, getCarPolicyRequest, carPolicyUpdateRequest, carPolicyDeleteRequest } from '@/types'

export enum carPolicyActionTypes {
    ADD_CARPOLICY = 'ADD_CARPOLICY',
    GET_ALLPOLICIES = 'GET_ALLPOLICIES',
    UPDATE_CARPOLICY = 'UPDATE_CARPOLICY',
    DELETE_CARPOLICYDOCUMENT = 'DELETE_CARPOLICYDOCUMENT',
    DOWNLOAD_CARPOLICYDOCUMENT = 'DOWNLOAD_CARPOLICYDOCUMENT',
    DELETE_CARPOLICY = 'DELETE_CARPOLICY',
    GET_CAR_COLORS = 'GET_CAR_COLORS'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [carPolicyActionTypes.ADD_CARPOLICY]({ commit }: AugmentedActionContext, payload: carPolicyAddRequest): void;
    [carPolicyActionTypes.GET_ALLPOLICIES]({ commit }: AugmentedActionContext, payload: getCarPolicyRequest): void;
    [carPolicyActionTypes.UPDATE_CARPOLICY]({ commit }: AugmentedActionContext, payload: carPolicyUpdateRequest): void;
    [carPolicyActionTypes.DELETE_CARPOLICYDOCUMENT]({ commit }: AugmentedActionContext, payload: carPolicyDeleteRequest): void;
    [carPolicyActionTypes.DOWNLOAD_CARPOLICYDOCUMENT]({ commit }: AugmentedActionContext, payload: carPolicyDeleteRequest): void;
    [carPolicyActionTypes.DELETE_CARPOLICY]({ commit }: AugmentedActionContext, payload: carPolicyDeleteRequest): void;
    [carPolicyActionTypes.GET_CAR_COLORS]({ commit }: AugmentedActionContext ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [carPolicyActionTypes.ADD_CARPOLICY]({ commit }, carPolicy) {
        commit(carPolicyMutationTypes.SET_LOADER, true)
        const res = await authApi.carPolicyAdd(carPolicy.companyId, carPolicy.data)
        if (res.status == 'success') {
           router.push({ name: 'CarPolicyOverview' })
        } else if (res.status == 'error' && res.documentResponse) {
            commit(carPolicyMutationTypes.SET_DOCUMENT_RESPONSE, res.documentResponse)
        }
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
    async [carPolicyActionTypes.GET_ALLPOLICIES]({ commit }, data) {
        commit(carPolicyMutationTypes.SET_LOADER, true)
        const res = await authApi.getAllCarPolicies(data.companyId)
        commit(carPolicyMutationTypes.SET_ALLPOLICIES, res?.carPolicyResponse)
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
    async [carPolicyActionTypes.UPDATE_CARPOLICY]({ commit }, carPolicy) {
        commit(carPolicyMutationTypes.SET_LOADER, true)
        const res = await authApi.carPolicyUpdate(carPolicy.companyId, carPolicy.carPolicyId, carPolicy.data)
        if (res.status == 'success') {
            router.push({ name: 'CarPolicyOverview' })
        } else if (res.status == 'error' && res.documentResponse) {
            commit(carPolicyMutationTypes.SET_DOCUMENT_RESPONSE, res.documentResponse)
        }
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
    async [carPolicyActionTypes.DELETE_CARPOLICYDOCUMENT]({ commit }, carPolicy) {
        await authApi.deleteCarPolicyDocument(carPolicy.companyId, carPolicy.carPolicyId)
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
    async [carPolicyActionTypes.DOWNLOAD_CARPOLICYDOCUMENT]({ commit }, carPolicy) {
        const res = await authApi.downloadCarPolicyDocument(carPolicy.companyId, carPolicy.carPolicyId)
        const FILE = await window.URL.createObjectURL(new Blob([res]));
        const docUrl = document.createElement('a');
        docUrl.href = FILE;
        docUrl.setAttribute('download', 'document.pdf');
        document.body.appendChild(docUrl);
        docUrl.click();
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
    async [carPolicyActionTypes.DELETE_CARPOLICY]({ commit }, carPolicy) {
        commit(carPolicyMutationTypes.SET_LOADER, true)
        const res = await authApi.deleteCarPolicy(carPolicy.companyId, carPolicy.carPolicyId)
        if (res.carPolicyResponse == 'Car Policy deleted') {
            router.push({ name: 'CarPolicyOverview' })
        } else if (res.carPolicyResponse == 'Cannot delete because there are users specified with this Car Policy') {
            commit(carPolicyMutationTypes.DELETE_CARPOLICYRESPONSE, res.carPolicyResponse)
        }
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
    async [carPolicyActionTypes.GET_CAR_COLORS]({ commit }) {
        commit(carPolicyMutationTypes.SET_LOADER, true)
        const res = await authApi.getCarColors()
        commit(carPolicyMutationTypes.SET_CAR_COLORS, res.response)
        commit(carPolicyMutationTypes.SET_LOADER, false)
    },
}

