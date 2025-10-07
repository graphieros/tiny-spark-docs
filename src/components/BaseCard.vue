<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    type: {
        type: String,
        default: 'medium',
    },
    rounding: {
        type: String,
        default: 'rounded-2xl'
    },
    borderRight: {
        type: String,
        default: ''
    },
    padding: {
        type: String,
        default: 'p-4'
    },
    glassed: {
        type: Boolean,
        default: false
    },
    funky: {
        type: Boolean,
        default: false,
    }
});

const background = computed(() => {
    if (props.funky) {
        return 'bg-gradient-to-br from-app-bg-grey to-teal-100 dark:from-[rgb(40,30,30)] dark:to-[rgb(30,40,40)]'
    }
    if (props.type === 'light') {
        return 'bg-gray-50 dark:bg-[#3A3A3A]'
    }
    if (props.type === 'medium') {
        return 'bg-gray-100 dark:bg-[#2A2A2A]'
    }
    if (props.type === 'dark') {
        return 'bg-gray-200 dark:bg-[#242424]'
    }
    return ''
})

</script>

<template>
    <div :class="`
        ${background}
        ${padding}
        ${rounding}
        ${borderRight}
        ${glassed ? 'glassed' : ''}
        shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)]
        `"
    >
        <slot/>
    </div>
</template>

<style scoped>
.glassed {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
</style>