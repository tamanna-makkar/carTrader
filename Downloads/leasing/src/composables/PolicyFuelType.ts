import { reactive, ref, watch, computed } from 'vue'
import { step2ErrorsType, chargingFacilityType, mandatoryAccessoriesType, fuelType } from '@/types'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
export default function PolicyFuelType() {
    const store = useStore()
    const { t, locale } = useI18n({ useScope: 'global' })
    const carPolicyChargingFacility = computed(() => store.state.auth.carPolicyByID.chargingFacility)
    const selectedElectricOption = ref('< 100 km')
    const selectedHybridOption = ref('< 50 km')
    const selectedMileageOption = reactive(['25000 km', '25000 km', '25000 km', '25000 km', '25000 km', '25000 km', '25000 km'])
    const selectedDurationOption = reactive(['48', '48', '48', '48', '48', '48', '48'])
    const chargingMandatoryOptions = reactive([false, false, false, false, false])
    const FuelTypeError = ref('')
    const fuelTypeArray: { value: fuelType[] } = reactive({value: []})
    let fuelTypeDetails: fuelType = reactive({
        title: '',
        setMileage: 25000,
        setDuration: 48,
        distance: 0,
        isChargingMandatory: 0,
    })
    watch(
        () => _.cloneDeep(locale.value),
        () => {
            if (selectedElectricOption.value === 'range' || selectedElectricOption.value == 'Actieradius') {
                selectedElectricOption.value = t('_wizard.step2.selectRange')
            }
            if (selectedHybridOption.value === 'range' || selectedHybridOption.value == 'Actieradius') {
                selectedHybridOption.value = t('_wizard.step2.selectRange')
            }
        }
    )
    const step2Errors: Array<step2ErrorsType> = reactive([{
    }])
    const mandatoryAccessoriesErrors: Array<step2ErrorsType> = reactive([{
        facilityError: '',
        priceError: ''
    }])
    const chargingFacility: { value: chargingFacilityType[] } = reactive({
        value: [
            { chargingFacility: '', price: '', type: 'add' }
    ]})
    const mandatoryAccessories: { value: mandatoryAccessoriesType[] } = reactive({
        value: [
            { accessory: '', price: '', type: 'add' }
        ]
    })
    const checkAddChargingFacility = () => {
        return step2Errors.some((item) => item.facilityError || item.facilityRequired || item.priceError || item.priceRequired)
    }
    const checkChargingFacility = () => {
        if (!chargingFacility.value.some((item) => item.chargingFacility)) {
            step2Errors[0]['facilityRequired'] = 'required'
        }
        if (!chargingFacility.value.some((item) => item.price)) {
            step2Errors[0]['priceRequired'] = 'required'
        }
        if (!checkAddChargingFacility()) {
            return true
        }
    }
    const checkboxesValues = reactive([
        {
            id: 'styled-checkbox1', value: '_wizard.step2.Petrol', isActive: false, range: false, wizardInfo: false, mileageDuration: true,
            title: 'petrol'},
        {
            id: 'styled-checkbox2', value: '_wizard.step2.Diesel', isActive: false, range: false, wizardInfo: false, mileageDuration: true,
            title: 'diesel'
        },
        {
            id: 'styled-checkbox3',
            value: '_wizard.step2.Electric',
            desc: 'An electric vehicle',
            isActive: false,
            range: true,
            wizardInfo: false,
            isChargingMandatory: true,
            mileageDuration: true,
            title: 'electric'
        },
        {
            id: 'styled-checkbox4',
            value: '_wizard.step2.PlugInHybrid',
            desc: 'A plug-in hybrid electric vehicle is a hybrid electric vehicle whose battery can be recharged by plugging it into an external source of electric power, as well as by its on-board engine and generator.',
            isActive: false,
            range: true,
            wizardInfo: false,
            isChargingMandatory: true,
            mileageDuration: true,
            title: 'plug-in hybrid'
        },
        {
            id: 'styled-checkbox5',
            value: '_wizard.step2.Hybrid',
            desc: 'A hybrid vehicle',
            isActive: false,
            range: false,
            wizardInfo: false,
            mileageDuration: true,
            title: 'hybrid'
        },
        {
            id: 'styled-checkbox6',
            value: '_wizard.step2.Hydrogen',
            desc: 'A Hydrogen vehicle',
            isActive: false,
            range: false,
            wizardInfo: false,
            mileageDuration: true,
            title: 'hydrogen'
        },
        {
            id: 'styled-checkbox7',
            value: '_wizard.step2.Other',
            desc: 'Other vehicle',
            isActive: false,
            range: false,
            wizardInfo: false,
            mileageDuration: true,
            title: 'other'
        }
    ])
    watch(
        () => _.cloneDeep(locale.value),
        () => {
            if (selectedElectricOption.value === 'Select range' || selectedElectricOption.value == 'Selecteer bereik') {
                selectedElectricOption.value = t('_wizard.step2.selectRange')
            }
            if (selectedHybridOption.value === 'Select range' || selectedHybridOption.value == 'Selecteer bereik') {
                selectedHybridOption.value = t('_wizard.step2.selectRange')
            }
        }
    )
    const convertToNumber = (selectedOption) => {
        return parseInt(selectedOption.replace(/[kmmonths<>]/g, ''))
    }
    const convertToNumberAndFloat = (selectedOption) => {
        return selectedOption.replace(/,/g, '.')
    }
    const onCheck = (option) => {
        const optionValue = option['title']
        fuelTypeDetails = {
            title: '',
            setMileage: 25000,
            setDuration: 48,
            distance: 0,
            isChargingMandatory: 0,
        }
        fuelTypeDetails['title'] = optionValue
        fuelTypeDetails['setMileage'] = convertToNumber(selectedMileageOption[option['index']])
        fuelTypeDetails['setDuration'] = convertToNumber(selectedDurationOption[option['index']]) 
        if (!fuelTypeArray.value.find(item => item.title === optionValue))
            fuelTypeArray.value.push(fuelTypeDetails)
        if (!option['item'].target.checked) {
            const removeIndex = fuelTypeArray.value.findIndex(item => item.title === optionValue)
            fuelTypeArray.value.splice(removeIndex, 1)
        }
    }
    const getFuelTypeArrayIndex = (index) => {
        const selectedTitle = checkboxesValues[index]['title'].toLowerCase()
        return fuelTypeArray.value.findIndex(item => item.title === selectedTitle)
    }
    const selectElectricOption = (option) => {
        selectedElectricOption.value = option['item']
        if (option['item'] == '< 100 km')
            option['item'] = '0'
        const currentIndex = getFuelTypeArrayIndex(option['key'])
        fuelTypeArray.value[currentIndex]['distance'] = convertToNumber(option['item'])
    }
    const selectHybridOption = (option) => {
        selectedHybridOption.value = option['item']
        if (option['item'] == '< 50 km')
            option['item'] = '0'
        const currentIndex = getFuelTypeArrayIndex(option['key'])
        fuelTypeArray.value[currentIndex]['distance'] = convertToNumber(option['item'])
    }
    const selectMileageOption = (option) => {
        selectedMileageOption[option['key']] = option['item']
        const currentIndex = getFuelTypeArrayIndex(option['key'])
        fuelTypeArray.value[currentIndex]['setMileage'] = convertToNumber(option['item'])
    }
    const selectDurationOption = (option) => {
        selectedDurationOption[option['key']] = option['item']
        const currentIndex = getFuelTypeArrayIndex(option['key'])
        fuelTypeArray.value[currentIndex]['setDuration'] = convertToNumber(option['item'])
    }
    const selectMandatoryOptions = (option) => {
        chargingMandatoryOptions[option['index']] = !option['item']
        const currentIndex = getFuelTypeArrayIndex(option['index'])
        fuelTypeArray.value[currentIndex]['isChargingMandatory'] = !option['item'] === false ? 0 : 1
        if (!option['item']) {
            chargingFacility.value.length = 0
            chargingFacility.value.push({ chargingFacility: '', price: '', type: 'add' })
            Array.prototype.unshift.apply(chargingFacility.value, carPolicyChargingFacility.value)
        }
    }
    const isChargingMandatory = computed(() => {
        step2Errors.push({
            facilityError: '',
            priceError: ''
        })
        if (carPolicyChargingFacility.value) {
            for (let i = 0; i < carPolicyChargingFacility.value.length; i++) {
                step2Errors.unshift({
                    facilityError: '',
                    priceError: ''
                })
            }
        }
        const option = chargingMandatoryOptions.some((item => item))
        if (!option) {
            step2Errors.length = 0 
            chargingFacility.value.length = 0
        }
        return option
    })
    const addFacility = (item) => {
        if (item.type == 'chargingFacility') {
            chargingFacility.value.push({
                chargingFacility: '', price: '', type: 'add'
            })
            chargingFacility.value[item['index']]['type'] = 'delete'
            step2Errors.push({
                facilityError: '',
                priceError: ''
            })
        } else {
            mandatoryAccessories.value.push({
                accessory: '', price: '', type: 'add'
            })
            mandatoryAccessoriesErrors.push({
                facilityError: '',
                priceError: ''
            })
            mandatoryAccessories.value[item['index']]['type'] = 'delete'
        }
    }
    const deleteFacility = (item) => {
        if (item['type'] == 'chargingFacility') {
            chargingFacility.value.splice(item['index'], 1)
        } else {
            mandatoryAccessories.value.splice(item['index'], 1)
        }
    }
    const onNameInput = (option) => {
        if (option['type'] == 'chargingFacility') {
            chargingFacility.value[option['index']]['chargingFacility'] = option['item']
            delete step2Errors[option['index']]['facilityError']
            delete step2Errors[option['index']]['facilityRequired']
            if (!chargingFacility.value[option['index']]['chargingFacility']) {
                step2Errors[option['index']]['facilityRequired'] = 'required'
            } else {
                if (chargingFacility.value[option['index']]['chargingFacility'].length < 2 || chargingFacility.value[option['index']]['chargingFacility'].length > 250) {
                    step2Errors[option['index']]['facilityError'] = 'LengthError'
                }
            }
        } else {
            mandatoryAccessories.value[option['index']]['accessory'] = option['item']
            delete mandatoryAccessoriesErrors[option['index']]['facilityError']
            if (mandatoryAccessories.value[option['index']]['accessory'].length < 2 || mandatoryAccessories.value[option['index']]['accessory'].length > 250) {
                mandatoryAccessoriesErrors[option['index']]['facilityError'] = 'LengthError'
            }
        }
    }
    const onPriceInput = (option) => {
        if (option['type'] == 'chargingFacility') {
            chargingFacility.value[option['index']]['price'] = option['item']
            delete step2Errors[option['index']]['priceError']
            delete step2Errors[option['index']]['priceRequired']
            if (!chargingFacility.value[option['index']]['price']) {
                step2Errors[option['index']]['priceRequired'] = 'required'
            } else {
                if (!chargingFacility.value[option['index']]['price'].match(/^[0-9.,]*$/)) {
                    step2Errors[option['index']]['priceError'] = 'typeError'
                }
            }
        } else {
            mandatoryAccessories.value[option['index']]['price'] = option['item']
            delete mandatoryAccessoriesErrors[option['index']]['priceError']
            if (!mandatoryAccessories.value[option['index']]['price'].match(/^[0-9.,]*$/)) {
                mandatoryAccessoriesErrors[option['index']]['priceError'] = 'typeError'
            }
        }
    }
    return {
        selectedMileageOption,
        selectedDurationOption,
        selectMileageOption,
        selectDurationOption,
        chargingMandatoryOptions,
        selectMandatoryOptions,
        isChargingMandatory,
        chargingFacility,
        mandatoryAccessories,
        mandatoryAccessoriesErrors,
        addFacility,
        onNameInput,
        onPriceInput,
        deleteFacility,
        step2Errors,
        FuelTypeError,
        selectElectricOption,
        selectHybridOption,
        onCheck,
        checkboxesValues,
        selectedElectricOption,
        selectedHybridOption,
        fuelTypeArray,
        convertToNumberAndFloat,
        checkChargingFacility,
        checkAddChargingFacility
    }
}