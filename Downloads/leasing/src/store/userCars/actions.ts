import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { MutationTypes as OptionsMutationsTypes } from '../options/mutations'
import { State } from './index'
import type { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import { carOrderBody, savedCarsType, userQueryType } from '@/types'
import { VueCookieNext } from 'vue-cookie-next'
import { store } from '@/store'
export enum ActionTypes {
  GET_ALLSAVEDCARS = 'GET_ALLSAVEDCARS',
  GET_CAR_ORDER_DETAILS = 'GET_CAR_ORDER_DETAILS',
  DELETE_SAVED_CAR = 'DELETE_SAVED_CAR',
  SAVE_CAR_ORDER = 'SAVE_CAR_ORDER'

}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>


export interface Actions {
  [ActionTypes.GET_ALLSAVEDCARS]({ commit }: AugmentedActionContext, payload: userQueryType): void;
  [ActionTypes.GET_CAR_ORDER_DETAILS]({ commit }: AugmentedActionContext, payload: number[]): void;
  [ActionTypes.DELETE_SAVED_CAR]({ commit }: AugmentedActionContext, payload: number[]): void;
  [ActionTypes.SAVE_CAR_ORDER]({ commit }: AugmentedActionContext, payload: carOrderBody): void;
}

export const actions: ActionTree<State, RootState> & Actions = {

  async [ActionTypes.GET_ALLSAVEDCARS]({ commit }, params ) {
    commit(MutationTypes.SET_LOADER, true)
    const res = await authApi.getAllSavedCars(params)
    if (typeof res.carOrderResponse !== 'string' && res.carOrderResponse && res.carOrderResponse.length > 0) {
      const newArr = res.carOrderResponse.filter((e: savedCarsType) => {
        if (e && e.id) {
          return e
        }
      })
      commit(MutationTypes.SET_SAVEDCARSRESPONSE, newArr)
      commit(MutationTypes.SET_SAVED_CARS, newArr)
    }
    commit(MutationTypes.SET_LOADER, false)
  },

  async [ActionTypes.GET_CAR_ORDER_DETAILS]({ commit }, payload) {
    commit(MutationTypes.SET_LOADER, true)
    const allCarsPromise = payload.map(async (e) => {
      return authApi.getCarOrderDetails(e)
    })
    const allCarsResponse = await Promise.all(allCarsPromise)
    allCarsResponse.map((e) => {
      return e.carOrderResponse
    })
    commit(MutationTypes.SET_COMPARE_CARS, allCarsResponse)
    commit(MutationTypes.SET_LOADER, false)
  },

  async [ActionTypes.SAVE_CAR_ORDER]({ commit, state }, payload) {
    commit(MutationTypes.SET_LOADER, true)
    try {
      const vehicleIdWithoutYear = payload.vehicleId.toString().substring(0, payload.vehicleId.toString().length - 8)
      const savedCarsIds = [...state.savedCarsIds]
      savedCarsIds.push(vehicleIdWithoutYear)
      commit(MutationTypes.SET_SAVED_CARS_IDS, savedCarsIds)
      const res = await authApi.saveCarOrder(payload)
      commit(MutationTypes.SET_LOADER, false)
      let complyResponse: string[] = []
      //Manually adding message when expensiveFlag = true  
      if (res.complyCarResponse && res.complyCarResponse.expensiveFlag) {
        complyResponse.push('Car is too expensive')
      }
      // Adding error messages to the array to show popup
      if (res.complyCarResponse && res.complyCarResponse.complyErrors && res.complyCarResponse.complyErrors.length > 0) {
        complyResponse = [...complyResponse, ...res.complyCarResponse.complyErrors]
      }

      store.commit(OptionsMutationsTypes.SET_COMPLYCARRESPONSE, complyResponse)
      if (res.status == 'success') {
        const savedCars = [...state.userCars]
        savedCars.push(res.carOrderResponse)
        commit(MutationTypes.SET_SAVEDCARSRESPONSE, savedCars)
        commit(MutationTypes.SET_SAVED_CARS, savedCars)
        VueCookieNext.setCookie("latestcarOrderId", JSON.stringify(res.carOrderResponse.id))
      } else {
        const addedCarIndex = state.savedCarsIds.findIndex((e) => e === vehicleIdWithoutYear)
        if (addedCarIndex !== -1) {
          const savedCarsIds: string[] = [...state.savedCarsIds]
          savedCarsIds.splice(addedCarIndex, 1)
          savedCarsIds
          commit(MutationTypes.SET_SAVED_CARS_IDS, savedCarsIds)
        }
      }

      return res
    } catch (error) {
      commit(MutationTypes.SET_LOADER, false)
    }
  },


  async [ActionTypes.DELETE_SAVED_CAR]({ commit }, payload) {
    commit(MutationTypes.SET_LOADER, true)
    const allCarsPromise = payload.map(async (e) => {
      return authApi.deleteSavedOrderCar(e)
    })
    Promise.all(allCarsPromise)
    commit(MutationTypes.DELETE_SAVED_CARS, payload)
    commit(MutationTypes.SET_LOADER, false)
  }

}

