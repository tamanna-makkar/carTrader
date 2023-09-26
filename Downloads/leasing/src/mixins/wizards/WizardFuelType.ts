import { reactive, onMounted } from "vue"
export default function () {
    const checkboxesStep2 = reactive([
        { id: 'step2-styled-checkbox1', value: '_wizard.step2.Petrol', isActive: false, range: false, wizardInfo: false, title: 'petrol', isDisabled: false },
        { id: 'step2-styled-checkbox2', value: '_wizard.step2.Diesel', isActive: false, range: false, wizardInfo: false, title: 'diesel', isDisabled: false },
        {
            id: 'step2-styled-checkbox3',
            value: '_wizard.step2.Electric',
            desc: 'An electric vehicle',
            isActive: false,
            range: true,
            wizardInfo: false,
            sidebarFilter: true,
            title: 'electric',
            isDisabled: false
        },
        {
            id: 'step2-styled-checkbox4',
            value: '_wizard.step2.PlugInHybrid',
            desc: 'A plug-in hybrid electric vehicle is a hybrid electric vehicle whose battery can be recharged by plugging it into an external source of electric power, as well as by its on-board engine and generator.',
            isActive: sessionStorage.getItem('plug_in_hybrid') ? JSON.parse(sessionStorage.getItem('plug_in_hybrid') || '') : false,
            range: true,
            wizardInfo: false,
            sidebarFilter: true,
            title: 'plug_in_hybrid',
            isDisabled: false
        },
        {
            id: 'step2-styled-checkbox5',
            value: '_wizard.step2.Hybrid',
            desc: 'A hybrid vehicle',
            isActive: sessionStorage.getItem('hybrid') ? JSON.parse(sessionStorage.getItem('hybrid') || '') : false,
            range: false,
            wizardInfo: false,
            title: 'hybrid',
            isDisabled: false
        },
        {
            id: 'step2-styled-checkbox6',
            value: '_wizard.step2.Hydrogen',
            desc: 'A Hydrogen vehicle',
            isActive: false,
            range: false,
            wizardInfo: false,
            title: 'hydrogen',
            isDisabled: false
        },
        {
            id: 'step2-styled-checkbox7',
            value: '_wizard.step2.Other',
            desc: 'Other vehicle',
            isActive: false,
            range: false,
            wizardInfo: false,
            title: 'other',
            isDisabled: false
        }
    ])
    onMounted(() => {
        if (sessionStorage.getItem('car_policy_fuel_type')) {
            const storedStepValue = JSON.parse(sessionStorage.getItem('car_policy_fuel_type') || '[]')
            checkboxesStep2.forEach((item) => {
                item.isDisabled = !storedStepValue.includes(item.title)
            })
        }
    })
    return { checkboxesStep2 }
}