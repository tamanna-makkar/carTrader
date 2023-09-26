import { MutationTree } from 'vuex'
import { State } from './index'
import { Options, requiredChoiceTitlesType, packMembersTitlesType, carBrandsModelType, carBrandModelLevelType, selectedConfigOptionsType, getCarsByIdType, savedCarsType, netMonthlyCostAndFlagType, colorsFlagType, OptionsConfigurationResponse } from '@/types'

export enum MutationTypes {
    SET_POPUP = 'SET_POPUP',
    TOGGLE_HAMBURGER = 'TOGGLE_HAMBURGER',
    CLOSE_HAMBURGER = 'CLOSE_HAMBURGER',
    SET_OPTIONS = 'SET_OPTIONS',
    SET_PACKAGESANDOPTIONS = 'SET_PACKAGESANDOPTIONS',
    SET_OPTIONS_LOADER = 'SET_OPTIONS_LOADER',
    SET_SEARCH_STRING = 'SET_SEARCH_STRING',
    SET_REQUIRED_CHOICES_TITLES = 'SET_REQUIRED_CHOICES_TITLES',
    SET_OPTIONS_RESPONSE = 'SET_OPTIONS_RESPONSE',
    SET_PACK_MEMBERS_TITLES = 'SET_PACK_MEMBERS_TITLES',
    SET_CAR_BRANDS_MODELS = 'SET_CAR_BRANDS_MODELS',
    SET_BRANDS_MODELS_LEVELS = 'SET_BRANDS_MODELS_LEVELS',
    SET_BRANDS = 'SET_BRANDS',
    SET_LOGGEDIN = 'SET_LOGGEDIN',
    SET_COMPLYCARRESPONSE = 'SET_COMPLYCARRESPONSE',
    SET_SELECTEDCONFIGOPTIONS = 'SET_SELECTEDCONFIGOPTIONS',
    SET_CARSBYID = 'SET_CARSBYID',
    SET_CARORDERDETAILSBYID = 'SET_CARORDERDETAILSBYID',
    SET_CARORDERLOADER = 'SET_CARORDERLOADER',
    SET_CARORDERSUCCESS = 'SET_CARORDERSUCCESS',
    SET_CARORDERPDFERROR = 'SET_CARORDERPDFERROR',
    SET_NETMONTHLYCOSTANDFLAG = 'SET_NETMONTHLYCOSTANDFLAG',
    SET_COLORS_FLAG = 'SET_COLORS_FLAG',
    SET_ALL_SELECTED_OPTIONS = 'SET_ALL_SELECTED_OPTIONS',
    SET_LATEST_SELECTION = 'SET_LATEST_SELECTION',
    SET_SEARCH_MODELS = 'SET_SEARCH_MODELS',
    SET_SELECTED_MODELS = 'SET_SELECTED_MODELS',
    SET_SEARCH_LEVELS = 'SET_SEARCH_LEVELS',
    SET_SELECTED_LEVELS = 'SET_SELECTED_LEVELS',
    SET_LEASE_RATE_ERROR = 'SET_LEASE_RATE_ERROR',
    SET_OPTIONS_RESPONSE_AS_OBJECT = 'SET_OPTIONS_RESPONSE_AS_OBJECT'
}

export type Mutations<S = State> = {
    [MutationTypes.SET_POPUP](state: S, payload: boolean): void;
    [MutationTypes.TOGGLE_HAMBURGER](state: S, payload: boolean): void;
    [MutationTypes.CLOSE_HAMBURGER](state: S, payload: boolean): void;
    [MutationTypes.SET_OPTIONS](state: S, payload: Options): void;
    [MutationTypes.SET_PACKAGESANDOPTIONS](state: S, payload: Options): void;
    [MutationTypes.SET_OPTIONS_LOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_SEARCH_STRING](state: S, payload: string): void;
    [MutationTypes.SET_REQUIRED_CHOICES_TITLES](state: S, payload: requiredChoiceTitlesType[]): void;
    [MutationTypes.SET_PACK_MEMBERS_TITLES](state: S, payload: packMembersTitlesType[]): void;
    [MutationTypes.SET_CAR_BRANDS_MODELS](state: S, payload: carBrandsModelType[]): void;
    [MutationTypes.SET_BRANDS_MODELS_LEVELS](state: S, payload: carBrandModelLevelType[]): void;
    [MutationTypes.SET_BRANDS](state: S, payload: carBrandsModelType[]): void;
    [MutationTypes.SET_LOGGEDIN](state: S, payload: boolean): void;
    [MutationTypes.SET_COMPLYCARRESPONSE](state: S, payload: string[]): void;
    [MutationTypes.SET_SELECTEDCONFIGOPTIONS](state: S, payload: selectedConfigOptionsType[]): void;
    [MutationTypes.SET_CARSBYID](state: S, payload: getCarsByIdType): void;
    [MutationTypes.SET_CARORDERDETAILSBYID](state: S, payload: savedCarsType): void;
    [MutationTypes.SET_CARORDERLOADER](state: S, payload: boolean): void;
    [MutationTypes.SET_CARORDERSUCCESS](state: S, payload: boolean): void;
    [MutationTypes.SET_CARORDERPDFERROR](state: S, payload: boolean): void;
    [MutationTypes.SET_NETMONTHLYCOSTANDFLAG](state: S, payload: netMonthlyCostAndFlagType): void;
    [MutationTypes.SET_COLORS_FLAG](state: S, payload: colorsFlagType): void;
    [MutationTypes.SET_ALL_SELECTED_OPTIONS](state: S, payload: Array<string>): void;
    [MutationTypes.SET_LATEST_SELECTION](state: S, payload: Array<string>): void;
    [MutationTypes.SET_SEARCH_MODELS](state: S, payload: string): void;
    [MutationTypes.SET_SELECTED_MODELS](state: S, payload: Array<string>): void;
    [MutationTypes.SET_SEARCH_LEVELS](state: S, payload: string): void;
    [MutationTypes.SET_SELECTED_LEVELS](state: S, payload: Array<string>): void;
    [MutationTypes.SET_LEASE_RATE_ERROR](state: S, payload: string): void;
    [MutationTypes.SET_OPTIONS_RESPONSE](state: S, payload: OptionsConfigurationResponse[]): void;
    [MutationTypes.SET_OPTIONS_RESPONSE_AS_OBJECT](state: S, payload: {}): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_OPTIONS](state, payload) {
        state.options = payload
    },
    [MutationTypes.SET_PACKAGESANDOPTIONS](state, payload) {
        state.packagesAndOptions = payload
    },
    [MutationTypes.SET_POPUP](state, payload) {
        state.showPopUp = payload
    },
    [MutationTypes.TOGGLE_HAMBURGER](state) {
        state.toggleOpen = !state.toggleOpen
    },
    [MutationTypes.CLOSE_HAMBURGER](state, payload) {
        state.toggleOpen = payload
    },
    [MutationTypes.SET_OPTIONS_LOADER](state, payload) {
        state.optionsloader = payload
    },
    [MutationTypes.SET_SEARCH_STRING](state, payload) {
        state.searchString = payload
    },
    [MutationTypes.SET_REQUIRED_CHOICES_TITLES](state, paylod) {
        state.requiredChoicesTitles = paylod
    },
    [MutationTypes.SET_PACK_MEMBERS_TITLES](state, payload) {
        state.packMembersTitles = payload
    },
    [MutationTypes.SET_CAR_BRANDS_MODELS](state, payload) {
        state.carBrandsModels = payload
    },
    [MutationTypes.SET_BRANDS_MODELS_LEVELS](state, payload) {
        state.carBrandsModelsLevels = payload
    },
    [MutationTypes.SET_BRANDS](state, payload) {
        state.brands = payload
    },
    [MutationTypes.SET_LOGGEDIN](state, payload) {
        state.isLoggedIn = payload
    },
    [MutationTypes.SET_COMPLYCARRESPONSE](state, payload) {
        state.complyCarResponse = payload
    },
    [MutationTypes.SET_SELECTEDCONFIGOPTIONS](state, payload) {
        state.selectedConfigOptions = payload
    },
    [MutationTypes.SET_CARSBYID](state, payload) {
        state.carsById = payload
    },
    [MutationTypes.SET_CARORDERDETAILSBYID](state, payload) {
        state.carOrderDetailsById = payload
    },
    [MutationTypes.SET_CARORDERLOADER](state, payload) {
        state.carOrderLoader = payload
    },
    [MutationTypes.SET_CARORDERSUCCESS](state, payload) {
        state.carOrderSuccess = payload
    },
    [MutationTypes.SET_CARORDERPDFERROR](state, payload) {
        state.carOrderPdfError = payload
    },
    [MutationTypes.SET_NETMONTHLYCOSTANDFLAG](state, payload) {
        state.NetMonthlyCostAndFlag = payload
    },
    [MutationTypes.SET_COLORS_FLAG](state, payload) {
        state.colorsFlag = payload
    },
    [MutationTypes.SET_ALL_SELECTED_OPTIONS](state, payload) {
        state.allSelectedOptions = payload
    },
    [MutationTypes.SET_LATEST_SELECTION](state, payload) {
        state.latestSelection = payload
    },
    [MutationTypes.SET_SEARCH_MODELS](state, payload) {
        state.searchModels = payload
    },
    [MutationTypes.SET_SELECTED_MODELS](state, payload) {
        state.selectedModels = payload
    },
    [MutationTypes.SET_SEARCH_LEVELS](state, payload) {
        state.searchLevels = payload
    },
    [MutationTypes.SET_SELECTED_LEVELS](state, payload) {
        state.selectedLevels = payload
    },
    [MutationTypes.SET_LEASE_RATE_ERROR](state, payload) {
        state.leaseRateError = payload
    },
    [MutationTypes.SET_OPTIONS_RESPONSE](state, payload) {
        state.optionsResponse = payload
    },
    [MutationTypes.SET_OPTIONS_RESPONSE_AS_OBJECT](state, payload) {
        state.optionsResponseAsObject = payload
    }
}
