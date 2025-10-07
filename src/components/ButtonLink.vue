<script setup>

defineProps({
    title: { type: String, default: '' },
    link: { type: String, default: '' }
})


</script>

<template>
    <button class="flex flex-row gap-2 place-items-center bg-gradient-to-br text-[#CCCCCC] from-[#3A3A3A] to-[#1A1A1A] py-2 px-5 rounded hover:from-[#1A1A1A] hover:to-[#3A3A3A] transition-all shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)]">
        <a class="flex flex-row place-items-center gap-1" :href="link" target="_blank">
        <slot/>
        {{ title }}
        </a>
    </button>
</template>