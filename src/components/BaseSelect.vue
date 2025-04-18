<template>
    <div class="custom-select" ref="selectRef">
        <button type="button" class="select-trigger" @click="toggle" :aria-expanded="isOpen" ref="triggerButton">
            <span class="selected-value">{{ selectedLabel }}</span>
            <ChevronDownIcon class="arrow dark:text-red-200" :size="16" :data-open="isOpen" />
        </button>
        <transition name="fade">
            <ul v-if="isOpen" class="options-list">
                <li v-for="(opt, idx) in options" :key="idx" class="option-item" :data-selected="opt === selected" @click="selectOption(opt)">
                    <CheckIcon v-if="opt === selected" class="text-gray-600" :size="20"/>
                    <CheckIcon v-else class="text-transparent" :size="20"/>
                    {{ opt }}
                </li>
            </ul>
        </transition>
    </div>
    <Tooltip :target="triggerButton">
        <slot name="tooltip"/>
    </Tooltip>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, PropType } from "vue";
import Tooltip from "./Tooltip.vue";
import { CheckIcon, ChevronDownIcon } from "vue-tabler-icons";

type Option = string | number;

const selected = defineModel("modelValue", {
    type: [String, Number] as PropType<Option>,
    default: null as Option | null,
});

const props = defineProps<{ options: Option[], tooltip?: boolean}>();
const { options, tooltip = false } = props;

const emit = defineEmits(['change'])

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const triggerButton = ref(null)

const selectedLabel = computed(() =>
    selected.value !== null ? String(selected.value) : "Select..."
);

function toggle() {
    isOpen.value = !isOpen.value;
}

function selectOption(opt: Option) {
    selected.value = opt;
    emit('change');
}

function onClickOutside(event: MouseEvent) {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onClickOutside);
});
</script>

<style scoped>
.custom-select {
    position: relative;
    display: inline-block;
    width: 100%;
}

.select-trigger {
    width: 100%;
    padding: 0 0.5em;
    text-align: left;
    border-radius: 0.25em;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

html.light .select-trigger {
    background-color: #FEE2E230;
    border: 1px solid #FEE2E2;
    color: #1A1A1A;
}
html.dark .select-trigger {
    background: #FEE2E230;
    border: 1px solid #FEE2E250;
    color: #FEE2E2;
}

.arrow {
    transition: transform 0.2s;
}

.arrow[data-open="true"] {
    transform: rotate(180deg);
}

.options-list {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 100%;
    border-radius: 0.25em;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
}

.options-list {
    background: #FEE2E2;
    color: #1A1A1A;
}

.option-item {
    padding: 0.3em 0.5em;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items:center;
    gap: 0.3em;
}

.option-item[data-selected="false"]:hover {
    background-color: #fbd2d2;
}

.option-item[data-selected="true"] {
    background-color:  #fdc3c3;
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
