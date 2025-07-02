<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    size: {
        type: Number,
        default: 24
    },
    color: {
        type: String,
        default: '#ccfbf1'
    },
    fill: {
        type: String,
        default: '#1A1A1A'
    },
    strokeWidth: {
        type: Number,
        default: 2
    }
})

</script>

<template>
    <div :style="{
        height: size + 'px',
        width: size + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }">
        <svg
            :style="{ width: '100%' }"
            viewBox="0 0 28 24"
        >
            <path
                d="M 4 18 L 9 10 L 16 20 L 24 5"
                :stroke="color"
                :stroke-width="strokeWidth"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <circle
                cx="4"
                cy="18"
                :r="strokeWidth"
                :fill="fill"
                :stroke="color"
                :stroke-width="strokeWidth"
            />
            <circle
                cx="9"
                cy="10"
                :r="strokeWidth"
                :fill="fill"
                :stroke="color"
                :stroke-width="strokeWidth"
            />
            <circle
                cx="16"
                cy="20"
                :r="strokeWidth"
                :fill="fill"
                :stroke="color"
                :stroke-width="strokeWidth"
            />
            <circle
                cx="24"
                cy="5"
                :r="strokeWidth"
                :fill="fill"
                :stroke="color"
                :stroke-width="strokeWidth"
            />
        </svg>
    </div>
</template>