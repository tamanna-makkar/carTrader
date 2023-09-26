import { reactive } from "vue"
export default function () {
    const checkboxesStep10 = reactive([
        {
            id: 'step10-styled-checkbox1',
            value: '_wizard.step10.highQualityAudio',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'High quality audio'
        },
        {
            id: 'step10-styled-checkbox2',
            value: '_wizard.step10.adaptiveCruise',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'Adaptive cruise control'
        },
        {
            id: 'step10-styled-checkbox3',
            value: '_wizard.step10.collosionWarning',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'Collision warning system'
        },
        {
            id: 'step10-styled-checkbox4',
            value: '_wizard.step10.appleCar',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'Apple car play'
        },
        {
            id: 'step10-styled-checkbox5',
            value: '_wizard.step10.andriodAuto',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'Android auto'
        },
        {
            id: 'step10-styled-checkbox7',
            value: '_wizard.step10.sunroof',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'Sunroof'
        },
        {
            id: 'step10-styled-checkbox8',
            value: '_wizard.step10.rearView',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
            isActive: false,
            wizardInfo: false,
            title: 'Rear view camera'
        }
    ])
    const getSelectedEquipments = (storedStep, checkboxArray) => {
        const storedStepValue = JSON.parse(sessionStorage.getItem(`${storedStep}`) || '[]')
        storedStepValue.forEach((itemName) => {
            checkboxArray.forEach((item) => {
                if (item.title === itemName) {
                    item.isActive = true
                }
            })
        })
        return checkboxArray
    }
    const equipmentCheckboxes = sessionStorage.getItem('equipments') ? getSelectedEquipments('equipments', checkboxesStep10) : checkboxesStep10
    return { equipmentCheckboxes }
}