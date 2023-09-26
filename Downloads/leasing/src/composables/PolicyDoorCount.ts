import { ref, reactive } from 'vue'
import sliderOptions from '@/mixins/sliderOptions'
export default function doorCount() {
    const sliderValue = ref(2)
    const sliderData = reactive({ value: [5, 4, 3, 2] })
    const { sliderDataOptions } = sliderOptions()
    return { sliderValue, sliderDataOptions, sliderData }
}