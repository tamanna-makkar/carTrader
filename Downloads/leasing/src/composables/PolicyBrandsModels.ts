import { reactive, ref } from 'vue'
import { carBrandsModelType } from '@/types'
import getCarBrandsModels from '@/mixins/getCarBrandsModels'
// import _ from 'lodash'
export default function BrandsModels() {
    const { getBrands, carBrandsModels } = getCarBrandsModels()
    const models: Array<Array<string>> = reactive([])
    const brandModelsArray: { value: carBrandsModelType[] } = reactive({
        value: [
            { brand: '', models: [] }   
        ]
    })
    const showPolicyBrandsModels = ref(false)
    const selectCarPolicyBrand = (brandName) => {
        const selectedItem = { brand: brandName, carBrandsModels: carBrandsModels }
        const findIndex = getBrands.value.indexOf(selectedItem['brand']['item'])
        getBrands.value.splice(findIndex, 1)
        showPolicyBrandsModels.value = true
            const getModels = selectedItem['carBrandsModels'].value
                .filter((item) => {
                    return item['brand'] == selectedItem['brand']['item']
                })
                .map((item) => {
                    return item['models']
                })
            const sortedModels = getModels.sort().flat()
            if (selectedItem['brand']['key'] !== null) {
                brandModelsArray.value[selectedItem['brand']['key']]['brand'] = selectedItem['brand']['item']
                models[selectedItem['brand']['key']] = sortedModels
            } else {
                if (brandModelsArray.value.length === 0) {
                    brandModelsArray.value.push({ brand: '', models: [] })
                }
                brandModelsArray.value[0]['brand'] = selectedItem['brand']['item']
                models[0] = sortedModels
            }   
    }
    const selectModel = (selectedItem) => {
        if (brandModelsArray.value[selectedItem['key']]['models'].indexOf(selectedItem['item']) === -1) {
            brandModelsArray.value[selectedItem['key']]['models'].push(selectedItem['item'])
        }
    }
    const removeModel = (selectedItem) => {
        if (brandModelsArray.value[selectedItem['key']]['models'].indexOf(selectedItem['item']) !== -1) {
            brandModelsArray.value[selectedItem['key']]['models'].splice(brandModelsArray.value[selectedItem['key']]['models'].indexOf(selectedItem['item']), 1)
        }
    }
    const addCarBrand = () => {
        brandModelsArray.value.push({ brand: '', models: [] })
    }
    const removeAllModels = (index) => {
        brandModelsArray.value[index]['models'].splice(0, brandModelsArray.value[index]['models'].length)
    }
    const deleteCarBrand = (index) => {
        if (brandModelsArray.value[index].brand) {
            getBrands.value.push(brandModelsArray.value[index].brand)
        }
        brandModelsArray.value.splice(index, 1)
        models.splice(index, 1)
        if (brandModelsArray.value.length == 0) {
            showPolicyBrandsModels.value = false
        }
    }
    return { models, brandModelsArray, selectModel, removeModel, addCarBrand, removeAllModels, deleteCarBrand, showPolicyBrandsModels, selectCarPolicyBrand, getBrands }
}