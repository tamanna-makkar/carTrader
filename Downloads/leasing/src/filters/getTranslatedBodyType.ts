export default function (selectedBodyType) {
    let translatedBodyType = ''
    if (selectedBodyType === 'SUV') {
        translatedBodyType = '_wizard.step3.SUV'
    } else if (selectedBodyType === 'Hatchbacks') {
        translatedBodyType = '_wizard.step3.Hatchbacks'
    } else if (selectedBodyType === 'Saloons') {
        translatedBodyType = '_wizard.step3.Saloons'
    } else if (selectedBodyType === 'Coupes') {
        translatedBodyType = '_wizard.step3.Coupes'
    } else if (selectedBodyType === 'Estate cars') {
        translatedBodyType = '_wizard.step3.Estate cars'
    } else if (selectedBodyType === 'MPV') {
        translatedBodyType = '_wizard.step3.MPV'
    } else if (selectedBodyType === 'Convertibles') {
        translatedBodyType = '_wizard.step3.Convertibles'
    }
    return translatedBodyType
}