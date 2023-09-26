import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import options, { State as OptionsState, Store as OptionsStore } from './options'
import carPolicy, { State as CarPolicyState, Store as CarPolicyStore } from './carPolicy'
import wizardSteps, { State as WizardStepsState, Store as WizardStepsStore } from './wizardSteps'
import auth, { State as authState, Store as authStore } from './auth'
import users, { State as usersState, Store as usersStore } from './users'
import leaseCategories, { State as leaseCategoryState, Store as leaseCategoriesStore } from './leaseCategories'
import userCars, { State as userCarsState, Store as userCarsStore } from './userCars'
import company, { State as companyState, Store as companyStore } from './company' 
import superAdminCompany, { State as superAdminCompanyState, Store as superAdminCompanyStore } from './superAdminCompany' 
import taxSettings, { State as taxSettingsState, Store as taxSettingsStore } from './taxSettings'
import discounts, { State as discountState, Store as discountStore } from './discounts'
import orders, { State as ordersState, Store as ordersStore } from './orders'


export interface State {
  options: OptionsState;
  carPolicy: CarPolicyState;
  wizardSteps: WizardStepsState;
  auth: authState;
  users: usersState;
  leaseCategories: leaseCategoryState;
  userCars: userCarsState;
  company: companyState;
  superAdminCompany: superAdminCompanyState;
  taxSettings: taxSettingsState;
  discounts: discountState;
  orders: ordersState;
}

export type RootStore = OptionsStore<Pick<State, 'options'>>
export type RootStoreCarPolicy = CarPolicyStore<Pick<State, 'options'>>
export type RootStoreWizardSteps = WizardStepsStore<Pick<State, 'options'>>
export type RootStoreAuth = authStore<Pick<State, 'options'>>
export type RootStoreUsers = usersStore<Pick<State, 'options'>>
export type RootStoreLeaseCategories = leaseCategoriesStore<Pick<State, 'options'>>
export type RootUserCarsStore = userCarsStore<Pick<State, 'options'>>
export type RootCompanyStore = companyStore<Pick<State, 'options'>>
export type RootsuperAdminCompanyStore = superAdminCompanyStore<Pick<State, 'options'>>
export type RoottaxSettingsStore = taxSettingsStore<Pick<State, 'options'>>
export type RootdiscountStore = discountStore<Pick<State, 'options'>>
export type RootordersStore = ordersStore<Pick<State, 'options'>>


export const key: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore<State>({
  modules: {
    options,
    carPolicy,
    wizardSteps,
    auth,
    users,
    leaseCategories,
    userCars,
    company,
    superAdminCompany,
    taxSettings,
    discounts,
    orders
  }
})

export function useStore() {
  return baseUseStore(key)
}