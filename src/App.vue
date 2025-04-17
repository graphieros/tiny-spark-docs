<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { AnalyzeFilledIcon, BrandGithubFilledIcon, BrandJavascriptIcon, BrandReactIcon, BrandSvelteIcon, BrandVueIcon, MoonIcon, RefreshIcon, SettingsIcon, StarFilledIcon, SunIcon } from "vue-tabler-icons";
import { VueHiCode } from "vue-hi-code";
import { render, tinyFormat } from "tiny-spark";
import "vue-hi-code/style.css"
import pack from "../package.json";
import TinySparkLogo from "./components/TinySparkLogo.vue";
import Waves from "./components/Waves.vue";
import ButtonLink from "./components/ButtonLink.vue";
import Tooltip from "./components/Tooltip.vue";

const isDarkMode = ref(false);

onMounted(() => {
  if(!localStorage.theme) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  } else {
    setTheme(localStorage.theme);
  }
})

function setTheme(theme) {
  if (localStorage.theme) {
    localStorage.theme = theme;
  } else {
    localStorage.setItem('theme', theme);
  }
  isDarkMode.value = localStorage.theme === 'dark';
  if (isDarkMode.value) {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
}

function toggleTheme() {
  setTheme(isDarkMode.value ? 'light' : 'dark');
  initConfig.value.dataLastValueColor = isDarkMode.value ? '#8A8A8A' : '#1A1A1A';
  config.value.dataLastValueColor = isDarkMode.value ? '#8A8A8A' : '#1A1A1A';
  nextTick(render);
}

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
  area: true,
  dataShowLastValue: 'true',
  dataLastValueFontSize: 12,
  dataLastValueColor: isDarkMode.value ? '#8A8A8A' : '#1A1A1A'
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
  area: true,
  dataShowLastValue: 'true',
  dataLastValueFontSize: 12,
  dataLastValueColor: isDarkMode.value ? '#8A8A8A' : '#1A1A1A'
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
      data-responsive
      data-set="${dataset.value}"
      data-dates='${dates.value}'
      data-curve="${config.value.dataCurve}"
      data-animation="${config.value.dataAnimation}"
      data-line-color="${config.value.dataLineColor}"
      data-area-color="${config.value.dataAreaColor}"
      data-line-thickness="${config.value.dataLineThickness}"
      data-plot-color="${config.value.dataPlotColor}"
      data-plot-radius="${config.value.dataPlotRadius}"
      data-hide-plots-above="${config.value.dataHidePlotsAbove}"
      data-number-locale="en-US"
      data-number-rounding="${config.value.dataNumberRounding}"
      data-indicator-color="${config.value.dataIndicatorColor}"
      data-indicator-width="${config.value.dataIndicatorWidth}"
      data-show-last-value="${config.value.dataShowLastValue}"
      data-last-value-font-size="${config.value.dataLastValueFontSize}"
      data-last-value-color="${config.value.dataLastValueColor}"
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
          initConfig.value.dataLastValueColor = isDarkMode.value ? '#8A8A8A' : '#1A1A1A';
          config.value.dataLastValueColor = isDarkMode.value ? '#8A8A8A' : '#1A1A1A';
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

const dataCurve = ref(null);
const dataAnimation = ref(null);
const dataLineColor = ref(null);
const dataAreaColor = ref(null);
const dataLineThickness = ref(null);
const dataPlotColor = ref(null);
const dataPlotRadius = ref(null);
const dataHidePlotsAbove = ref(null);
const dataNumberRounding = ref(null);
const dataIndicatorColor = ref(null);
const dataIndicatorWidth = ref(null);
const dataShowLastValue = ref(null);
const dataLastValueFontSize = ref(null);
const dataLastValueColor = ref(null);

</script>

<template>
  <div class="bg-layer">
    <Waves gradId="grad1"/>

  </div>
  <main class="w-full mx-auto max-w-[1200px] px-6">
    <header class="flex flex-row justify-between place-items-center pt-12 pb-2 pr-6">
      <div class="text-4xl flex flex-row gap-2 place-items-end">
        <div class="flex flex-row place-items-center gap-2 text-black dark:text-red-300">
          <TinySparkLogo :size="29"/>
            tiny-spark 
        </div>
        <small class="text-sm text-gray-700 bg-red-100 dark:bg-transparent dark:text-gray-500 dark:border dark:border-gray-700 px-2 rounded-full -translate-y-1">{{ version }}</small>
      </div>
      <div class="flex flex-row place-items-center gap-4">
        <button @click="toggleTheme">
          <SunIcon v-if="isDarkMode" class="text-red-300"/>
          <MoonIcon v-else/>
        </button>

        <a class="relative p-1 bg-red-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank">
          <BrandGithubFilledIcon/>
          <div class="absolute top-0 pl-1 left-[100%] text-xs flex flex-row place-items-center gap-0.5">
              <StarFilledIcon :size="16" class="text-red-100"/> <span v-if="stars" class="dark:text-red-300">{{ stars }}</span>
            </div>
        </a>
      </div>
    </header>

    <h1 class="pl-8 mb-12 max-w-[32ch] text-gray-700 dark:text-gray-500">An elegant, reactive and responsive sparkline chart solution without dependency.</h1>

    <div class="w-full flex flex-row gap-2 flex-wrap justify-center mb-12">
      <div class="w-[200px]">
        <VueHiCode
          :content="installContentNPM"
          v-bind="{
            ...codeConfig,
            backgroundColor: isDarkMode ? '#2A2A2A'  : 'rgb(210,210,210)',
            baseTextColor: isDarkMode ? '#8A8A8A' : '#1A1A1A',
            copyIconColor: isDarkMode ? '#5A5A5A' : '#8A8A8A',
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
            backgroundColor: isDarkMode ? '#2A2A2A'  : 'rgb(210,210,210)',
            baseTextColor: isDarkMode ? '#8A8A8A' : '#1A1A1A',
            copyIconColor: isDarkMode ? '#5A5A5A' : '#8A8A8A',
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
            backgroundColor: isDarkMode ? '#2A2A2A'  : 'rgb(210,210,210)',
            baseTextColor: isDarkMode ? '#8A8A8A' : '#1A1A1A',
            copyIconColor: isDarkMode ? '#5A5A5A' : '#8A8A8A',
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
            backgroundColor: isDarkMode ? '#2A2A2A'  : 'rgb(210,210,210)',
            baseTextColor: isDarkMode ? '#8A8A8A' : '#1A1A1A',
            copyIconColor: isDarkMode ? '#5A5A5A' : '#8A8A8A',
            fontSize: '0.9rem'
            }"
          language="javascript"
        />
      </div>
    </div>

    <div class="w-full max-w-[600px] mx-auto mb-12 dark:border dark:border-gray-700 dark:rounded-md bg-gradient-to-r from-[#FFFFFF10] to-transparent p-6">
      <VueHiCode
        :content="setupContent"
        v-bind="{
          ...codeConfig,
          backgroundColor: isDarkMode ? 'transparent' : '#2A2A2A',
          copyIconColor: '#8A8A8A',
          baseTextColor: '#CCCCCC',
          title: 'JS'
        }"
        language="javascript"
      />
    </div>

    <section>
      <div class="relative p-6 bg-app-grey w-full h-[200px] max-w-[600px] min-w-[100px] min-h-[100px] mx-auto resize border border-red-100 dark:border-gray-600 border-dashed overflow-auto">
        <div class="showcase w-full h-full mx-auto">
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
            :data-show-last-value="config.dataShowLastValue"
            :data-last-value-font-size="config.dataLastValueFontSize"
            :data-last-value-color="config.dataLastValueColor"
          />
        </div>
        <div class="absolute bottom-1 right-5 pointer-events-none select-none text-xs flex flex-row place-items-center gap-1 dark:text-red-300">
          resize
        </div>
        <div class="absolute bottom-0 right-0 h-[12px] w-[12px] bg-red-100 dark:bg-red-300 pointer-events-none select-none"/>
      </div>
      <div class="w-full mx-auto max-w-[600px] flex flex-col place-items-center justify-center mt-6 text-lg">
        <span class="dark:text-gray-400">
          The chart is <strong>responsive</strong>. Try resizing the container.<br>
          The chart is <strong>reactive</strong>. Dynamic change in data attributes will trigger an update. Try it out:
        </span>
        <button class="flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-red-100 dark:from-[rgb(40,30,30)] dark:to-[rgb(30,40,40)] py-1 px-4 rounded hover:from-red-100 hover:to-app-bg-grey dark:hover:from-[rgb(30,40,40)] dark:hover:to-[rgb(40,30,30)] hover:shadow transition-all dark:text-red-300" @click="dataset = makeDs(12)"><AnalyzeFilledIcon class="text-gray-800 dark:text-red-300 animate-spin"/> Random data</button>
      </div>

      <fieldset class="border border-solid border-red-100 dark:border-transparent p-5 rounded mt-6 flex flex-row gap-4 flex-wrap bg-[#FFFFFF20]">
        <legend class="px-2 flex flex-row gap-2 dark:text-red-200"><SettingsIcon class="text-red-100"/> <strong>Configuration options</strong></legend>
        <label class="flex flex-col" ref="dataCurve">
          <code class="dark:text-red-200">data-curve</code>
          <select v-model="config.dataCurve"><option>true</option><option>false</option></select>
        </label>
        <Tooltip :target="dataCurve">
            Show the line as a curve (spline)
        </Tooltip>

        <label class="flex flex-col" ref="dataAnimation">
          <code class="dark:text-red-200">data-animation</code>
          <select v-model="config.dataAnimation" @change="render()"><option>true</option><option>false</option></select>
        </label>
        <Tooltip :target="dataAnimation">
            Animate the chart on load
        </Tooltip>
        
        <label class="flex flex-col">
          <code class="dark:text-red-200">data-line-color</code>
          <input type="color" v-model="config.dataLineColor" ref="dataLineColor"/>
        </label>
        <Tooltip :target="dataLineColor">
            Set the color of the line
        </Tooltip>
        
        <label class="flex flex-col">
          <code class="dark:text-red-200">data-area-color</code>
          <input type="color" v-model="config.dataAreaColor" ref="dataAreaColor"/>
        </label>
        <Tooltip :target="dataAreaColor">
            Set the color of the area
        </Tooltip>

        <label class="flex flex-col dark:text-red-200">
          (show area)
          <input class="accent-red-100" type="checkbox" v-model="config.area" :value="config.area" @change="setArea"/>
        </label>

        <label class="flex flex-col" ref="dataLineThickness">
          <code class="dark:text-red-200">data-line-thickness</code>
          <input type="number" v-model="config.dataLineThickness" :min="1" :max="12"/>
        </label>
        <Tooltip :target="dataLineThickness">
            Set the thickness of the line (stroke width)
        </Tooltip>

        <label class="flex flex-col">
          <code class="dark:text-red-200">data-plot-color</code>
          <input type="color" v-model="config.dataPlotColor" ref="dataPlotColor"/>
        </label>
        <Tooltip :target="dataPlotColor">
            Set the fill color of datapoint circles. To change the stroke color, use css (target the .tiny-spark-datapoint-circle css class)
        </Tooltip>

        <label class="flex flex-col" ref="dataPlotRadius">
          <code class="dark:text-red-200">data-plot-radius</code>
          <input type="number" v-model="config.dataPlotRadius" :min="0"/>
        </label>
        <Tooltip :target="dataPlotRadius">
            Set the radius of datapoint circles
        </Tooltip>

        <label class="flex flex-col" ref="dataHidePlotsAbove">
          <code class="dark:text-red-200">data-hide-plots-above</code>
          <input type="number" v-model="config.dataHidePlotsAbove" :min="0"/>
        </label>
        <Tooltip :target="dataHidePlotsAbove">
            Hide datapoint circles when the number of datapoints exceeds this number
        </Tooltip>
        
        <label class="flex flex-col" ref="dataNumberRounding">
          <code class="dark:text-red-200">data-number-rounding</code>
          <input type="number" v-model="config.dataNumberRounding" :min="0"/>
        </label>
        <Tooltip :target="dataNumberRounding">
            Set the number of decimals for data labels
        </Tooltip>
        
        <label class="flex flex-col">
          <code class="dark:text-red-200">data-indicator-color</code>
          <input type="color" v-model="config.dataIndicatorColor" ref="dataIndicatorColor"/>
        </label>
        <Tooltip :target="dataIndicatorColor">
            Set the stroke color of the indicator
        </Tooltip>
        
        <label class="flex flex-col" ref="dataIndicatorWidth">
          <code class="dark:text-red-200">data-indicator-width</code>
          <input type="number" v-model="config.dataIndicatorWidth" :min="0"/>
        </label>
        <Tooltip :target="dataIndicatorWidth">
            Set the stroke width of the indicator
        </Tooltip>
        
        <label class="flex flex-col" ref="dataShowLastValue">
          <code class="dark:text-red-200">data-show-last-value</code>
          <select v-model="config.dataShowLastValue"><option>true</option><option>false</option></select>
        </label>
        <Tooltip :target="dataShowLastValue">
            Show a data label for the last value
        </Tooltip>
        
        <label class="flex flex-col" ref="dataLastValueFontSize">
          <code class="dark:text-red-200">data-last-value-font-size</code>
          <input type="number" v-model="config.dataLastValueFontSize" :min="6"/>
        </label>
        <Tooltip :target="dataLastValueFontSize">
            Set the font size of the last value data label
        </Tooltip>
        
        <label class="flex flex-col">
          <code class="dark:text-red-200">data-last-value-color</code>
          <input type="color" v-model="config.dataLastValueColor" ref="dataLastValueColor"/>
        </label>
        <Tooltip :target="dataLastValueColor">
            Set the text color of the last value data label
        </Tooltip>
      </fieldset>

      <button @click="resetConfig" class="flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-red-100 dark:from-[rgb(40,30,30)] dark:to-[rgb(30,40,40)] py-1 px-4 rounded hover:from-red-100 hover:to-app-bg-grey dark:hover:from-[rgb(30,40,40)] dark:hover:to-[rgb(40,30,30)] hover:shadow transition-all dark:text-red-300">RESET</button>
    </section>

    <h2 class="mb-6 text-xl dark:text-gray-400 mt-12">
      To add a chart on your application, create a div with a <strong>"tiny-spark"</strong> class and <strong>data-attributes</strong>.<br>
      Except for <span class="border text-sm py-1 px-2 rounded-full"><code>data-set</code></span> all data-attributes are optional.<br>
      Dynamic change in data-attributes will automatically re-render the chart.
    </h2>
    <div class="w-full mx-auto my-12 dark:border dark:border-gray-700 dark:rounded-md bg-gradient-to-r from-[#FFFFFF10] to-transparent p-6">
      <VueHiCode
        :content="codeContent"
        v-bind="{
          backgroundColor: isDarkMode ? 'transparent' : '#2A2A2A',
          copyIconColor: '#8A8A8A',
          title: 'HTML'
        }"
        language="html"
      />
    </div>

    <h2 class="mb-6 text-xl dark:text-gray-400">tiny-spark is <strong>headless</strong>. Target the following css classes to customize your chart. Here is an example:</h2>
    <div class="w-full mx-auto my-12 dark:border dark:border-gray-700 dark:rounded-md bg-gradient-to-r from-[#FFFFFF10] to-transparent p-6">
      <VueHiCode
        :content="cssContent"
        v-bind="{
          backgroundColor: isDarkMode ? 'transparent' : '#2A2A2A',
          copyIconColor: '#8A8A8A',
          title: 'CSS'
        }"
        language="css"
      />
    </div>


    <h2 class="mb-6 text-xl dark:text-gray-400">If you are using tiny-spark in a framework, you can use the <strong><code>tinyFormat</code></strong> utility function to prepare the data passed to the <strong><code>data-set</code></strong> and <strong><code>data-dates</code></strong> attributes:</h2>
    <div class="w-full mx-auto my-12 dark:border dark:border-gray-700 dark:rounded-md bg-gradient-to-r from-[#FFFFFF10] to-transparent p-6">
      <VueHiCode
        :content="tinyFormatContent"
        v-bind="{
          backgroundColor: isDarkMode ? 'transparent' : '#2A2A2A',
          copyIconColor: '#8A8A8A',
          title: 'JS'
        }"
        language="javascript"
      />
    </div>

    <div class="flex flex-col place-items-center justify-center w-full mx-auto mb-12">
      <h2 class="text-xl mb-2 dark:text-gray-400">
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

    <hr class="mb-12 border-red-100 dark:border-gray-700"/>

    <div class="p-2 bg-app-grey-light w-full max-w-[600px] mb-24 mx-auto">
      <div class="pl-2 pb-4 text-xs dark:text-gray-400">
        NPM downloads:
        <strong>{{ start }}</strong> to <strong>{{ data.at(-1).period }}</strong>
      </div>
      <div class="w-full max-w-[600px] h-[100px] mx-auto">
          <div class="mx-auto h-full">
            <div 
              class="tiny-spark" 
              data-curve="true"
              data-animation="true"
              :data-line-color="isDarkMode ? '#FCA5A5' : '#4A4A4A'"
              :data-area-color="isDarkMode ? '#FCA5A510' : '#00FF0010'"
              data-line-thickness="2"
              data-responsive
              :data-plot-color="isDarkMode ? 'rgb(170,180,180)' : '#2A2A2A'"
              data-plot-radius="6"
              data-hide-plots-above="6"
              data-number-locale="en-US"
              data-number-rounding="0"
              :data-indicator-color="isDarkMode ? '#FCA5A540' : '#8A8A8A'"
              data-indicator-width="1"
              :data-set="history.dataset"
              :data-dates="history.dates"
              data-show-last-value="true"
              :data-last-value-color="isDarkMode ? '#FCA5A5' : '#4A4A4A'"
            />
          </div>
        </div>
    </div>
  </main>
  <footer class="flex flex-col justify-between place-items-center pb-12">
    <div class="flex flex-row place-items-center gap-2 text-2xl dark:text-red-300">
        <TinySparkLogo :size="29"/>
          tiny-spark
      </div>
      <div class="flex flex-row gap-2 place-items-center">
        <span class="text-sm dark:text-gray-600">
          MIT license - {{ new Date().getFullYear() }}
      </span>
        <a class="relative p-1 bg-red-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank">
          <BrandGithubFilledIcon/>
          <div class="absolute top-0 pl-1 left-[100%] text-xs flex flex-row place-items-center gap-0.5">
            <StarFilledIcon :size="16" class="text-red-100"/> <span v-if="stars" class="dark:text-red-300">{{ stars }}</span>
          </div>
        </a> 
      </div>
  </footer>
</template>

<style>
.tiny-spark-tooltip {
  background: radial-gradient(at top left, rgba(170,180,180, 0.9));
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
  border-top-color: rgba(170,180,180, 0.9);
}

html.light .tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}

html.dark .tiny-spark-datapoint-circle {
  stroke: #1A1A1A;
}

html.dark .showcase .tiny-spark-datapoint-circle {
  stroke: #8A8A8A;
}

html.light .showcase .tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}

input, select {
  height: 1.5rem;
  padding: 0 6px;
  border-radius: 3px;
}

html.light select{
  background: #FEE2E230;
  border: 1px solid #FEE2E2;
  color: #1A1A1A;
}

html.light input{
  background: #FEE2E230;
  border: 1px solid #FEE2E2;
  color: #1A1A1A;
}

html.dark select{
  background: #FEE2E230;
  border: 1px solid #FEE2E250;
  color: #FEE2E2;
}
html.dark input{
  background: #FEE2E230;
  border: 1px solid #FEE2E250;
  color: #FEE2E2;
}
</style>
