<script setup>
import { ref, computed, onMounted } from "vue";
import { BrandGithubFilledIcon, BrandJavascriptIcon, BrandReactIcon, BrandSvelteIcon, BrandVueIcon, RefreshIcon, SettingsIcon, StarFilledIcon } from "vue-tabler-icons";
import { VueHiCode } from "vue-hi-code";
import { render, tinyFormat } from "tiny-spark";
import "vue-hi-code/style.css"
import pack from "../package.json";
import TinySparkLogo from "./components/TinySparkLogo.vue";
import Waves from "./components/Waves.vue";
import ButtonLink from "./components/ButtonLink.vue";

const version = computed(() => `v${pack.dependencies['tiny-spark'].replace('^', '')}`);

const codeConfig = ref({
  backgroundColor: 'rgb(210,210,210)',
  baseTextColor: '#1A1A1A',
  copyIconColor: '#1A1A1A',
})

function makeDs(n) {
  let arr = [];
  for(let i = 0; i < n; i += 1) {
    arr.push(Math.round(Math.random() * 10000) / 100);
  }
  return tinyFormat(arr);
}

function makeDates(count) {
  const dates = [];
  const today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();

  for (let i = 0; i < count; i += 1) {
    const currentMonth = (month + i) % 12;
    const currentYear = year + Math.floor((month + i) / 12);
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedYear = String(currentYear).slice(-2);
    dates.push(`${formattedMonth}-${formattedYear}`);
  }

  return tinyFormat(dates);
}

const initConfig = ref({
  dataCurve: 'true',
  dataAnimation: 'true',
  dataLineColor: '#4A4A4A',
  dataAreaColor: '#FEE2E230',
  dataLineThickness: 3,
  dataPlotColor: '#2A2A2A',
  dataPlotRadius: 3,
  dataHidePlotsAbove: 100,
  dataNumberRounding: 2,
  dataIndicatorColor: '#8A8A8A',
  dataIndicatorWidth: 1,
  area: true
});

const config = ref({
  dataCurve: 'true',
  dataAnimation: 'true',
  dataLineColor: '#4A4A4A',
  dataAreaColor: '#FEE2E230',
  dataLineThickness: 3,
  dataPlotColor: '#2A2A2A',
  dataPlotRadius: 3,
  dataHidePlotsAbove: 100,
  dataNumberRounding: 2,
  dataIndicatorColor: '#8A8A8A',
  dataIndicatorWidth: 1,
  area: true
});

function resetConfig() {
  config.value = {...initConfig.value}
}

function setArea(e) {
  config.value.dataAreaColor = e.target.value === 'true' ? '#FEE2E230' : undefined
}

const dataset = ref(makeDs(12));
const dates = ref(makeDates(12));

const installContentNPM = ref(`npm i tiny-spark`);
const installContentYARN = ref(`yarn add tiny-spark`);
const installContentPNPM = ref(`pnpm add tiny-spark`);
const installContentBUN = ref(`bun add tiny-spark`);
const setupContent = ref(`
import { render } from "tiny-spark";

// Call it immediately after the DOM is ready. 
// If your dataset is hardcoded, call it immediately:

render();

// Or call it after a fetch:

fetchData().then(render);

// You can also call render again later to re-trigger the animation (if data-animation is set to "true")
`);
const codeContent = computed(() => {
  return `
<div class="p-6 bg-app-bg-grey w-full max-w-[600px] min-w-[100px] min-h-[100px] mx-auto resize overflow-auto">
  <div class="w-full h-full mx-auto">
    <div 
      class="tiny-spark" 
      data-curve="${config.value.dataCurve}"
      data-animation="${config.value.dataAnimation}"
      data-line-color="${config.value.dataLineColor}"
      data-area-color="${config.value.dataAreaColor}"
      data-line-thickness="${config.value.dataLineThickness}"
      data-responsive
      data-plot-color="${config.value.dataPlotColor}"
      data-plot-radius="${config.value.dataPlotRadius}"
      data-hide-plots-above="${config.value.dataHidePlotsAbove}"
      data-number-locale="en-US"
      data-number-rounding="${config.value.dataNumberRounding}"
      data-indicator-color="${config.value.dataIndicatorColor}"
      data-indicator-width="${config.value.dataIndicatorWidth}"
      data-set="${dataset.value}"
      data-dates='${dates.value}'
    />
  </div>
</div>`
})

const tinyFormatContent = ref(`
import { render, tinyFormat } from "tiny-spark";

const data = [1, 2, 3, 5, 8];
const dates = ['01-2026', '02-2026', '03-2026', '04-2026', '05-2026'];

// Formatted as strings to be passed to the component
const formattedData = tinyFormat(data);
const formattedDates = tinyFormat(dates);
`)

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
  transform: translateY(-12px);
}

/* You can add an arrow on the bottom of the tooltip */
.tiny-spark-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(240,240,240, 0.9);
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

const start = ref("2025-04-06");
const lastDate = ref(new Date(Date.now()));

const end = computed(() => {
    const day = lastDate.value.getDate();
    const month = lastDate.value.getMonth() + 1;
    const year = lastDate.value.getFullYear();
    return `${year}-${String(month).length === 1 ? `0${month}` : month}-${String(day).length === 1 ? `0${day}` : day}`;
});

const url_downloads = computed(() => {
    return `https://api.npmjs.org/downloads/range/${start.value}:${end.value}/tiny-spark`;
});

const data = ref([{ period: "", value: 0 }])
const downloads = ref([]);
const stars = ref(0);
const history = ref({
  dataset: [],
  dates: []
});

onMounted(() => {
    fetch(url_downloads.value, {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    })
        .then((response) => {
            return response.json();
        })
        .then(json => {
            downloads.value = json.downloads;
            data.value = json.downloads.map(d => {
                return {
                    period: d.day,
                    value: d.downloads
                }
            }).slice(-90, -1);
            history.value = {
              dataset: tinyFormat(data.value.map(d => d.value)),
              dates: tinyFormat(data.value.map(d => d.period))
            }
        })
        .catch(err => {
            data.value = [{ period: "", value: 0 }]
        }).finally(() => {
          render();
        })

    fetch(`https://api.github.com/repos/graphieros/tiny-spark`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            stars.value = data.stargazers_count;
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        })
});

</script>

<template>
  <div class="bg-layer">
    <Waves gradId="grad1"/>

  </div>
  <main class="w-full mx-auto max-w-[1200px] px-6">
    <header class="flex flex-row justify-between place-items-center pt-12 pb-2 pr-6">
      <div class="text-4xl flex flex-row gap-2 place-items-end">
        <div class="flex flex-row place-items-center gap-2">
          <TinySparkLogo :size="29"/>
            tiny-spark 
        </div>
        <small class="text-sm text-gray-700 bg-red-100 px-2 rounded-full -translate-y-1">{{ version }}</small>
      </div>
      <a class="relative p-1 bg-red-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank">
        <BrandGithubFilledIcon/>
        <div class="absolute top-0 pl-1 left-[100%] text-xs flex flex-row place-items-center gap-0.5">
            <StarFilledIcon :size="16" class="text-red-100"/> <span v-if="stars">{{ stars }}</span>
          </div>
      </a>
    </header>

    <h1 class="pl-8 mb-12 max-w-[32ch] text-gray-700">An elegant, reactive and responsive sparkline chart solution without dependency.</h1>

    <div class="w-full flex flex-row gap-2 flex-wrap justify-center mb-12">
      <div class="w-[200px]">
        <VueHiCode
          :content="installContentNPM"
          v-bind="{
            ...codeConfig,
            fontSize: '0.9rem'
            }"
          language="javascript"
        />
      </div>
      <div class="w-[225px]">
        <VueHiCode
          :content="installContentYARN"
          v-bind="{
            ...codeConfig,
            fontSize: '0.9rem'
            }"
          language="javascript"
        />
      </div>
      <div class="w-[225px]">
        <VueHiCode
          :content="installContentPNPM"
          v-bind="{
            ...codeConfig,
            fontSize: '0.9rem'
            }"
          language="javascript"
        />
      </div>
      <div class="w-[220px]">
        <VueHiCode
          :content="installContentBUN"
          v-bind="{
            ...codeConfig,
            fontSize: '0.9rem'
            }"
          language="javascript"
        />
      </div>
    </div>

    <div class="w-full max-w-[600px] mx-auto mb-12">
      <VueHiCode
        :content="setupContent"
        v-bind="{
          ...codeConfig,
          backgroundColor: '#2A2A2A',
          copyIconColor: '#8A8A8A',
          baseTextColor: '#CCCCCC',
          title: 'JS'
        }"
        language="javascript"
      />
    </div>

    <section>
      <div class="relative p-6 bg-app-grey w-full h-[200px] max-w-[600px] min-w-[100px] min-h-[100px] mx-auto resize border border-red-100 border-dashed overflow-auto">
        <div class="w-full h-full mx-auto">
          <div 
            class="tiny-spark" 
            :data-curve="config.dataCurve"
            :data-animation="config.dataAnimation"
            :data-line-color="config.dataLineColor"
            :data-area-color="config.dataAreaColor"
            :data-line-thickness="config.dataLineThickness"
            data-responsive
            :data-plot-color="config.dataPlotColor"
            :data-plot-radius="config.dataPlotRadius"
            :data-hide-plots-above="config.dataHidePlotsAbove"
            data-number-locale="en-US"
            :data-number-rounding="config.dataNumberRounding"
            :data-indicator-color="config.dataIndicatorColor"
            :data-indicator-width="config.dataIndicatorWidth"
            :data-set="dataset"
            :data-dates="dates"
          />
        </div>
        <div class="absolute bottom-1 right-5 pointer-events-none select-none text-xs flex flex-row place-items-center gap-1">
          resize
        </div>
        <div class="absolute bottom-0 right-0 h-[12px] w-[12px] bg-red-100 pointer-events-none select-none"/>
      </div>
      <div class="w-full mx-auto max-w-[600px] flex flex-col place-items-center justify-center mt-6 text-lg">
        <span>
          The chart is <strong>responsive</strong>. Try resizing the container.<br>
          The chart is <strong>reactive</strong>. Dynamic change in data attributes will trigger an update. Try it out:
        </span>
        <button class="flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-red-100 py-1 px-4 rounded hover:from-red-100 hover:to-app-bg-grey hover:shadow transition-all" @click="dataset = makeDs(12)"><RefreshIcon class="text-gray-800"/> Random data</button>
      </div>

      <fieldset class="border border-solid border-red-100 p-5 rounded mt-6 flex flex-row gap-4 flex-wrap bg-[#FFFFFF20]">
        <legend class="px-2 flex flex-row gap-2"><SettingsIcon class="text-red-100"/> <strong>Configuration options</strong></legend>
        <label class="flex flex-col">
          <code>data-curve</code>
          <select v-model="config.dataCurve"><option>true</option><option>false</option></select>
        </label>

        <label class="flex flex-col">
          <code>data-animation</code>
          <select v-model="config.dataAnimation" @change="render()"><option>true</option><option>false</option></select>
        </label>
        
        <label class="flex flex-col">
          <code>data-line-color</code>
          <input type="color" v-model="config.dataLineColor"/>
        </label>
        
        <label class="flex flex-col">
          <code>data-area-color</code>
          <input type="color" v-model="config.dataAreaColor"/>
        </label>

        <label class="flex flex-col">
          (show area)
          <input class="accent-red-100" type="checkbox" v-model="config.area" :value="config.area" @change="setArea"/>
        </label>

        <label class="flex flex-col">
          <code>data-line-thickness</code>
          <input type="number" v-model="config.dataLineThickness" :min="1" :max="12"/>
        </label>

        <label class="flex flex-col">
          <code>data-plot-color</code>
          <input type="color" v-model="config.dataPlotColor"/>
        </label>

        <label class="flex flex-col">
          <code>data-plot-radius</code>
          <input type="number" v-model="config.dataPlotRadius" :min="0"/>
        </label>

        <label class="flex flex-col">
          <code>data-hide-plots-above</code>
          <input type="number" v-model="config.dataHidePlotsAbove" :min="0"/>
        </label>

        <label class="flex flex-col">
          <code>data-number-rounding</code>
          <input type="number" v-model="config.dataNumberRounding" :min="0"/>
        </label>

        <label class="flex flex-col">
          <code>data-indicator-color</code>
          <input type="color" v-model="config.dataIndicatorColor"/>
        </label>

        <label class="flex flex-col">
          <code>data-indicator-width</code>
          <input type="number" v-model="config.dataIndicatorWidth" :min="0"/>
        </label>
      </fieldset>

      <button @click="resetConfig" class="flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-red-100 py-1 px-4 rounded hover:from-red-100 hover:to-app-bg-grey hover:shadow transition-all">RESET</button>
    </section>

    <div class="w-full mx-auto my-12">
      <VueHiCode
        :content="codeContent"
        v-bind="{
          backgroundColor: '#2A2A2A',
          copyIconColor: '#8A8A8A',
          title: 'HTML'
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
          copyIconColor: '#8A8A8A',
          title: 'CSS'
        }"
        language="css"
      />
    </div>


    <div class="w-full mx-auto my-12">
      <h2 class="mb-6 text-xl">If you are using tiny-spark in a framework, you can use the <strong><code>tinyFormat</code></strong> utility function to prepare the data passed to the <strong><code>data-set</code></strong> and <strong><code>data-dates</code></strong> attributes:</h2>
      <VueHiCode
        :content="tinyFormatContent"
        v-bind="{
          backgroundColor: '#2A2A2A',
          copyIconColor: '#8A8A8A',
          title: 'JS'
        }"
        language="javascript"
      />
    </div>

    <div class="flex flex-col place-items-center justify-center w-full mx-auto mb-12">
      <h2 class="text-xl mb-2">
        Play with tiny-spark on StackBlitz:
      </h2>
      <div class="w-full mx-auto flex flex-row gap-4 flex-wrap place-items-center justify-center">
        <ButtonLink title="Vanilla JS" link="https://stackblitz.com/edit/stackblitz-starters-hvpo2cd4?file=index.html">
          <BrandJavascriptIcon class="text-[#F0DB4F]"/>
        </ButtonLink>
        <ButtonLink title="React" link="https://stackblitz.com/edit/vitejs-vite-fkayxq4y?file=src%2FApp.jsx">
          <BrandReactIcon class="text-[#61DAFB]"/>
        </ButtonLink>
        <ButtonLink title="Vue" link="https://stackblitz.com/edit/vitejs-vite-lblowhxz?file=src%2FApp.vue">
          <BrandVueIcon class="text-[#41B883]"/>
        </ButtonLink>
        <ButtonLink title="Svelte" link="https://stackblitz.com/edit/vitejs-vite-4ezmsecw?file=src%2FApp.svelte">
          <BrandSvelteIcon class="text-[#FF3E00]"/>
        </ButtonLink>  
      </div>
    </div>

    <hr class="mb-12 border-red-100"/>

    <div class="p-2 bg-app-grey-light w-full max-w-[600px] mb-24 mx-auto">
      <div class="pl-2 text-xs">
        NPM downloads:
        <strong>{{ start }}</strong> to <strong>{{ data.at(-1).period }}</strong>
      </div>
      <div class="w-full max-w-[600px] h-[100px] mx-auto">
          <div class="mx-auto h-full">
            <div 
              class="tiny-spark" 
              data-curve="true"
              data-animation="true"
              data-line-color="#4A4A4A"
              data-area-color="#00FF0010"
              data-line-thickness="3"
              data-responsive
              data-plot-color="#2A2A2A"
              data-plot-radius="3"
              data-hide-plots-above="6"
              data-number-locale="en-US"
              data-number-rounding="0"
              data-indicator-color="#8A8A8A"
              data-indicator-width="1"
              :data-set="history.dataset"
              :data-dates="history.dates"
            />
          </div>
        </div>
    </div>
  </main>
  <footer class="flex flex-col justify-between place-items-center pb-12">
    <div class="flex flex-row place-items-center gap-2 text-2xl">
        <TinySparkLogo :size="29"/>
          tiny-spark
      </div>
      <div class="flex flex-row gap-2 place-items-center">
        <span class="text-sm">
          MIT license - {{ new Date().getFullYear() }}
      </span>
        <a class="relative p-1 bg-red-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank">
          <BrandGithubFilledIcon/>
          <div class="absolute top-0 pl-1 left-[100%] text-xs flex flex-row place-items-center gap-0.5">
            <StarFilledIcon :size="16" class="text-red-100"/> <span v-if="stars">{{ stars }}</span>
          </div>
        </a> 
      </div>
  </footer>
</template>

<style>
.tiny-spark-tooltip {
  background: rgba(240,240,240, 0.9);
  border-radius: 2px;
  box-shadow: 0 6px 3px -3px rgba(0,0,0,0.2);
  padding: 0 8px;
  transform: translateY(-12px);
}

.tiny-spark-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(240,240,240, 0.9);
}

.tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}

input, select {
  height: 1.5rem;
  padding: 0 6px;
  border-radius: 3px;
  background: #FEE2E230;
  border: 1px solid #FEE2E2;
}
</style>
