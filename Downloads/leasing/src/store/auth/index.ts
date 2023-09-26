import { getters, Getters } from './getters'
import { mutations, Mutations } from './mutations'
import { actions, Actions, AuthActionTypes } from './actions'
import { Store as VuexStore, Module, CommitOptions, DispatchOptions } from 'vuex'
import type { State as RootState } from '@/store'
import { carBrandsModelType, carPolicyResponseType, currentUserResponseType, employeeUserResponseType } from '@/types'

interface State {
  currentUser: currentUserResponseType | employeeUserResponseType;
  loader: boolean;
  isError: string;
  carPolicyBrandsModels: carBrandsModelType[];
  carPolicyByID: carPolicyResponseType;
  showResetSuccess: boolean;
  passwordErrors: string[];
  accessToken: string;
  resetPasswordError: string;
}

const state: State = {
  currentUser: {} as currentUserResponseType,
  loader: false,
  isError: '',
  carPolicyBrandsModels: [],
  carPolicyByID: {} as carPolicyResponseType,
  showResetSuccess: false,
  passwordErrors: [],
  accessToken: '',
  resetPasswordError: '',
}

const user: Module<State, RootState> = {
  state,
  mutations,
  actions,
  getters
}

export { State, AuthActionTypes, Store }
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
