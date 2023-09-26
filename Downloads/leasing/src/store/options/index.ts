import { getters, Getters } from './getters'
import { mutations, Mutations } from './mutations'
import { actions, Actions, ActionTypes } from './actions'
import { Store as VuexStore, Module, CommitOptions, DispatchOptions } from 'vuex'
import { State as RootState } from '@/store'
import { Options, colorsFlagType, carBrandModelLevelType } from '@/types'
import { requiredChoiceTitlesType, packMembersTitlesType, carBrandsModelType, selectedConfigOptionsType, getCarsByIdType, savedCarsType, netMonthlyCostAndFlagType, OptionsConfigurationResponse } from '@/types'

interface State {
  brands: carBrandsModelType[];
  searchString: string;
  searchModels: string;
  selectedModels: Array<string>;
  searchLevels: string;
  selectedLevels: Array<string>;
  options: Options | undefined;
  showPopUp: boolean;
  toggleOpen: boolean;
  packagesAndOptions: Options;
  optionsloader: boolean;
  requiredChoicesTitles: requiredChoiceTitlesType[];
  packMembersTitles: packMembersTitlesType[];
  carBrandsModels: carBrandsModelType[];
  carBrandsModelsLevels: carBrandModelLevelType[];
  isLoggedIn: boolean;
  complyCarResponse: string[];
  selectedConfigOptions: selectedConfigOptionsType[];
  carsById: getCarsByIdType;
  carOrderDetailsById: savedCarsType;
  carOrderLoader: boolean;
  carOrderSuccess: boolean;
  carOrderPdfError: boolean;
  NetMonthlyCostAndFlag: netMonthlyCostAndFlagType;
  colorsFlag: colorsFlagType;
  allSelectedOptions: Array<string>;
  latestSelection: string[];
  nestedOptions: {};
  leaseRateError: string;
  conflictedOptions: packMembersTitlesType[];
  optionsResponse: OptionsConfigurationResponse[];
  optionsResponseAsObject: {};
  vehicleId: number;
}

const state: State = {
  options: undefined,
  brands: [],
  searchString: '',
  searchModels: '',
  searchLevels: '',
  showPopUp: false,
  toggleOpen: false,
  packagesAndOptions: {} as Options,
  optionsloader: false,
  requiredChoicesTitles: [],
  packMembersTitles: [],
  carBrandsModels: [],
  carBrandsModelsLevels: [],
  isLoggedIn: true,
  complyCarResponse: [],
  selectedConfigOptions: [],
  carsById: {} as getCarsByIdType,
  carOrderDetailsById: {} as savedCarsType,
  carOrderLoader: false,
  carOrderSuccess: false,
  carOrderPdfError: false,
  NetMonthlyCostAndFlag: {} as netMonthlyCostAndFlagType,
  colorsFlag: {
    interior: false, exterior: false
  },
  allSelectedOptions: [],
  latestSelection: [],
  nestedOptions: JSON.parse(sessionStorage.getItem('nestedOptions')) || {},
  selectedModels: [],
  selectedLevels: [],
  leaseRateError: '',
  conflictedOptions: [],
  optionsResponse: [],
  optionsResponseAsObject: {},
  vehicleId: null
}

const user: Module<State, RootState> = {
  state,
  mutations,
  actions,
  getters
}

export { State, ActionTypes, Store }
export default user

type Store<S = State> = Omit<VuexStore<S>, 'commit' | 'getters' | 'dispatch'> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
}
