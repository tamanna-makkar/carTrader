import { step1ErrorsType } from '@/types'
import { reactive, ref } from 'vue'
export default function generalInfo() {
    const colorCodes = reactive(['#FFAC30', '#2C00AB', '#00B5AD', '#51B786', '#FF675E'])
    const carPolicyTitle = ref('')
    const errors: step1ErrorsType = reactive({
    })
    const selectedColorCode = ref('#FFAC30')
    const selectColorCode = (item) => {
        selectedColorCode.value = item
    }
    const checkStep1 = () => {
        delete errors['titleRequiredError']
        delete errors['titleLengthError']
        if (!carPolicyTitle.value) {
            errors['titleRequiredError'] = 'required'
        } else {
            if (carPolicyTitle.value.length <= 2) {
                errors['titleLengthError'] = 'lengthError'
            }
        }
        if (Object.getOwnPropertyNames(errors).length === 0) {
            return true
        }
    }
    const onInput = (value) => {
        carPolicyTitle.value = value
    }
    return { colorCodes, carPolicyTitle, errors, selectedColorCode, selectColorCode, checkStep1, onInput}
}