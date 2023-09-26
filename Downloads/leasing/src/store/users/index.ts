import { getters, Getters } from './getters'
import { mutations, Mutations } from './mutations'
import { actions, Actions, UsersActionTypes } from './actions'
import { Store as VuexStore, Module, CommitOptions, DispatchOptions } from 'vuex'
import type { State as RootState } from '@/store'
import { employeeUserResponseType, orderedCarType } from '@/types'

interface State {
  loader: boolean;
  getAllUsers: employeeUserResponseType[] | string;
  totalUsers: number;
  userById: employeeUserResponseType;
  userByIdLoader: boolean; 
  deleteUserResponse: string;
  userError: string;
  isUserUpdated: boolean;
  orderedCar: orderedCarType;
}

const state: State = {
  loader: false,
  getAllUsers: [] || '',
  totalUsers: 0,
  userById: {} as employeeUserResponseType,
  userByIdLoader: false,
  deleteUserResponse: '',
  userError: '',
  isUserUpdated: false,
  orderedCar: {} as orderedCarType,
}

const user: Module<State, RootState> = {
  state,
  mutations,
  actions,
  getters
}

export { State, UsersActionTypes, Store }
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
