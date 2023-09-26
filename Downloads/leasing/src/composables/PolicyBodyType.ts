import { reactive, ref } from 'vue'
export default function BodyType() {
    const bodyTypeError = ref('')
    const bodyTypeArray = reactive({
        value:
            [
                'SUV',
                'Hatchbacks',
                'Saloons',
                'Coupes',
                'Estate cars',
                'MPV',
                'Convertibles'
            ]
    })
    const checkboxesStep3 = reactive([
        {
            id: 'bodytype-checkbox1',
            value: 'SUV',
            image: require('@/assets/SUV.svg'),
            imageDisabled: require('@/assets/SUV_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'bodytype-checkbox2',
            value: 'Hatchbacks',
            image: require('@/assets/Hatchbacks.svg'),
            imageDisabled: require('@/assets/Hatchbacks_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'bodytype-checkbox3',
            value: 'Saloons',
            image: require('@/assets/Saloons.svg'),
            imageDisabled: require('@/assets/Saloons_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'bodytype-checkbox4',
            value: 'Coupes',
            image: require('@/assets/Coupes.svg'),
            imageDisabled: require('@/assets/Coupes_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'bodytype-checkbox5',
            value: 'Estate cars',
            image: require('@/assets/Estate-cars.svg'),
            imageDisabled: require('@/assets/Estate-cars_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'bodytype-checkbox6',
            value: 'MPV',
            image: require('@/assets/MPV.svg'),
            imageDisabled: require('@/assets/MPV_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'bodytype-checkbox8',
            value: 'Convertibles',
            image: require('@/assets/Convertibles.svg'),
            imageDisabled: require('@/assets/Convertibles_disabled.svg'),
            isActive: true,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        }
    ])
    const onCarBodyCheck = ($event) => {
        if (bodyTypeArray.value.indexOf($event.target.value) === -1) {
            bodyTypeArray.value.push($event.target.value)
        }
        if (!$event.target.checked) {
            bodyTypeArray.value.splice(bodyTypeArray.value.indexOf($event.target.value), 1)
        }
    }
    return { checkboxesStep3, bodyTypeError, onCarBodyCheck, bodyTypeArray }
}