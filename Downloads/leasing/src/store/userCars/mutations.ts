import { savedCarsType, carOrderDetails } from '@/types'
import { MutationTree } from 'vuex'
import { State } from './index'

export enum MutationTypes {
  SET_SAVEDCARSRESPONSE = 'SET_SAVEDCARSRESPONSE',
  DELETE_SAVED_CARS = 'DELETE_SAVED_CARS',
  SET_LOADER = 'SET_LOADER',
  SET_COMPARE_CARS = 'SET_COMPARE_CARS',
  SET_SAVED_CARS_IDS = 'SET_SAVED_CARS_IDS',
  SET_SAVED_CARS = 'SET_SAVED_CARS'
}

export type Mutations<S = State> = {
  [MutationTypes.SET_SAVEDCARSRESPONSE](state: S, payload: savedCarsType[]): void;
  [MutationTypes.SET_COMPARE_CARS](state: S, payload: carOrderDetails[]): void;
  [MutationTypes.SET_LOADER](state: S, payload: boolean): void;
  [MutationTypes.DELETE_SAVED_CARS](state: S, payload: number[]): void;
  [MutationTypes.SET_SAVED_CARS_IDS](state: S, payload: string[]): void;
  [MutationTypes.SET_SAVED_CARS](state: S, payload: savedCarsType[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_SAVEDCARSRESPONSE](state, payload) {
    const savedCars = payload
    state.userCars = savedCars.filter((e) => e.vehicleDetails)
  },
  [MutationTypes.SET_SAVED_CARS](state, payload) {
    const savedCars = payload
    state.savedCars = savedCars.filter((e) => e.vehicleDetails)
    const saveCarIds = state.savedCars.map((e) => {
      return e.vehicleDetails && e.vehicleDetails.unique_identity_101
    })
    state.savedCarsIds = saveCarIds
  },
  [MutationTypes.SET_COMPARE_CARS](state, payload) {
    state.compareCarsData = []
    payload.map((e) => {
      if (e.status == 'success') {
        state.compareCarsStatus = e.status
        state.compareCarsData.push(e.carOrderResponse)
      } else {
        state.compareCarsStatus = state.compareCarsStatus ? state.compareCarsStatus : e.status
      }
    })
  },
  [MutationTypes.DELETE_SAVED_CARS](state, payload) {
    payload.forEach((e: number) => {
      const savedCarIndex = state.savedCars.findIndex((savedCar) => savedCar.id == e)
      if (savedCarIndex !== -1) {
        state.savedCars.splice(savedCarIndex, 1)
        state.savedCarsIds = state.savedCars.map((e) => e.vehicleDetails.unique_identity_101)
      }
      const allCarIndex = state.userCars.findIndex((savedCar) => savedCar.id == e)
      if (allCarIndex !== -1) {
        state.userCars.splice(allCarIndex, 1)
      }

    })
  },
  [MutationTypes.SET_LOADER](state, payload) {
    state.loader = payload
  },
  [MutationTypes.SET_SAVED_CARS_IDS](state, payload) {
    state.savedCarsIds = payload
  }
}
