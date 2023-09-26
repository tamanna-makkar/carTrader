import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import { taxSettingsAddRequest } from '@/types'

export enum taxSettingsActionTypes {
    'POST_TAXSETTINGS' = 'POST_TAXSETTINGS',
    'GET_TAXSETTINGS' = 'GET_TAXSETTINGS',
    'DELETE_TAXSETTINGS' = 'DELETE_TAXSETTINGS'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [taxSettingsActionTypes.POST_TAXSETTINGS]({ commit }: AugmentedActionContext, payload: taxSettingsAddRequest): void;
    [taxSettingsActionTypes.GET_TAXSETTINGS]({ commit }: AugmentedActionContext, payload: { year: number }): void;
    [taxSettingsActionTypes.DELETE_TAXSETTINGS]({ commit }: AugmentedActionContext, payload: { year: number }): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [taxSettingsActionTypes.POST_TAXSETTINGS]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.taxSettingsAdd(data)
        if (res.status != 'success') {
            if (typeof res.taxSettingsResponse !== 'string') {
                const errorArr = []
                Object.keys(res.taxSettingsResponse).forEach(key => {
                    if (res.taxSettingsResponse[key].length > 0) {
                        errorArr.push(res.taxSettingsResponse[key][0])
                    }
                    commit(MutationTypes.SET_TAXSETTINGS_ERROR, errorArr)
                })
            } else {
                commit(MutationTypes.SET_TAXSETTINGS_ERROR, res.taxSettingsResponse)
            }
        } else if (res.taxSettingsResponse['bpmTaxSettings'][0]['message'] == 'Settings BPM added' && res.taxSettingsResponse['dieselSurtaxSettings'][0]['message'] == 'Settings Diesel Surtax added' && res.taxSettingsResponse['fiscalTaxSettings'][0]['message'] == 'Settings Fiscal Tax added' && res.taxSettingsResponse['incomeTaxSettings'][0]['message'] == 'Settings Income Tax added') {
            commit(MutationTypes.SET_ADDTAXSETTINGSSUCESS, true)
        }
        commit(MutationTypes.SET_LOADER, false)
    },
    async [taxSettingsActionTypes.GET_TAXSETTINGS]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        const res = await authApi.getTaxSettingsByYear(data.year)
        commit(MutationTypes.SET_TAXSETTINGS, res)
        commit(MutationTypes.SET_LOADER, false)
    },
    async [taxSettingsActionTypes.DELETE_TAXSETTINGS]({ commit }, data) {
        commit(MutationTypes.SET_LOADER, true)
        await authApi.taxSettingsDelete(data.year)
        commit(MutationTypes.SET_LOADER, false)
    }
}