export default function (fuelType) {
    let translatedFuelType = '_wizard.step2.Other'
    if (fuelType == 'plug_in_hybrid') {
        translatedFuelType = '_wizard.step2.PlugInHybrid'
    } else if (fuelType == 'petrol') {
        translatedFuelType = '_wizard.step2.Petrol'
    } else if (fuelType == 'electric') {
        translatedFuelType = '_wizard.step2.Electric'
    } else if (fuelType == 'diesel') {
        translatedFuelType = '_wizard.step2.Diesel'
    } else if (fuelType == 'hybrid') {
        translatedFuelType = '_wizard.step2.Hybrid'
    } else if (fuelType == 'hydrogen') {
        translatedFuelType = '_wizard.step2.Hydrogen'
    }
    return translatedFuelType
}
