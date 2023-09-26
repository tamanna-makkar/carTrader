export default function (value) {
    if (value !== null) {
        const formatter = new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        })
        return formatter.format(value)
    }
}