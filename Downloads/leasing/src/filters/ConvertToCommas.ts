export default function (value) {
    if (value !== null) {
        return value.toString().replace('.', ',')
    } else {
        return value
    }
}