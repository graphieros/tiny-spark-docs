<script setup lang="ts">
import { ref, computed, watch, toRefs, onBeforeUnmount } from 'vue'

const props = defineProps<{ target: HTMLElement | null }>()

const { target } = toRefs(props)

const show = ref(false)
function toggle(el, isShow) {
    position.value = el.getBoundingClientRect()
    show.value = isShow
}

const position = ref({ top: 0, left: 0, width: 0, height: 0 })

watch(target, (el, prevEl) => {
    if (prevEl) {
        prevEl.removeEventListener('mouseenter', () => toggle(el, true))
        prevEl.removeEventListener('mouseleave', () => toggle(el, false))
        prevEl.removeEventListener('click', () => toggle(el, false))
    }

    if (el) {
        el.addEventListener('mouseenter', () => toggle(el, true))
        el.addEventListener('mouseleave', () => toggle(el, false))
        el.addEventListener('click', () => toggle(el, false))
        position.value = el.getBoundingClientRect()
    }
}, { immediate: true, deep: true })

onBeforeUnmount(() => {
    if (target.value) {
        target.value.removeEventListener('mouseenter', () => toggle(target.value, true))
        target.value.removeEventListener('mouseleave', () => toggle(target.value, false))
        target.value.removeEventListener('click', () => toggle(target.value, false))

    }
})

</script>

<template>
    <transition name="fade">
        <div v-if="show" :style="{
            position: 'fixed',
            top: position.top + position.height + 12 + 'px',
            left: position.left + position.width / 2 - 100 + 'px',
            pointerEvents: 'none'
        }" class="tooltip w-[200px] bg-red-100 text-black text-xs py-2 px-2 text-center shadow-md">
            <slot />
        </div>
    </transition>
</template>

<style scoped>
.tooltip {
    position: relative;
    border-radius: 4px;
}

.tooltip::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid white;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
}

html.dark .tooltip::before {
    border-bottom: 6px solid #FEE2E2;
}

html.light .tooltip::before {
    border-bottom: 6px solid #FEE2E2;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(1, 0) translateY(-50%);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: scale(1, 1) translateY(0);
}
</style>