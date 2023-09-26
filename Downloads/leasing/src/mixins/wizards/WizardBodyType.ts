import { reactive, onMounted } from 'vue' 
export default function () {
    const checkboxesStep3 = reactive([
        {
            id: 'styled-checkbox1',
            value: 'SUV',
            image: require('@/assets/SUV.svg'),
            imageDisabled: require('@/assets/SUV_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false,
        },
        {
            id: 'styled-checkbox2',
            value: 'Hatchbacks',
            image: require('@/assets/Hatchbacks.svg'),
            imageDisabled: require('@/assets/Hatchbacks_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'styled-checkbox3',
            value: 'Saloons',
            image: require('@/assets/Saloons.svg'),
            imageDisabled: require('@/assets/Saloons_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'styled-checkbox4',
            value: 'Coupes',
            image: require('@/assets/Coupes.svg'),
            imageDisabled: require('@/assets/Coupes_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'styled-checkbox5',
            value: 'Estate cars',
            image: require('@/assets/Estate-cars.svg'),
            imageDisabled: require('@/assets/Estate-cars_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'styled-checkbox6',
            value: 'MPV',
            image: require('@/assets/MPV.svg'),
            imageDisabled: require('@/assets/MPV_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        },
        {
            id: 'styled-checkbox8',
            value: 'Convertibles',
            image: require('@/assets/Convertibles.svg'),
            imageDisabled: require('@/assets/Convertibles_disabled.svg'),
            isActive: false,
            isInfo: false,
            isWizard: true,
            isDisabled: false
        }
    ])
    onMounted(() => {
        if (sessionStorage.getItem('car_policy_body_type')) {
            const storedStepValue = JSON.parse(sessionStorage.getItem('car_policy_body_type') || '[]')
            checkboxesStep3.forEach((item) => {
                item.isDisabled = !storedStepValue.includes(item.value)
            })
        }
    })
    const getSelectedBodyType = (storedStep, checkboxArray) => {
        const storedStepValue = JSON.parse(sessionStorage.getItem(`${storedStep}`) || '[]')
        storedStepValue.forEach((itemName) => {
            checkboxArray.forEach((item) => {
                if (item.value === itemName) {
                    item.isActive = true
                }
            })
        })
        return checkboxArray
    }
    const bodyTypeCheckboxes = sessionStorage.getItem('body_type') ? getSelectedBodyType('body_type', checkboxesStep3) : checkboxesStep3
    return { checkboxesStep3, getSelectedBodyType, bodyTypeCheckboxes }
}