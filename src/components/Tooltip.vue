<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, unref } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
    target: HTMLElement | Ref<HTMLElement | null> | null
}>()

const isVisible = ref(false)
const tooltipStyles = ref<Record<string, string>>({
    top: '0px',
    left: '0px',
})

function updatePosition(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    tooltipStyles.value.top = `${rect.bottom + 8}px`
    tooltipStyles.value.left = `${rect.left + rect.width / 2}px`
}

function showTooltip() {
    const el = unref(props.target)
    if (!(el instanceof HTMLElement)) return
    updatePosition(el)
    isVisible.value = true
}

function hideTooltip() {
    isVisible.value = false
}

let scrollHandler: () => void
let resizeHandler: () => void

watch(
    () => props.target,
    (newEl, oldEl) => {
        const prev = unref(oldEl)
        if (prev instanceof HTMLElement) {
            prev.removeEventListener('mouseenter', showTooltip)
            prev.removeEventListener('mouseleave', hideTooltip)
            prev.removeEventListener('click', hideTooltip)
        }

        const curr = unref(newEl)
        if (curr instanceof HTMLElement) {
            curr.addEventListener('mouseenter', showTooltip)
            curr.addEventListener('mouseleave', hideTooltip)
            curr.addEventListener('click', hideTooltip)
        }
    },
    { immediate: true }
)

onMounted(() => {
    scrollHandler = () => {
        const el = unref(props.target)
        if (isVisible.value && el instanceof HTMLElement) {
            updatePosition(el)
        }
    }
    resizeHandler = scrollHandler

    window.addEventListener('scroll', scrollHandler, true)
    window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
    const el = unref(props.target)
    if (el instanceof HTMLElement) {
        el.removeEventListener('mouseenter', showTooltip)
        el.removeEventListener('mouseleave', hideTooltip)
        el.removeEventListener('click', hideTooltip)
    }
    window.removeEventListener('scroll', scrollHandler, true)
    window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="isVisible" class="tooltip-content" :style="tooltipStyles">
                <slot />
                <div class="tooltip-arrow"></div>
            </div>
        </transition>
    </teleport>
</template>

<style scoped>
.tooltip-content {
    background-color: #ccfbf1;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #000;
    font-size: 0.75rem;
    max-width: 200px;
    padding: 0.5rem 0.75rem;
    pointer-events: none;
    position: fixed;
    transform: translateX(-50%);
    white-space: normal;
    word-wrap: break-word;
    z-index: 1000;
}

.tooltip-arrow {
    background-color: #ccfbf1;
    height: 8px;
    left: 50%;
    position: absolute;
    top: -4px;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) scale(1, 0) translateY(-50%);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateX(-50%) scale(1, 1) translateY(0);
}
</style>
