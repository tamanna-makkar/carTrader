import { GetterTree } from 'vuex'
import { State } from './index'
import type { State as RootState } from '@/store'
import { carBrandModelLevelType } from '@/types'

export type Getters<S = State> = {
    filteredBrands(state: S): Array<carBrandModelLevelType>;
}

export const getters: GetterTree<State, RootState> & Getters = {
    filteredBrands: (state) => {
        let filteredBrands = sessionStorage.getItem('car_policy_brands_models') ? JSON.parse(sessionStorage.getItem('car_policy_brands_models') || '[]') : state.carBrandsModelsLevels
        if (state.searchString.length > 0) {
            filteredBrands = filteredBrands.filter(
                brand => brand.brand.toLowerCase().indexOf(state.searchString.toLowerCase()) !== -1 || brand.brand.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(state.searchString.toLowerCase()) !== -1
            )
        }
        return filteredBrands
    },
    filteredModels: (state) => {
        let selectedModels = state.selectedModels
        if (state.searchModels.length > 0) {
            selectedModels = selectedModels.filter(
                item => item.toLowerCase().indexOf(state.searchModels.toLowerCase()) !== -1 || item.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(state.searchModels.toLowerCase()) !== -1
            )
        }
        return selectedModels
    },
    filteredLevels: (state) => {
        let selectedLevels = state.selectedLevels
        if (state.searchLevels.length > 0) {
            selectedLevels = selectedLevels.filter(
                item => item.toLowerCase().indexOf(state.searchLevels.toLowerCase()) !== -1 || item.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(state.searchModels.toLowerCase()) !== -1
            )
        }
        return selectedLevels
    }
}
