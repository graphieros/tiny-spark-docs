<template>
    <svg :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="xMidYMid" :style="svgStyles">
        <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" :stop-color="isDarkMode ? '#99f6e410' : '#4A4A4A'" />
            <stop offset="1" stop-color="#99f6e480" />
        </linearGradient>
        <g>
            <path v-for="(d, i) in wavePaths" :key="i" :d="d" :fill="`url(#${gradId})`" opacity="0.5" />
        </g>
    </svg>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
    gradId: {
        type: String,
        default: ''
    },
    reversed: {
        type: Boolean,
        default: false
    },
    isDarkMode: {
        type: Boolean,
        default: false,
    }
})

const svgStyles = computed(() => ({
    shapeRendering: 'auto',
    display: 'block',
    background: 'transparent',
    transform: props.reversed ? 'rotate(-180deg)' : 'none'
}))

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
function handleResize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
}
window.addEventListener('resize', handleResize)
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

const waves = ref([
    { amplitude: 50, frequency: 0.005, phase: 0 },
    { amplitude: 30, frequency: 0.0045, phase: Math.PI / 2 },
    { amplitude: 100, frequency: 0.0025, phase: Math.PI / 5 }
])

const wavePaths = ref([])

function buildWavePath(w, h, amplitude, frequency, phase) {
    const segments = 20
    const segmentStep = h / segments
    let d = `M 0,0 L ${w} -500`
    for (let i = 1; i < segments; i += 1) {
        const y = i * segmentStep
        const controlY = y - segmentStep / 2
        const controlX = w + amplitude * Math.sin(frequency * controlY + phase)
        const endX = w + amplitude * Math.sin(frequency * y + phase)
        d += ` Q ${controlX.toFixed(2)} ${controlY.toFixed(2)}, ${endX.toFixed(2)} ${y.toFixed(2)}`
    }
    const finalControlY = height.value + 100
    const finalControlX = w + amplitude * Math.sin(frequency * finalControlY + phase)
    d += ` Q ${finalControlX.toFixed(2)} ${finalControlY.toFixed(2)}, 0 ${h} Z`
    return d.replace(/\s+/g, ' ')
}

let animationId
function animate() {
    const w = width.value * 0.1
    const h = height.value

    const newPaths = []
    for (let i = 0; i < waves.value.length; i++) {
        const wave = waves.value[i]
        wave.phase += Math.random() / 150
        const pathD = buildWavePath(w, h, wave.amplitude, wave.frequency, wave.phase)
        newPaths.push(pathD)
    }
    wavePaths.value = newPaths
    animationId = requestAnimationFrame(animate)
}

onMounted(() => {
    animationId = requestAnimationFrame(animate)
})
onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId)
})

</script>

<style scoped>
svg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
}
</style>