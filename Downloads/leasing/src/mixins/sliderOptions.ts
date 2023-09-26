import { ref } from "vue"

export default function () {
    const sliderDataOptions = ref({
        adsorb: true,
        height: 0,
        hideLabels: true,
        dotSize: 23,
        enableCross: false,
        railStyle: {
            'backgroundColor': '#C0C0C1',
            'borderRadius': '5px',
            'height': '2px'
        },
        dotStyle: {
            'border': '1px solid #2C00AB',
            'box-shadow': '1px 1px 10px rgba(44, 0, 171, 0.2)'
        },
        processStyle: {
            'backgroundColor': '#2C00AB',
            'height': '6px',
            'top': '-2px'
        },
        tooltipStyle: {
            'backgroundColor': 'transparent',
            'borderColor': 'transparent',
            'color': '#202020'
        }
    })
    return { sliderDataOptions }
}