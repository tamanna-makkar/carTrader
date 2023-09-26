import { getters, Getters } from './getters'
import { mutations, Mutations } from './mutations'
import { actions, Actions, superAdminCompanyActionTypes } from './actions'
import { Store as VuexStore, Module, CommitOptions, DispatchOptions } from 'vuex'
import type { State as RootState } from '@/store'
import { companyResponseType, companyLeaseRateAdd, leaseRateResponseType } from '@/types'

interface State {
  loader: boolean;
  allCompanies: companyResponseType[];
  totalCompanies: number;
  companyError: string;
  userError: string;
  leaseRateError: string;
  superAdminCompanyId: number;
  companyLeaseRate: companyLeaseRateAdd;
  leaseRateDataResponse: string;
  leaseRateDataLoader: boolean;
  leaseRateDataMessage: Array<string>;
  notInLeaseRateData: leaseRateResponseType;
}

const state: State = {
  loader: false,
  allCompanies: [],
  totalCompanies: 0,
  companyError: '',
  userError: '',
  superAdminCompanyId: null,
  companyLeaseRate: {} as companyLeaseRateAdd,
  leaseRateError: '',
  leaseRateDataResponse: '',
  leaseRateDataLoader: false,
  leaseRateDataMessage: [],
  notInLeaseRateData: {} as leaseRateResponseType
}

const user: Module<State, RootState> = {
  state,
  mutations,
  actions,
  getters
}

export { State, superAdminCompanyActionTypes, Store }
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
