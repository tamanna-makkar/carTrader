import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationTypes } from './mutations'
import { State } from './index'
import { State as RootState, store } from '@/store'
import { AuthActionTypes } from '@/store/auth/actions'
import authApi from '@/api/Auth'
import router from '@/router'
import { OptionsConfigurationBodyType, requiredChoiceTitlesType, carBrandsModelType, carOrderAddType, carBrandModelLevelType } from '@/types'
import { VueCookieNext } from 'vue-cookie-next'
export enum ActionTypes {
    GET_OPTIONS_CONFIGURATIONS = 'GET_OPTIONS_CONFIGURATIONS',
    GET_CAR_BRANDS_MODELS = 'GET_CAR_BRANDS_MODELS',
    ADD_CARORDER = 'ADD_CARORDER',
    GET_CARSBYID = 'GET_CARSBYID',
    GET_CARORDERBYID = 'GET_CARORDERBYID',
    GENERATE_CARORDERPDF = 'GENERATE_CARORDERPDF',
    DOWNLOAD_CARORDERPDF = 'DOWNLOAD_CARORDERPDF'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [ActionTypes.GET_OPTIONS_CONFIGURATIONS]({ commit }: AugmentedActionContext, payload: OptionsConfigurationBodyType): void;
    [ActionTypes.GET_CAR_BRANDS_MODELS]({ commit }: AugmentedActionContext, payload: carBrandModelLevelType[]): void;
    [ActionTypes.ADD_CARORDER]({ commit }: AugmentedActionContext, payload: { carOrderData: carOrderAddType; id?: number }): void;
    [ActionTypes.GET_CARSBYID]({ commit }: AugmentedActionContext, payload: { vehicleId: number }): void;
    [ActionTypes.GET_CARORDERBYID]({ commit }: AugmentedActionContext, payload: { id: number }): void;
    [ActionTypes.GENERATE_CARORDERPDF]({ commit }: AugmentedActionContext, payload: { lang: string; carOrderId: number }): void;
    [ActionTypes.DOWNLOAD_CARORDERPDF]({ commit }: AugmentedActionContext, payload: { lang: string; carOrderId: number }): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [ActionTypes.GET_OPTIONS_CONFIGURATIONS]({ commit, state }, options) {
        commit(MutationTypes.SET_OPTIONS_LOADER, true)
        const res = await authApi.getOptionsConfiguration(options.vehicleId, options.selectedOptions)
        if (res['status'] == 'warning') {
            if (res['message'] == 'Vehicle not found') {
                commit(MutationTypes.SET_LEASE_RATE_ERROR, res['message'])
            } else if (res['response'][0] == 'Lease Rate Data not found') {
                commit(MutationTypes.SET_LEASE_RATE_ERROR, res['response'][0])
            }
        }
        if (res['status'] == 'success' && res.option.length) {
            state.vehicleId = res['netMonthlyCost']['vehicleDetails']['unique_identity_101']
            // added all nested options
            const optionsResponseAsObject = {}
            if (options.selectedOptions.action == 'added' && options.selectedOptions.option) {
                store.state.options.nestedOptions = {}
                options.selectedOptions['userSelectedOptions'].forEach((item) => {
                    store.state.options.nestedOptions[item] = []
                })
                res.option.forEach((item) => {
                    optionsResponseAsObject[item.optionId] = item
                })
                commit(MutationTypes.SET_OPTIONS_RESPONSE_AS_OBJECT, optionsResponseAsObject)
                // const nestedOptions = res.option
                //     .filter(item => {
                //         return item['optionId'].toString() == options.selectedOptions.option
                //     })
                //     .map(function (item) {
                //         return { packMembers: item['packMembers'], required: item['required'] }
                //     })
                // if (nestedOptions.length) {
                //     const flattenArray = [...new Set([...nestedOptions[0]['packMembers'] ?? '', ...nestedOptions[0]['required'] ?? ''])];
                //     store.state.options.nestedOptions[options.selectedOptions.option] = flattenArray
                //     store.state.options.nestedOptions[options.selectedOptions.option]?.forEach(element => {
                //             const oneLevelDeepNestedOptions = res.option
                //                     .filter(item => {
                //                         return element.indexOf(item['optionId'].toString()) > -1;
                //                     })
                //                     .map(function (item) {
                //                         return item.packMembers.length || item.required ? { key: options.selectedOptions.option, optionId: item['optionId'], packMembers: item['packMembers'], required: item['required'] } : {}
                //                     })
                //                     .filter(item => {
                //                         return Object.keys(item).length > 0
                //                     })
                //             oneLevelDeepNestedOptions.forEach((item) => {
                //                 const packAndRequired = [...new Set([...item['packMembers'] ?? '', ...item['required'] ?? ''])]
                //                 packAndRequired.forEach((comboSelection) => {
                //                     if (item.key != comboSelection)
                //                         store.state.options.nestedOptions[item.key].push(comboSelection)
                //                 })
                //             })
                //         });
                // }
            }
            // Set Expensive flag and NetMonthlyCost
            const NetMonthlyCostAndFlag = {
                expensiveFlag: '',
                netMonthlyCost: '',
                fiscalValue: ''
            }
            NetMonthlyCostAndFlag.expensiveFlag = res['complyCarResponse']['expensiveFlag']
            NetMonthlyCostAndFlag.netMonthlyCost = res['netMonthlyCost']['netMonthlyCost']
            NetMonthlyCostAndFlag.fiscalValue = res['netMonthlyCost']['fiscalValue']
            store.commit(MutationTypes.SET_NETMONTHLYCOSTANDFLAG, NetMonthlyCostAndFlag)
            store.commit(MutationTypes.SET_COLORS_FLAG, res['complyCarResponse']['colorSelection'])
            // pack member
            const packMembers = res.option
                .filter(item => {
                    return item['newState'] === 'selected' || item['newState'] === 'required'
                })
                .map(function (item) {
                    return item['packMembers']
                })
            const packMemerArray = packMembers.flat()
            if (packMemerArray.length > 0) {
                res.option.forEach(function (option) {
                    packMemerArray.forEach(function (id) {
                        if (option['optionId'].toString() == id) {
                            Object.assign(option, { isPack: true })
                        }
                    })
                })
            }
            // pack members titles
            if (options['packMembers']) {
                const packMembersTitles = res.option
                    .filter(function (item) {
                        return options['packMembers'].indexOf(item['optionId'].toString()) !== -1
                    })
                    .map(function (item) {
                        return { titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'] }
                    })
                commit(MutationTypes.SET_PACK_MEMBERS_TITLES, packMembersTitles)
            }
            // get conflictedOptions
            options.selectedOptions['userSelectedOptions'].forEach((element) => {
                const conflictedOptionsDetails = res.option
                    .filter(item => {
                        return element.indexOf(item['optionId'].toString()) > -1 && item.newState == 'conflicted'
                    })
                    .map(function (item) {
                        return { titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'], optionID: item['optionId'].toString() }
                    })
                if (conflictedOptionsDetails.length)
                    store.state.options.conflictedOptions = conflictedOptionsDetails
            })
            // getAll Selected Options
            const getAllSelectedOptions = res.option
                .filter(item => {
                    return item['newState'] === 'selected' || item['newState'] === 'required' || item['isPack'] == true
                })
                .map(function (item) {
                    return item.optionId.toString()
                })
            if (!(state.allSelectedOptions.length === getAllSelectedOptions.length && state.allSelectedOptions.every((value, index) => value === getAllSelectedOptions[index])))
                commit(MutationTypes.SET_ALL_SELECTED_OPTIONS, getAllSelectedOptions)
            // if required choices not added
            const notAddedRequiredChoices = res.option
                .filter(function (item) {
                    return item['requiredChoices'] && item['requiredChoices'].length
                })
                .map(function (item) {
                    return item['requiredChoices']
                })
            // console.log('notAddedRequiredChoices', notAddedRequiredChoices)
            const requiredChoiceTitlesArray: Array<requiredChoiceTitlesType> = []
            notAddedRequiredChoices.forEach((choiceArray) => {
                choiceArray.forEach((choice) => {
                    const requiredChoiceTitle = res.option
                        .filter(function (item) {
                            return choice.indexOf(item['optionId'].toString()) !== -1
                        })
                        .map(function (item) {
                            return { titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'], optionId: item['optionId'], price: item['price'], newState: item['newState'], requiredChoices: item['requiredChoices'], packMembers: item['packMembers'] }
                        })
                    requiredChoiceTitlesArray.push(requiredChoiceTitle)
                })
            })
            commit(MutationTypes.SET_REQUIRED_CHOICES_TITLES, requiredChoiceTitlesArray)
            // required choices
            if (options['selectedCheckbox']) {
                const selectedOption = options['selectedCheckbox']
                const requiredChoices = res.option
                    .filter(function (item) {
                        return item['optionId'].toString() == selectedOption
                    })
                    .map(function (item) {
                        return item['requiredChoices']
                    })
                let parentRequiredChoices
                if (requiredChoices[0] && requiredChoices[0].length) {
                    parentRequiredChoices = requiredChoices[0]
                    if (store.state.options.latestSelection.indexOf(options['selectedCheckbox'].toString()) === -1) {
                        store.state.options.latestSelection.push(options['selectedCheckbox'])
                    }
                } else {
                    // Nested required choices
                    const responseRequiredChoices = res.option
                        .filter((item) => {
                            return item['requiredChoices'] && item['requiredChoices'].length
                        })
                        .map(function (item) {
                            return item['requiredChoices']
                        })
                    // console.log(responseRequiredChoices[0], 'responseRequiredChoices')
                    if (responseRequiredChoices && responseRequiredChoices[0]) {
                        parentRequiredChoices = responseRequiredChoices[0]
                        if (store.state.options.latestSelection.indexOf(options['selectedCheckbox'].toString()) === -1) {
                            store.state.options.latestSelection.push(options['selectedCheckbox'])
                        }
                    } else {
                        commit(MutationTypes.SET_REQUIRED_CHOICES_TITLES, [])
                        store.state.options.latestSelection = []
                    }
                }
                const requiredChoiceTitlesArray: Array<requiredChoiceTitlesType> = []
                parentRequiredChoices?.forEach((choice) => {
                    const requiredChoiceTitle = res.option
                        .filter(function (item) {
                            return choice.indexOf(item['optionId'].toString()) !== -1
                        })
                        .map(function (item) {
                            return { titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'], optionId: item['optionId'], price: item['price'], newState: item['newState'], requiredChoices: item['requiredChoices'], packMembers: item['packMembers'] }
                        })
                    requiredChoiceTitlesArray.push(requiredChoiceTitle)
                })
                commit(MutationTypes.SET_REQUIRED_CHOICES_TITLES, requiredChoiceTitlesArray)
            }
            const exteriorInterior = {
                exteriorColour: [],
                interiorColour: []
            }
            const packageAndOptions = {
                audioAndEntertainment: [],
                comfort: [],
                drivingAndBraking: [],
                other: [],
                safety: [],
                exteriorColour: [],
                interiorColour: []
            }
            const result = {}
            res.option.forEach(item => {
                if (!result[item['category']]) {
                    result[item['category']] = []
                }
                result[item['category']].push(item)
            })
            commit(MutationTypes.SET_OPTIONS_RESPONSE, res['option'])
            const getExteriorInteriorTypeP = (data) => {
                return data?.filter((item) => item['type'] == 'P')
            }
            exteriorInterior['exteriorColour'] = result['Exterior colour']
            exteriorInterior['interiorColour'] = result['Interior colour']
            packageAndOptions['audioAndEntertainment'] = result['Audio & Entertainment']
            packageAndOptions['comfort'] = result['Comfort']
            packageAndOptions['drivingAndBraking'] = result['Driving & braking']
            packageAndOptions['other'] = result['Other']
            packageAndOptions['safety'] = result['Safety']
            packageAndOptions['exteriorColour'] = getExteriorInteriorTypeP(result['Exterior colour'])
            packageAndOptions['interiorColour'] = getExteriorInteriorTypeP(result['Interior colour'])
            commit(MutationTypes.SET_OPTIONS, exteriorInterior)
            commit(MutationTypes.SET_PACKAGESANDOPTIONS, packageAndOptions)
            // get selectedCongigOptions    
            const selectedConfigOptions = res.option
                .filter(item => {
                    return item['newState'] === 'selected' || item['isPack'] == true || item['newState'] === 'required'
                })
                .map(function (item) {
                    return { code: item['code'], type: item['type'], price: item['price'], priceExcludingVAT: item['priceExcludingVAT'], titleEn: item['titleEn'], titleNl: item['titleNl'], category: item['category'], optionId: item['optionId'] }
                })
            commit(MutationTypes.SET_SELECTEDCONFIGOPTIONS, selectedConfigOptions)
        }
        commit(MutationTypes.SET_OPTIONS_LOADER, false)
    },
    async [ActionTypes.GET_CAR_BRANDS_MODELS]({ commit }) {
        commit(MutationTypes.SET_OPTIONS_LOADER, true)
        const res = await authApi.getCarBrandsModels()
        if (res) {
            const carBrandAndModels: { value: carBrandsModelType[] } = { value: [] }
            res.cars.map((item) => {
                const modelNameArr = []
                item.models.map((e) => {
                    modelNameArr.push(e.model)
                })
                carBrandAndModels.value.push({ brand: item.brand, models: modelNameArr })
            })
            commit(MutationTypes.SET_BRANDS, carBrandAndModels.value)
            commit(MutationTypes.SET_CAR_BRANDS_MODELS, carBrandAndModels.value)
            commit(MutationTypes.SET_BRANDS_MODELS_LEVELS, res.cars)
        }
        commit(MutationTypes.SET_OPTIONS_LOADER, false)
    },
    async [ActionTypes.ADD_CARORDER]({ commit }, { carOrderData, id }) {
        commit(MutationTypes.SET_OPTIONS_LOADER, true)
        const params = router.currentRoute.value.params
        const res = id ? await authApi.carOrderUpdate(carOrderData, id) : await authApi.carOrderAdd(carOrderData)

        let complyResponse: string[] = []
        //Manually adding message when expensiveFlag = true  
        if (res.complyCarResponse && res.complyCarResponse.expensiveFlag) {
            complyResponse.push('Car is too expensive')
        }
        // Adding error messages to the array to show popup
        if (res.complyCarResponse && res.complyCarResponse.complyErrors && res.complyCarResponse.complyErrors.length > 0) {
            complyResponse = [...complyResponse, ...res.complyCarResponse.complyErrors]
        }

        store.commit(MutationTypes.SET_COMPLYCARRESPONSE, complyResponse)
        if (res.status == 'success') {
            VueCookieNext.setCookie("latestcarOrderId", JSON.stringify(res.carOrderId))
            if (carOrderData.status == 1) {
                router.push({ name: 'Step4', params })
            }
            else if (carOrderData.status == 0) {
                router.push({ name: 'Dashboard' })
            }
            else if (carOrderData.status == 2) {
                store.dispatch(ActionTypes.GENERATE_CARORDERPDF, { lang: localStorage.getItem('locale') || 'nl', carOrderId: VueCookieNext.getCookie('latestcarOrderId') })
                store.dispatch(AuthActionTypes.GET_CURRENT_USER_DETAILS)
            }
        }
        commit(MutationTypes.SET_OPTIONS_LOADER, false)
    },
    async [ActionTypes.GET_CARSBYID]({ commit }, data) {
        commit(MutationTypes.SET_OPTIONS_LOADER, true)
        const res = await authApi.getCarsByID(data.vehicleId)
        store.commit(MutationTypes.SET_CARSBYID, res)
        commit(MutationTypes.SET_OPTIONS_LOADER, false)
    },
    async [ActionTypes.GET_CARORDERBYID]({ commit }, data) {
        commit(MutationTypes.SET_CARORDERLOADER, true)
        const res = await authApi.getCarOrderDetails(data.id)
        commit(MutationTypes.SET_CARORDERDETAILSBYID, res.carOrderResponse)
        commit(MutationTypes.SET_CARORDERLOADER, false)
    },
    async [ActionTypes.GENERATE_CARORDERPDF]({ commit }, data) {
        commit(MutationTypes.SET_CARORDERLOADER, true)
        await authApi.carOrderGeneratePdf(data.lang, data.carOrderId).then(() => {
            router.push({ name: 'Dashboard' })
            commit(MutationTypes.SET_CARORDERSUCCESS, true)
        })
        commit(MutationTypes.SET_CARORDERLOADER, false)
    },
    async [ActionTypes.DOWNLOAD_CARORDERPDF]({ commit }, data) {
        commit(MutationTypes.SET_CARORDERLOADER, true)
        commit(MutationTypes.SET_CARORDERPDFERROR, false)
        const res = await authApi.carOrderDownloadPdf(data.lang, data.carOrderId)
        if(res){
            const FILE = await window.URL.createObjectURL(new Blob([res]));
            const docUrl = document.createElement('a');
            docUrl.href = FILE;
            docUrl.setAttribute('download', 'carOrdered.pdf');
            document.body.appendChild(docUrl);
            docUrl.click();
            commit(MutationTypes.SET_CARORDERLOADER, false)
        } else {
            commit(MutationTypes.SET_CARORDERPDFERROR, true)
            setTimeout(() => {
                commit(MutationTypes.SET_CARORDERPDFERROR, false)
            }, 7000);
        }
    }
}

