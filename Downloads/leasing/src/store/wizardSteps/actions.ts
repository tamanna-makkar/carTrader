import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import seachApi from '@/api/Auth'
import { wizardStepsRequest } from '@/types'

export enum ActionTypes {
    'POST_WIZARDSTEPS' = 'POST_WIZARDSTEPS'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [ActionTypes.POST_WIZARDSTEPS]({ commit }: AugmentedActionContext, payload: wizardStepsRequest): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [ActionTypes.POST_WIZARDSTEPS]({ commit }, data) {
        commit(MutationTypes.SET_WIZARDS_LOADER, true)
        const res = await seachApi.postWizardSteps(data)
        commit(MutationTypes.SET_WIZARDS_RESULTS, res.response.hits.hits)
        commit(MutationTypes.SET_WIZARDS_LOADER, false)
    }
}

