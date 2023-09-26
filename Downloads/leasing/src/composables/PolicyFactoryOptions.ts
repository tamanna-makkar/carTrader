import { reactive } from 'vue'
export default function factoryOptions() {
    const factoryOptionsArray: {value: Array<string> } = reactive({ value: []})
    const factoryOptionsCheckboxes = reactive([
        {
            id: 'factory-checkbox1',
            value: '_carPolicy.factoryCheckboxesOptions.metallicPaint',
            desc: 'Loreum ipsum dolor sit amet',
            isActive: false,
            wizardInfo: false,
            title: 'Metallic paint'
        }
    ])
    const onFactoryCheck = ($event, title) => {
        if (factoryOptionsArray.value.indexOf(title) === -1) {
            factoryOptionsArray.value.push(title)
        }
        if (!$event.target.checked) {
            factoryOptionsArray.value.splice(factoryOptionsArray.value.indexOf(title), 1)
        }
    }
    return { factoryOptionsCheckboxes, onFactoryCheck, factoryOptionsArray }
}