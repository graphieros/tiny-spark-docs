<script setup>
import { ref, computed } from "vue";
import { BrandGithubFilledIcon, TimelineIcon } from "vue-tabler-icons";
import { VueHiCode } from "vue-hi-code";
import "tiny-spark/dist/tiny-spark.umd";
import "vue-hi-code/style.css"

const codeConfig = ref({
  backgroundColor: 'rgb(210,210,210)',
  baseTextColor: '#1A1A1A',
  copyIconColor: '#1A1A1A',
})

function makeDs(n) {
  let arr = [];
  for(let i = 0; i < n; i += 1) {
    arr.push(Math.round(Math.random()*100));
  }
  return `[${arr.toString()}]`;
}

const dataset = ref(makeDs(12));
const dates = ref('["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]')

const installContent = ref(`npm i tiny-spark`);
const setupContent = ref(`import "tiny-spark/dist/tiny-spark.umd"`);
const codeContent = ref(`
<div class="p-6 bg-app-bg-grey w-full max-w-[600px] mx-auto resize overflow-auto">
  <div class="w-full h-full mx-auto">
    <div 
      class="tiny-spark" 
      data-curve="true"
      data-animation="true"
      data-line-color="#4A4A4A"
      data-area-color="#1A1A1A10"
      data-line-thickness="3"
      data-responsive
      data-plot-color="#2A2A2A"
      data-plot-radius="3"
      data-number-locale="en-US"
      data-number-rounding="2"
      data-indicator-color="#8A8A8A"
      data-indicator-width="1"
      data-set="${dataset.value}"
      data-dates='${dates.value}'
    />
  </div>
</div>`
);

const cssContent = ref(`
/** the chart container (div element) */
.tiny-spark {
}

/** the tooltip (div element), just display:none if you don't need it */
.tiny-spark-tooltip {
  background: rgba(240,240,240, 0.9);
  border-radius: 2px;
  box-shadow: 0 6px 3px -3px rgba(0,0,0,0.2);
  padding: 0 8px;
}

/** the indicator (svg line element) */
.tiny-spark-indicator {
  /** for example: customize stroke-dasharray */
}

/** the plots (svg circle element) */
.tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}

/** the chart line (svg path element) */
.tiny-spark-line-path {
}

/** the chart area (svg path element) */
.tiny-spark-line-area {
}
`)

</script>

<template>
  <main class="w-full mx-auto max-w-[1200px] px-6">
    <header class="flex flex-row justify-between place-items-center pt-12 pb-2">
      <div class="text-4xl flex flex-row gap-2 place-items-end">
        <div class="flex flex-row place-items-center gap-2">
            <TimelineIcon class="text-red-100"/>
            tiny-spark 
        </div>
        <small class="text-sm text-gray-700">v0.1.0</small>
      </div>
      <a class="p-1 bg-red-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank">
        <BrandGithubFilledIcon/>
      </a>
    </header>

    <h1 class="pl-8 mb-12 max-w-[32ch] text-gray-700">An elegant, reactive and responsive sparkline chart solution without dependency.</h1>

    <div class="w-full max-w-[220px] mx-auto mb-12">
      <VueHiCode
        :content="installContent"
        v-bind="codeConfig"
        language="javascript"
      />
    </div>
    <div class="w-full max-w-[600px] mx-auto mb-12">
      <VueHiCode
        :content="setupContent"
        v-bind="{
          ...codeConfig,
          backgroundColor: '#2A2A2A',
          copyIconColor: '#8A8A8A'
        }"
        language="javascript"
      />
    </div>

    <section>
      <div class="p-6 bg-app-bg-grey w-full max-w-[600px] mx-auto resize overflow-auto">
        <div class="w-full h-full mx-auto">
          <div 
            class="tiny-spark" 
            data-curve="true"
            data-animation="true"
            data-line-color="#4A4A4A"
            data-area-color="#1A1A1A10"
            data-line-thickness="3"
            data-responsive
            data-plot-color="#2A2A2A"
            data-plot-radius="3"
            data-number-locale="en-US"
            data-number-rounding="2"
            data-indicator-color="#8A8A8A"
            data-indicator-width="1"
            :data-set="dataset"
            :data-dates="dates"
          />
        </div>
      </div>
      <div class="w-full mx-auto max-w-[600px] flex flex-col place-items-center justify-center mt-6">
        The chart is responsive. Try resizing the container.<br>
        The chart is reactive. Dynamic change in data attributes will update the chart.<br>Try it out:
        <button class="bg-app-bg-grey py-1 px-4 rounded hover:shadow" @click="dataset = makeDs(12)">Random data</button>
      </div>
    </section>

    <div class="w-full mx-auto my-12">
      <VueHiCode
        :content="codeContent"
        v-bind="{
          backgroundColor: '#2A2A2A',
          copyIconColor: '#8A8A8A'
        }"
        language="html"
      />
    </div>

    <div class="w-full mx-auto my-12">
      <h2 class="mb-6 text-xl">tiny-spark is <strong>headless</strong>. Target the following css classes to customize your chart. Here is an example:</h2>
      <VueHiCode
        :content="cssContent"
        v-bind="{
          backgroundColor: '#2A2A2A',
          copyIconColor: '#8A8A8A'
        }"
        language="css"
      />
    </div>
  </main>
</template>

<style>
.tiny-spark-tooltip {
  background: rgba(240,240,240, 0.9);
  border-radius: 2px;
  box-shadow: 0 6px 3px -3px rgba(0,0,0,0.2);
  padding: 0 8px;
}

.tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}
</style>
