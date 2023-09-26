import { GetterTree } from 'vuex'
import { State } from './index'
import type { State as RootState } from '@/store'

export type Getters<S = State> = {
}

export const getters: GetterTree<State, RootState> & Getters = {
}
