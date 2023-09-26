import { getters, Getters } from './getters'
import { mutations, Mutations } from './mutations'
import { actions, Actions, CompanyActionTypes } from './actions'
import { Store as VuexStore, Module, CommitOptions, DispatchOptions } from 'vuex'
import type { State as RootState } from '@/store'
import { companyResponseType } from '@/types'

interface State {
  loader: boolean;
  getCompanyById: companyResponseType;
  isCompanyUpdated: boolean;
  logoError: string;
}

const state: State = {
  loader: false,
  getCompanyById: {} as companyResponseType,
  isCompanyUpdated: false,
  logoError: '',
}

const user: Module<State, RootState> = {
  state,
  mutations,
  actions,
  getters
}

export { State, CompanyActionTypes, Store }
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
