import { computed, onMounted } from "vue"
import { ActionTypes } from '@/store/options/actions'
import { useStore } from '@/store'

export default function () {
    const store = useStore()
    const getCarPolicyBrandsModels = computed(() => store.state.auth.carPolicyBrandsModels)
    let carBrandsModels = computed(() => store.state.options.carBrandsModels)
    const allCarBrands = computed(()=> store.state.options.carBrandsModels)
    const getBrands = computed(() => {
        if (getCarPolicyBrandsModels.value.length) {
            carBrandsModels = getCarPolicyBrandsModels
        }
        const brands = allCarBrands.value.map((item) => {
            return item.brand
        })
        return brands
    })
    const initialize = async () => {
        await store.dispatch(ActionTypes.GET_CAR_BRANDS_MODELS)
    }
    onMounted(async () => {
        await initialize()
    })
    return { getBrands, carBrandsModels }
}