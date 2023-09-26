import { ActionContext, ActionTree } from 'vuex'
import { Mutations, AuthMutationTypes } from './mutations'
import { State } from './index'
import { State as RootState } from '@/store'
import authApi from '@/api/Auth'
import noAuthApi from '@/api/noAuth'
import CarPolicy from '@/api/Auth'
import refreshToken from '@/api/refreshToken'
import { VueCookieNext } from 'vue-cookie-next'
import { UserLogInRequest, UserForgetPasswordRequest, getCarPolicyRequest, employeeUserUpdateType, passwordBody, resetPasswordRequest } from '@/types'
import router from '@/router'

export enum AuthActionTypes {
    USER_LOGIN = 'USER_LOGIN',
    FORGET_PASSWORD = 'FORGET_PASSWORD',
    GET_CURRENT_USER_DETAILS = 'GET_CURRENT_USER_DETAILS',
    GET_CARPOLICY_BY_ID = 'GET_CARPOLICY_BY_ID',
    UPDATE_USER = 'UPDATE_USER',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    UPDATE_PASSWORD = 'UPDATE_PASSWORD',
    RESET_PASSWORD = 'RESET_PASSWORD'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [AuthActionTypes.USER_LOGIN]({ commit }: AugmentedActionContext, payload: UserLogInRequest): void;
    [AuthActionTypes.FORGET_PASSWORD]({ commit }: AugmentedActionContext, payload: { lang: string; body: UserForgetPasswordRequest }): void;
    [AuthActionTypes.GET_CURRENT_USER_DETAILS]({ commit }: AugmentedActionContext, payload: void): void;
    [AuthActionTypes.GET_CARPOLICY_BY_ID]({ commit }: AugmentedActionContext, payload: getCarPolicyRequest): void;
    [AuthActionTypes.UPDATE_USER]({ commit }: AugmentedActionContext, payload: { companyId: number; userId: number; body: employeeUserUpdateType }): void;
    [AuthActionTypes.REFRESH_TOKEN]({ commit }: AugmentedActionContext, payload: { refreshToken: string }): void;
    [AuthActionTypes.UPDATE_PASSWORD]({ commit }: AugmentedActionContext, payload: { body: passwordBody; id: number }): void;
    [AuthActionTypes.RESET_PASSWORD]({ commit }: AugmentedActionContext, payload: resetPasswordRequest): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [AuthActionTypes.USER_LOGIN]({ commit, dispatch }, body) {
        commit(AuthMutationTypes.SET_LOADER, true)
        await noAuthApi.postUserLogIn(body).then(async (res) => {
            commit(AuthMutationTypes.SET_ACCESS_TOKEN, res['token'])
            sessionStorage.setItem('isLoggedIn', 'true')
            await dispatch(AuthActionTypes.GET_CURRENT_USER_DETAILS)
            router.push({ name: 'Dashboard' })
        }).catch((e) => {
            if (e.response && (e.response.data.message == 'Invalid credentials.' || e.response.data.message == 'Your user account no longer exists.')) {
                commit(AuthMutationTypes.SET_ERROR, e.response.data.message)
            }
        })
        commit(AuthMutationTypes.SET_LOADER, false)
    },
    async [AuthActionTypes.REFRESH_TOKEN]({ commit, dispatch }) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const res = await refreshToken.refreshToken()
        commit(AuthMutationTypes.SET_ACCESS_TOKEN, res.token)
        await dispatch(AuthActionTypes.GET_CURRENT_USER_DETAILS)
        commit(AuthMutationTypes.SET_LOADER, false)
    },
    async [AuthActionTypes.FORGET_PASSWORD]({ commit }, data) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const res = await noAuthApi.forgetPassword(data.lang, data.body)
        if (res.status == 'success' || (res.status == 'warning' && res.userResponse == 'Valid user not found.'))
            commit(AuthMutationTypes.SET_RESETSUCCESS, true)
        commit(AuthMutationTypes.SET_LOADER, false)
    },
    async [AuthActionTypes.GET_CURRENT_USER_DETAILS]({ commit }) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const res = await authApi.getCurrentUSer()
        if (res && res.userResponse) {
            commit(AuthMutationTypes.SET_USER, res.userResponse[0])
        }
        if (res) {
            VueCookieNext.setCookie("companyId", JSON.stringify(res.userResponse[0].company['id']), {
                expire: '24h',
                path: '/',
                domain: '',
                secure: '',
                sameSite: '',
            })
            VueCookieNext.setCookie("roles", JSON.stringify(res.userResponse[0].roles), {
                expire: '24h',
                path: '/',
                domain: '',
                secure: '',
                sameSite: '',
            })
            VueCookieNext.setCookie("status", res.userResponse[0].userStatus, {
                expire: '24h',
                path: '/',
                domain: '',
                secure: '',
                sameSite: '',
            })
            if (res.userResponse[0].carPolicy) {
                const carPolicyFuelTypes = res.userResponse[0].carPolicy.fuelType.map((e) => e.title)
                const commonFuelTypes = carPolicyFuelTypes.filter(element => res.userResponse[0].allowedFuelType.includes(element))
                sessionStorage.setItem('car_policy_fuel_type', JSON.stringify(commonFuelTypes))


                if (commonFuelTypes.includes('electric')) {
                    const electricRange = res.userResponse[0].carPolicy['fuelType'].find(x => x.title === 'electric')
                    if (electricRange) {
                        sessionStorage.setItem('car_policy_electric_range', JSON.stringify(electricRange?.distance))
                    }
                } else {
                    sessionStorage.removeItem('car_policy_electric_range')
                }
                if (commonFuelTypes.includes('plug_in_hybrid')) {
                    const plugInHybridRange = res.userResponse[0].carPolicy['fuelType'].find(x => x.title === 'plug_in_hybrid')
                    if (plugInHybridRange)
                        sessionStorage.setItem('car_policy_plug-in-hybrid_range', JSON.stringify(plugInHybridRange?.distance))
                } else {
                    sessionStorage.removeItem('car_policy_plug-in-hybrid_range')
                }
                if (res.userResponse[0]['carPolicy']['carBrandsAndModels'].length) {
                    sessionStorage.setItem('car_policy_brands_models', JSON.stringify(res.userResponse[0]['carPolicy']['carBrandsAndModels']))
                    commit(AuthMutationTypes.SET_CARPOLICYBRANDSMODELS, res.userResponse[0]['carPolicy']['carBrandsAndModels'])
                } else {
                    sessionStorage.removeItem('car_policy_brands_models')
                }

                sessionStorage.setItem('car_policy_doors', JSON.stringify(res.userResponse[0].carPolicy.amountOfDoors))
                sessionStorage.setItem('car_policy_body_type', JSON.stringify(res.userResponse[0].carPolicy.carBodyType))
                VueCookieNext.setCookie("employeeCarPolicyId", JSON.stringify(res.userResponse[0].carPolicy['id']), {
                    expire: '24h',
                    path: '/',
                    domain: '',
                    secure: '',
                    sameSite: '',
                })
            }
        }
        commit(AuthMutationTypes.SET_LOADER, false)
    },
    async [AuthActionTypes.GET_CARPOLICY_BY_ID]({ commit }, body) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const carPolicyByIdRes = await CarPolicy.getCarPolicyById({ companyId: body['companyId'], carPolicyId: body['carPolicyId'] })
        if (carPolicyByIdRes) {
            commit(AuthMutationTypes.SET_CARPOLICYBYID, carPolicyByIdRes.carPolicyResponse)
        }
        commit(AuthMutationTypes.SET_LOADER, false)
    },
    async [AuthActionTypes.UPDATE_USER]({ commit }, data) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const newObj = data.body
        if(data.body.incomeTax && typeof data.body.incomeTax == 'object') {
            Object.assign({}, newObj.incomeTax, newObj.incomeTax['id'])
        }
        const res = await authApi.updateUserById(data.companyId, data.userId, newObj)
        if (res.status == 'success') {
            commit(AuthMutationTypes.UPDATE_USER, data.body)
        }
        commit(AuthMutationTypes.SET_LOADER, false)
    },    
    async [AuthActionTypes.UPDATE_PASSWORD]({ commit }, payload) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const res = await authApi.updatePassword(payload.id, payload.body)
        if (res.status == 'success') {
            commit(AuthMutationTypes.SET_PASSWORD_ERRORS, [])
        } else {
            if (Array.isArray(res.userResponse)) {
                commit(AuthMutationTypes.SET_PASSWORD_ERRORS, res.userResponse)
            } else {
                commit(AuthMutationTypes.SET_PASSWORD_ERRORS, [res.userResponse])
            }
        }
        commit(AuthMutationTypes.SET_LOADER, false)
        return res
    },
    async [AuthActionTypes.RESET_PASSWORD]({ commit }, payload) {
        commit(AuthMutationTypes.SET_LOADER, true)
        const res = await noAuthApi.resetPassword(payload)
        if (res.status == 'success') {
           router.push({ name: 'login' })
        } else if (res.status == 'error') {
           commit(AuthMutationTypes.SET_RESET_PASSWORD_ERROR, res.userResponse) 
        }
        commit(AuthMutationTypes.SET_LOADER, false)
    },
}

