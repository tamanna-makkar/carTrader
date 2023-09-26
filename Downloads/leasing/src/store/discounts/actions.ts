import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import { userQuery, discountAddRequest, discountDeleteRequest } from '@/types'

export enum DiscountsActionTypes {
  'GET_ALL_DISCOUNTCARS' = 'GET_ALL_DISCOUNTCARS',
  'UPDATE_DISCOUNTS' = 'UPDATE_DISCOUNTS',
  'DELETE_DISCOUNTS' = 'DELETE_DISCOUNTS',
  'RESET_DISCOUNTS' = 'RESET_DISCOUNTS'
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [DiscountsActionTypes.GET_ALL_DISCOUNTCARS]({ commit }: AugmentedActionContext, payload: userQuery): void;
  [DiscountsActionTypes.UPDATE_DISCOUNTS]({ commit }: AugmentedActionContext, payload: { companyId: number; data: discountAddRequest }): void;
  [DiscountsActionTypes.DELETE_DISCOUNTS]({ commit }: AugmentedActionContext, payload: { companyId: number; data: discountDeleteRequest }): void;
  [DiscountsActionTypes.RESET_DISCOUNTS]({ commit }: AugmentedActionContext, payload: { companyId: number }): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [DiscountsActionTypes.GET_ALL_DISCOUNTCARS]({ commit }, data) {
    commit(MutationTypes.SET_LOADER, true)
    const response = await authApi.getCarBrandsDiscount(data.companyId, data.query)
    if (response) commit(MutationTypes.SET_ALL_DISCOUNTCARS, response)
    commit(MutationTypes.SET_LOADER, false)
  },
  async [DiscountsActionTypes.UPDATE_DISCOUNTS]({ commit }, { companyId, data }) {
    commit(MutationTypes.SET_LOADER, true)
    const res = await authApi.addCarDiscount(companyId, data)
    commit(MutationTypes.SET_UPDATE_DISCOUNT_RES, res)
    commit(MutationTypes.SET_LOADER, false)
  },
  async [DiscountsActionTypes.DELETE_DISCOUNTS]({ commit }, { companyId, data }) {
    commit(MutationTypes.SET_LOADER, true)
    const res = await authApi.deleteCarDiscount(companyId, data)
    commit(MutationTypes.SET_UPDATE_DISCOUNT_RES, res)
    commit(MutationTypes.SET_LOADER, false)
  },
  async [DiscountsActionTypes.RESET_DISCOUNTS]({ commit }, { companyId }) {
    commit(MutationTypes.SET_LOADER, true)
    const res = await authApi.resetAllCarDiscount(companyId)
    commit(MutationTypes.SET_UPDATE_DISCOUNT_RES, res)
    commit(MutationTypes.SET_LOADER, false)
  }
}
