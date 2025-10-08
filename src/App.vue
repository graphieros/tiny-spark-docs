<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { AnalyzeFilledIcon, BrandCss3Icon, BrandGithubFilledIcon, BrandHtml5Icon, BrandJavascriptIcon, BrandReactIcon, BrandSvelteIcon, BrandVueIcon, CheckIcon, CopyIcon, DeviceFloppyIcon, MoonIcon, PlayerPlayFilledIcon, RadioactiveFilledIcon, RefreshIcon, SettingsIcon, StarFilledIcon, SunIcon, TimelineIcon } from "vue-tabler-icons";
import { VueHiCode } from "vue-hi-code";
import { render, tinyFormat } from "tiny-spark";
import "vue-hi-code/style.css"
import pack from "../package.json";
import TinySparkLogo from "./components/TinySparkLogo.vue";
import Waves from "./components/Waves.vue";
import ButtonLink from "./components/ButtonLink.vue";
import Tooltip from "./components/Tooltip.vue";
import BaseSelect from "./components/BaseSelect.vue";
import IconJs from "./components/IconJs.vue";
import IconHtml from "./components/IconHtml.vue";
import IconCss from "./components/IconCss.vue";
import { targetHighlight, targetHide, applyStepListeners } from "target-highlight";
import BaseCard from "./components/BaseCard.vue";

const isDarkMode = ref(false);
const isCopy = ref(false);

const to = ref(null);
const step = ref(-1);

const js = ref(null)

const tourOptions = computed(() => {
  return {
    overlayZIndex: 1,
    overlayColor: 'rgba(0,0,0,0.5)',
    nextCallback: nextStep,
    previousCallback: previousStep,
    stopCallback: ()  => {
      step.value = -1;
      targetHide()
    },
    borderWidth: 3,
    borderColor: '#14b8a6',
    padding: '12px',
    scrollToTarget: {
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    }
  }
})

onMounted(() => {
  document.title = `tiny-spark ${version.value}`;
})

const wto = ref(null);

const icon = {
  chevronRight: `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z" />
</svg>`,
  chevronLeft: `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
<path d="M20 15h-8v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1z" />
</svg>`,
  stop: `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>`
}

const tourContent = ref([
  {
    tooltip: '<div class="stepper">Step 1</div> Install <b>tiny-spark</b> using your preferred package manager',
    forceTooltipPosition: 'top',
    borderRadius: 24
  },
  {
    tooltip: '<div class="stepper">Step 2</div> Import the <code><b>render</b></code> function from "tiny-spark"',
    forceTooltipPosition: 'right',
    borderRadius: 24
  },
  {
    tooltip: '<div class="stepper">Step 3</div> Set up the required <b>tiny-spark</b> class and <b>data-set</b> data-attribute, and optional data attributes to customize the looks of your chart"',
    forceTooltipPosition: 'left',
    borderRadius: 24
  },
  {
    tooltip: '<div class="stepper">Step 4</div> Tweak these knobs to quickly reach your preferred configuration',
    forceTooltipPosition: 'top',
    borderRadius: 24
  },
  {
    tooltip: '<div class="stepper">Step 5</div> Add your css implementation to customize the looks of the tooltip',
    forceTooltipPosition: 'right',
    borderRadius: 24
  },
  {
    tooltip: '<div class="stepper">Step 6</div> This is how it looks!',
    forceTooltipPosition: 'top',
    borderRadius: 24
  },
  {
    tooltip: 'Drop a star if you like it :)',
    forceTooltipPosition: 'left',
    padding: '4px',
    borderRadius: 40
  }
])

const maxStep = computed(() => tourContent.value.length);

watch(() => step.value, (v) => {
  if (v === - 1) return
  targetHighlight(`[data-step="${step.value}"]`, {
    ...tourOptions.value,
    ...tourContent.value[step.value],
    tooltip: () => {
      return `
      <div style="position:relative; padding: 0 12px">
        ${tourContent.value[step.value].tooltip}
      </div>
      <div style="position: relative; height: 36px; border-top: 1px solid #14b8a6; padding-top: 12px; margin-top: 12px;">
        <button ${step.value === 0 ? 'disabled' : ''} id="target-highlight-button-previous" style="${step.value === 0 ? 'opacity: 0.3;' : ''} position: absolute; top: 50%; left: 0; transform: translateY(-40%)">${icon.chevronLeft}</button>
        <button ${step.value === maxStep.value - 1 ? 'disabled' : ''} id="target-highlight-button-next" style="${step.value === maxStep.value - 1 ? 'opacity: 0.3;' : ''} position: absolute; top: 50%; right: 0; transform: translateY(-40%)">${icon.chevronRight}</button>
        <button id="target-highlight-button-stop" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -40%)">${icon.stop}</button>
      </div>
      `
    }
  })

  if (wto.value) {
    clearTimeout(wto.value)
  }
  
  wto.value = setTimeout(() => {
    applyStepListeners(tourOptions.value)
  }, 0)
})

onMounted(() => {
  window.addEventListener('resize', () => {
    if (wto.value) {
      clearTimeout(wto.value)
    }
    wto.value = setTimeout(() => applyStepListeners(tourOptions.value), 0)
  })
})

function nextStep() {
  step.value += 1;
  if (step.value > maxStep.value - 1) {
    step.value = 0;
  }
}

function previousStep() {
  step.value -= 1;
  if (step.value < 0) {
    step.value = maxStep.value - 1;
  }
}

function takeTheTour() {
  step.value = -1;
  nextStep();
}

function triggerCopy() {
  isCopy.value = true;
  if (to.value) {
    clearTimeout(to.value)
  }
  to.value = setTimeout(() => {
    isCopy.value = false;
  }, 1000)
}

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

  initConfig.value.dataLastValueColor = isDarkMode.value ? '#14b8a6' : '#1A1A1A';
  config.value.dataLastValueColor = isDarkMode.value ? '#14b8a6' : '#1A1A1A';
  initConfig.value.dataLineColor = isDarkMode.value ? '#14b8a6' : '#4A4A4A'
  config.value.dataLineColor = isDarkMode.value ? '#14b8a6' : '#4A4A4A'
}

function toggleTheme() {
  setTheme(isDarkMode.value ? 'light' : 'dark');
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
    if (i > 10 && i < 20) {
      arr.push(null);
    } else {
      arr.push(Math.round(Math.random() * 10000) / 100);
    }
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
  dataCutNull: 'false',
  dataAnimation: 'true',
  dataLineColor: '#4A4A4A',
  dataAreaColor: '#99f6e420',
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
  dataLastValueColor: '#1A1A1A',
  dataType: 'line',
  dataTooltipSmoothing: 1,
  dataGradientFrom: '#99f6e4',
  dataGradientTo: '#42d392',
  dataGradientFromOpacity: 1,
  dataGradientToOpacity: 0
});

const config = ref({
  dataCurve: 'true',
  dataCutNull: 'false',
  dataAnimation: 'true',
  dataLineColor: '#4A4A4A',
  dataAreaColor: '#99f6e420',
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
  dataLastValueColor: '#1A1A1A',
  dataType: 'line',
  dataTooltipSmoothing: 1,
  dataGradientFrom: '#99f6e4',
  dataGradientTo: '#42d392',
  dataGradientFromOpacity: 1,
  dataGradientToOpacity: 0
});

function resetConfig() {
  config.value = {...initConfig.value}
}

function setArea(e) {
  config.value.dataAreaColor = e.target.value === 'true' ? '#14b8a620' : undefined
}

const dataset = ref(makeDs(50));
const dates = ref(makeDates(50));

const installContentNPM = ref(`npm i tiny-spark`);
const installContentYARN = ref(`yarn add tiny-spark`);
const installContentPNPM = ref(`pnpm add tiny-spark`);
const installContentBUN = ref(`bun add tiny-spark`);
const setupContent = ref(`
import { render } from "tiny-spark";

// Call it immediately after the DOM is ready.
// All charts will be rendered.
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
      data-type="${config.value.dataType}"
      data-set="${dataset.value}"
      data-dates='${dates.value}'
      data-curve="${config.value.dataCurve}"
      data-cut-null="${config.value.dataCutNull}"
      data-animation="${config.value.dataAnimation}"
      data-line-color="${config.value.dataLineColor}"
      data-area-color="${config.value.dataAreaColor}"
      data-gradient-from="${config.value.dataGradientFrom}"
      data-gradient-to="${config.value.dataGradientTo}"
      data-gradient-from-opacity="${config.value.dataGradientFromOpacity}"
      data-gradient-to-opacity="${config.value.dataGradientToOpacity}"
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
      data-tooltip-smoothing="${config.value.dataTooltipSmoothing}"
    />
  </div>
</div>`
})

const tinyFormatContent = ref(`
import { render, tinyFormat } from "tiny-spark";

const data = [1, 2, 3, null, 5, 8]; // null values can be included
const dates = ['01-2026', '02-2026', '03-2026', '04-2026', '05-2026', '06-2026'];

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

/** the plots (svg circle element in line mode) */
.tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}

/** the bars (svg rect element in bar mode) */
.tiny-spark-datapoint-bar {
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
          // initConfig.value.dataLastValueColor = isDarkMode.value ? '#8A8A8A' : '#1A1A1A';
          // config.value.dataLastValueColor = isDarkMode.value ? '#8A8A8A' : '#1A1A1A';
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
const dataType = ref(null);
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
const dataTooltipSmoothing = ref(1);
const dataCutNull = ref(null);
const dataGradientFrom = ref(null);
const dataGradientTo = ref(null);
const dataGradientFromOpacity = ref(null);
const dataGradientToOpacity = ref(null);

const snippetsConfig = computed(() => {
  return {
    withLineNumbers: false,
    backgroundColor: 'transparent',
    baseTextColor: isDarkMode.value ? '#CCCCCC' : '#2A2A2A',
    copyIconColor: isDarkMode.value ? '#CCCCCC' : '#3A3A3A',
    colorFunction: isDarkMode.value ? '#DCDCAA' : '#2f74ad',
    colorVariableKeyword: isDarkMode.value ? '#559AD3' : 'rgb(161, 82, 152)',
    colorKeywords: isDarkMode.value ? '#B37BAE' : 'rgb(161, 82, 152)',
    colorString: isDarkMode.value ? '#CD9077' : '#3d7042',
    colorNumber: isDarkMode.value ? '#AEC6A1' : 'rgb(149, 116, 42)',
    colorBrackets: isDarkMode.value ? '#559AD3' : '#2A2A2A',
    colorPunctuation: isDarkMode.value ? '#E1E5E8' : '#3A3A3A',
    colorParenthesis: isDarkMode.value ? '#8A8A8A' : '#3A3A3A',
    colorTitle: isDarkMode.value ? '#CCCCCC' : '#1A1A1A',
    colorHtmlTag: isDarkMode.value ? '#559AD3' : '#2f74ad',
    colorCssSelector: isDarkMode.value ? '#D7BA7D' : '#a1864c',
  }
})

function renderNext() {
  nextTick(render)
}

function makeD(n) {
  const arr = [];
  for (let i = 0; i < n; i += 1) {
    arr.push(`"T ${i}"`)
  }
  return `[${arr.join(',')}]`
}

const isClick = ref(false);
const isRand = ref(false);

const TO = ref(null)
function delay() {
  isClick.value = true;
  if (TO.value) {
    clearTimeout(TO.value);
  }
  TO.value = setTimeout(() => {
    isClick.value = false;
  }, 1000)
}

function delayRand() {
  isRand.value = true;
  if (TO.value) {
    clearTimeout(TO.value);
  }
  TO.value = setTimeout(() => {
    isRand.value = false;
  }, 500)
}

</script>

<template>
  <div class="underlay fixed inset-0 z-0">
    <svg style="width: 100%; height: 100%">
      <defs>
        <pattern
          id="griddit"
          x="0" y="0"
          width="50" height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            fill="none"
            :stroke="isDarkMode ? '#2A2A2A50' : '#2A2A2A07'"
            d="
              M0 0   L50 0   L50 50   L0 50   Z
              M1 1   L49 1   L49 49   L1 49   Z
              M10 1  L10 49
              M20 1  L20 49
              M30 1  L30 49
              M40 1  L40 49
              M1 10  L49 10
              M1 20  L49 20
              M1 30  L49 30
              M1 40  L49 40
            "
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#griddit)" />
    </svg>
  </div>

  <div class="bg-layer pointer-events-none"></div>

  <div class="relative pointer-events-none">
    <Waves gradId="grad1" :isDarkMode="isDarkMode"/>
  </div>

  <main class="w-full relative mx-auto max-w-[1200px] px-6">
    <header class="flex flex-row justify-between place-items-center pt-12 pb-2 pr-6">
      <div class="flex flex-row">
        <div class="text-4xl flex flex-row gap-2 place-items-end">
          <div class="flex flex-row place-items-center gap-2 text-black dark:text-teal-300">
            <TinySparkLogo :size="29" :color="isDarkMode ? '#ccfbf1' : '#2dd4bf'"/>
              tiny-spark 
          </div>
          <small class="text-sm text-gray-700 bg-teal-100 dark:bg-teal-800 dark:text-teal-100 dark:border dark:border-teal-500 px-2 rounded-full -translate-y-1">{{ version }}</small>
        </div>
      </div>

      <div class="w-full h-full mx-auto max-w-[624px] px-12">
        <div
          class="tiny-spark" 
          data-type="line"
          data-curve="true"
          data-animation="true"
          :data-line-color="isDarkMode ? '#2dd4bf' : '#3A3A3A'"
          data-line-thickness="3"
          data-responsive
          :data-plot-color="isDarkMode ? '#2dd4bf' : '#3A3A3A'"
          data-plot-radius="4"
          data-number-locale="en-US"
          :data-indicator-color="isDarkMode ? '#2dd4bf' : '#3A3A3A'"
          data-indicator-width="0.5"
          :data-set="'[-89, 55, -55, 34, -34, 21, -21, 13, -13, 8, -8, 5, -5, 8, -8, 13, -13, 21, -21, 34, -34, 55, -55, 89]'"
          :data-dates="makeD(38)"
          data-show-last-value="false"
          data-tooltip-smoothing="1"
        />
      </div>

      <div class="flex flex-row place-items-center gap-4">
        <button @click="toggleTheme" class="shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)] rounded-full p-2 bg-gray-200 dark:bg-[#1A1A1A] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors">
          <SunIcon v-if="isDarkMode" class="text-teal-300"/>
          <MoonIcon v-else/>
        </button>

        <a class="relative bg-teal-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank" data-step="6">
          <div class="shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)] rounded-full p-2 bg-gray-200 dark:bg-[#1A1A1A] hover:bg-gray-100 text-[#3A3A3A] dark:text-teal-300 dark:hover:bg-[#2A2A2A] transition-colors">
            <BrandGithubFilledIcon/>
          </div>
          <div class="absolute top-0 pl-1 left-[100%] text-xs flex flex-row place-items-center gap-0.5">
            <StarFilledIcon :size="16" class="text-teal-100 dark:text-teal-100"/> <span v-if="stars" class="dark:text-teal-300">{{ stars }}</span>
          </div>
        </a>
      </div>
    </header>

    <h1 class="pl-8 mb-6 max-w-[32ch] text-gray-700 dark:text-gray-500">An elegant, reactive and responsive sparkline chart solution without dependency.</h1>

    <button
          class="ml-8 mb-12 bg-gradient-to-br from-[#99f6e4] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#99f6e4] transition-colors text-black rounded-full py-3 px-5 pr-7 mt-6 flex flex-row gap-2 place-items-center shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#CCCCCC,0_4px_6px_rgba(0,0,0,0.5)]"
          @click="takeTheTour">
          <PlayerPlayFilledIcon class="text-[#19313d]"/>
          TAKE THE TOUR
      </button>

    <div class="mx-auto w-fit flex flex-row gap-2 flex-wrap justify-center mb-12" data-step="0">
      <div class="w-[248px]">
        <BaseCard type="dark" funky>
          <VueHiCode
            :content="installContentNPM"
            v-bind="{
              ...codeConfig,
              backgroundColor: isDarkMode ? '#99f6e430'  : '#f3f4f6',
              baseTextColor: isDarkMode ? '#CCCCCC' : '#1A1A1A',
              copyIconColor: isDarkMode ? '#99f6e4' : '#042f2e',
              fontSize: '0.9rem'
              }"
            language="javascript"
            @copy="triggerCopy"
          />
        </BaseCard>
      </div>
      <div class="w-[273px]">
        <BaseCard type="dark" funky>
          <VueHiCode
            :content="installContentYARN"
            v-bind="{
              ...codeConfig,
              backgroundColor: isDarkMode ? '#99f6e430'  : '#f3f4f6',
              baseTextColor: isDarkMode ? '#CCCCCC' : '#1A1A1A',
              copyIconColor: isDarkMode ? '#99f6e4' : '#042f2e',
              fontSize: '0.9rem'
              }"
            language="javascript"
            @copy="triggerCopy"
          />
        </BaseCard>
      </div>
      <div class="w-[273px]">
        <BaseCard type="dark" funky>
          <VueHiCode
            :content="installContentPNPM"
            v-bind="{
              ...codeConfig,
              backgroundColor: isDarkMode ? '#99f6e430'  : '#f3f4f6',
              baseTextColor: isDarkMode ? '#CCCCCC' : '#1A1A1A',
              copyIconColor: isDarkMode ? '#99f6e4' : '#042f2e',
              fontSize: '0.9rem'
              }"
            language="javascript"
            @copy="triggerCopy"
          />
        </BaseCard>
      </div>
      <div class="w-[268px]">
        <BaseCard type="dark" funky>
          <VueHiCode
            :content="installContentBUN"
            v-bind="{
              ...codeConfig,
              backgroundColor: isDarkMode ? '#99f6e430'  : '#f3f4f6',
              baseTextColor: isDarkMode ? '#CCCCCC' : '#1A1A1A',
              copyIconColor: isDarkMode ? '#99f6e4' : '#042f2e',
              fontSize: '0.9rem'
              }"
            language="javascript"
            @copy="triggerCopy"
          />
        </BaseCard>
      </div>
    </div>

    <div class="w-full max-w-[600px] mx-auto mb-12 dark:border dark:border-gray-700 rounded-2xl shadow-md" data-step="1">
      <BaseCard type="dark" :funky="isDarkMode">
        <IconJs class="shadow-md"/>
        <VueHiCode
          :content="setupContent"
          v-bind="{
            ...snippetsConfig,
          }"
          language="javascript"
          @copy="triggerCopy"
        />
      </BaseCard>
    </div>

    <section>
      <div class="relative p-6 bg-app-grey w-full h-[200px] max-w-[1200px] min-w-[100px] min-h-[100px] mx-auto resize border border-teal-100 dark:border-gray-600 border-dashed overflow-auto rounded-t-2xl rounded-bl-2xl" data-step="5">
        <div class="showcase w-full h-full mx-auto">
          <BaseCard class="h-full" type="dark" funky>
            <div
              class="tiny-spark" 
              :data-type="config.dataType"
              :data-curve="config.dataCurve"
              :data-cut-null="config.dataCutNull"
              :data-animation="config.dataAnimation"
              :data-line-color="config.dataLineColor"
              :data-area-color="config.dataAreaColor"
              :data-gradient-from="config.dataGradientFrom"
              :data-gradient-to="config.dataGradientTo"
              :data-gradient-from-opacity="config.dataGradientFromOpacity"
              :data-gradient-to-opacity="config.dataGradientToOpacity"
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
              :data-tooltip-smoothing="config.dataTooltipSmoothing"
            />
          </BaseCard>
        </div>
        <div class="absolute bottom-1 right-5 pointer-events-none select-none text-xs flex flex-row place-items-center gap-1 dark:text-teal-300">
          resize
        </div>
        <div class="absolute bottom-0 right-0 h-[12px] w-[12px] bg-teal-100 dark:bg-teal-300 pointer-events-none select-none"/>
      </div>
      <div class="w-full mx-auto max-w-[600px] flex flex-col place-items-center justify-center mt-6 text-lg">
        <span class="dark:text-gray-400">
          The chart is <strong>responsive</strong>. Try resizing the container.<br>
          You can pass null values, and decide to cut or join them.<br>
          The chart is <strong>reactive</strong>. Dynamic change in data attributes will trigger an update. Try it out:
        </span>
        <div class="flex flex-row gap-4 mt-6">
          <button class="flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-teal-100 dark:from-[rgb(40,30,30)] dark:to-[rgb(30,40,40)] py-2 px-4 rounded-full hover:from-teal-100 hover:to-app-bg-grey dark:hover:from-[rgb(30,40,40)] dark:hover:to-[rgb(40,30,30)] shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)] transition-all dark:text-teal-300" @click="dataset = makeDs(50); delayRand();"><div class="relative w-6 h-6"><TimelineIcon :class="`absolute text-gray-800 dark:text-teal-300`"/><TimelineIcon :class="`absolute text-gray-800 dark:text-teal-300 ${isRand ? 'animate-ping' : ''}`"/></div> Random data</button>
          <button class="flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-teal-100 dark:from-[rgb(40,30,30)] dark:to-[rgb(30,40,40)] py-2 px-4 rounded-full hover:from-teal-100 hover:to-app-bg-grey dark:hover:from-[rgb(30,40,40)] dark:hover:to-[rgb(40,30,30)] shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)] transition-all dark:text-teal-300" @click="dataset = makeDs(50); renderNext(); delay()"><RadioactiveFilledIcon :class="`text-gray-800 dark:text-teal-300 ${isClick ? 'animate-spin' : ''}`"/> Re-render</button>
        </div>
      </div>

      <BaseCard class="my-6" funky>
        <fieldset class="border border-solid border-teal-100 dark:border-transparent p-5 rounded-xl flex flex-row gap-4 flex-wrap bg-gray-200 dark:bg-[#2A2A2A] glassed shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)]" data-step="3">
          <legend class="px-2 flex flex-row gap-2 dark:text-teal-200"><SettingsIcon class="text-teal-100"/> <strong>Configuration options</strong></legend>
          <label class="flex flex-col" ref="dataCurve">
            <code class="dark:text-teal-200">data-type</code>
            <BaseSelect
              v-model="config.dataType"
              tooltip
              :options="[
                'line',
                'bar'
              ]"
            >
            <template #tooltip>
              Show a line chart or a bar chart
            </template>
          </BaseSelect>
          </label>
  
          <label class="flex flex-col" ref="dataCurve">
            <code class="dark:text-teal-200">data-curve</code>
            <BaseSelect
              v-model="config.dataCurve"
              tooltip
              :options="[
                'true',
                'false'
              ]"
            >
            <template #tooltip>
              Line mode only.
              Show the line as a curve (spline)
            </template>
          </BaseSelect>
          </label>
  
          <label class="flex flex-col" ref="dataCurve">
            <code class="dark:text-teal-200">data-cut-null</code>
            <BaseSelect
              v-model="config.dataCutNull"
              tooltip
              :options="[
                'true',
                'false'
              ]"
            >
            <template #tooltip>
              Cut null values
            </template>
          </BaseSelect>
          </label>
  
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-animation</code>
            <BaseSelect
              v-model="config.dataAnimation"
              tooltip
              :options="[
                'true',
                'false'
              ]"
              @change="renderNext"
            >
            <template #tooltip>
              Animate the chart on load
            </template>
          </BaseSelect>
          </label>
  
          <label class="flex flex-col" ref="dataTooltipSmoothing">
            <code class="dark:text-teal-200">data-tooltip-smoothing</code>
            <input type="number" v-model="config.dataTooltipSmoothing" :min="0" :max="2" :step="0.01"/>
          </label>
          <Tooltip :target="dataTooltipSmoothing">
            Set the smoothing transition of the tooltip.
            The lower the slower.
          </Tooltip>
          
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-line-color</code>
            <input type="color" v-model="config.dataLineColor" ref="dataLineColor"/>
          </label>
          <Tooltip :target="dataLineColor">
            Line mode only.
            Set the color of the line
          </Tooltip>
          
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-area-color</code>
            <input type="color" v-model="config.dataAreaColor" ref="dataAreaColor"/>
          </label>
          <Tooltip :target="dataAreaColor">
            Line mode only.
              Set the color of the area
          </Tooltip>
  
          <label class="flex flex-col dark:text-teal-200">
            (show area)
            <input class="accent-[#14b8a6]" type="checkbox" v-model="config.area" :value="config.area" @change="setArea"/>
          </label>
  
          <label class="flex flex-col" ref="dataLineThickness">
            <code class="dark:text-teal-200">data-line-thickness</code>
            <input type="number" v-model="config.dataLineThickness" :min="1" :max="12"/>
          </label>
          <Tooltip :target="dataLineThickness">
            Line mode only.  
            Set the thickness of the line (stroke width)
          </Tooltip>
  
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-plot-color</code>
            <input type="color" v-model="config.dataPlotColor" ref="dataPlotColor"/>
          </label>
          <Tooltip :target="dataPlotColor">
              Set the fill color of datapoint circles or bars. To change the stroke color, use css (target the <code><b>.tiny-spark-datapoint-circle</b></code> css class for the line chart, or <code><b>.tiny-spark-datapoint-bar</b></code> for the bar chart)
          </Tooltip>
  
          <label class="flex flex-col" ref="dataPlotRadius">
            <code class="dark:text-teal-200">data-plot-radius</code>
            <input type="number" v-model="config.dataPlotRadius" :min="0"/>
          </label>
          <Tooltip :target="dataPlotRadius">
              Set the radius of datapoint circles
          </Tooltip>
  
          <label class="flex flex-col" ref="dataHidePlotsAbove">
            <code class="dark:text-teal-200">data-hide-plots-above</code>
            <input type="number" v-model="config.dataHidePlotsAbove" :min="0"/>
          </label>
          <Tooltip :target="dataHidePlotsAbove">
              Hide datapoint circles when the number of datapoints exceeds this number
          </Tooltip>
          
          <label class="flex flex-col" ref="dataNumberRounding">
            <code class="dark:text-teal-200">data-number-rounding</code>
            <input type="number" v-model="config.dataNumberRounding" :min="0"/>
          </label>
          <Tooltip :target="dataNumberRounding">
              Set the number of decimals for data labels
          </Tooltip>
          
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-indicator-color</code>
            <input type="color" v-model="config.dataIndicatorColor" ref="dataIndicatorColor"/>
          </label>
          <Tooltip :target="dataIndicatorColor">
              Set the stroke color of the indicator
          </Tooltip>
          
          <label class="flex flex-col" ref="dataIndicatorWidth">
            <code class="dark:text-teal-200">data-indicator-width</code>
            <input type="number" v-model="config.dataIndicatorWidth" :min="0"/>
          </label>
          <Tooltip :target="dataIndicatorWidth">
              Set the stroke width of the indicator
          </Tooltip>
          
          <label class="flex flex-col" ref="dataShowLastValue">
            <code class="dark:text-teal-200">data-show-last-value</code>
            <BaseSelect
              v-model="config.dataShowLastValue"
              tooltip
              :options="[
                'true',
                'false'
              ]"
            >
            <template #tooltip>
              Show a data label for the last value
            </template>
          </BaseSelect>
          </label>
          
          <label class="flex flex-col" ref="dataLastValueFontSize">
            <code class="dark:text-teal-200">data-last-value-font-size</code>
            <input type="number" v-model="config.dataLastValueFontSize" :min="6"/>
          </label>
          <Tooltip :target="dataLastValueFontSize">
              Set the font size of the last value data label
          </Tooltip>
          
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-last-value-color</code>
            <input type="color" v-model="config.dataLastValueColor" ref="dataLastValueColor"/>
          </label>
          <Tooltip :target="dataLastValueColor">
              Set the text color of the last value data label
          </Tooltip>
  
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-gradient-from</code>
            <input type="color" v-model="config.dataGradientFrom" ref="dataGradientFrom"/>
            <Tooltip :target="dataGradientFrom">
              Set the gradient "from" color
          </Tooltip>
          </label>
  
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-gradient-to</code>
            <input type="color" v-model="config.dataGradientTo" ref="dataGradientTo"/>
            <Tooltip :target="dataGradientTo">
              Set the gradient "to" color
          </Tooltip>
          </label>
  
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-gradient-from-opacity</code>
            <input class="accent-[#14b8a6]" type="range" :min="0" :max="1" :step="0.01" v-model="config.dataGradientFromOpacity" ref="dataGradientFromOpacity"/>
            <Tooltip :target="dataGradientFromOpacity">
              Set the opacity for the gradient "from" color
          </Tooltip>
          </label>
  
          <label class="flex flex-col">
            <code class="dark:text-teal-200">data-gradient-to-opacity</code>
            <input class="accent-[#14b8a6]" type="range" :min="0" :max="1" :step="0.01" v-model="config.dataGradientToOpacity" ref="dataGradientToOpacity"/>
            <Tooltip :target="dataGradientToOpacity">
              Set the opacity for the gradient "to" color
          </Tooltip>
          </label>
        </fieldset>
        <button @click="resetConfig" class="mx-auto mt-5 flex flex-row gap-2 place-items-center bg-gradient-to-br from-app-bg-grey to-teal-100 dark:from-[rgb(40,30,30)] dark:to-[rgb(30,40,40)] py-1 px-4 rounded-full hover:from-teal-100 hover:to-app-bg-grey dark:hover:from-[rgb(30,40,40)] dark:hover:to-[rgb(40,30,30)] hover:shadow transition-all dark:text-teal-300 shadow-[inset_0_2px_2px_#FFFFFF,0_4px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_2px_#4A4A4A,0_4px_6px_rgba(0,0,0,0.5)]">RESET</button>
      </BaseCard>

    </section>

    <h2 class="mb-6 text-xl dark:text-gray-400 mt-12">
      To add a chart on your application, create a div with a <strong>"tiny-spark"</strong> class and <strong>data-attributes</strong>.<br>
      Except for <span class="border text-sm py-1 px-2 rounded-full"><code>data-set</code></span> all data-attributes are optional.<br>
      Dynamic change in data-attributes will automatically re-render the chart.
    </h2>
    <div class="w-full max-w-[800px] mx-auto my-12" data-step="2">
      <BaseCard type="dark" :funky="isDarkMode">
        <IconHtml class="drop-shadow"/>
        <VueHiCode
          :content="codeContent"
          v-bind="{
            ...snippetsConfig,
          }"
          language="html"
          @copy="triggerCopy"
        />
      </BaseCard>
    </div>

    <h2 class="mb-6 text-xl dark:text-gray-400">tiny-spark is <strong>headless</strong>. Target the following css classes to customize your chart. Here is an example:</h2>
    <div class="w-full max-w-[800px] mx-auto my-12" data-step="4">
      <BaseCard type="dark" :funky="isDarkMode">
        <IconCss class="drop-shadow"/>
        <VueHiCode
          :content="cssContent"
          v-bind="{
            ...snippetsConfig,
          }"
          language="css"
          @copy="triggerCopy"
        />
      </BaseCard>
    </div>


    <h2 class="mb-6 text-xl dark:text-gray-400">If you are using tiny-spark in a framework, you can use the <strong><code>tinyFormat</code></strong> utility function to prepare the data passed to the <strong><code>data-set</code></strong> and <strong><code>data-dates</code></strong> attributes:</h2>
    <div class="w-full max-w-[800px] mx-auto my-12">
      <BaseCard type="dark" :funky="isDarkMode">
        <IconJs class="shadow-md"/>
        <VueHiCode
          :content="tinyFormatContent"
          v-bind="{
            ...snippetsConfig,
          }"
          language="javascript"
          @copy="triggerCopy"
        />
      </BaseCard>
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

    <hr class="mb-12 border-teal-100 dark:border-gray-700"/>

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
              :data-line-color="isDarkMode ? '#14b8a6' : '#4A4A4A'"
              :data-area-color="isDarkMode ? '#14b8a610' : '#00FF0010'"
              data-line-thickness="2"
              data-responsive
              :data-plot-color="isDarkMode ? 'rgb(170,180,180)' : '#2A2A2A'"
              data-plot-radius="6"
              data-hide-plots-above="6"
              data-number-locale="en-US"
              data-number-rounding="0"
              :data-indicator-color="isDarkMode ? '#14b8a640' : '#8A8A8A'"
              data-indicator-width="1"
              :data-set="history.dataset"
              :data-dates="history.dates"
              data-show-last-value="true"
              :data-last-value-color="isDarkMode ? '#14b8a6' : '#4A4A4A'"
              :data-tooltip-smoothing="1"
            />
          </div>
        </div>
        <p class="text-[#6A6A6A] dark:text-gray-400 mt-12">
          The tour was made using <a class="text-black dark:text-[#14b8a6] underline" href="https://target-highlight.graphieros.com/" target="_blank">target-highlight</a>
        </p>
    </div>
  </main>

  <transition name="copy">
    <div 
      v-if="isCopy"
      :style="{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }"
    >
      <DeviceFloppyIcon class="text-[#657573] dark:text-[#14b8a6]" size="100"/>
    </div>
  </transition>

  <div class="fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-2 hidden lg:flex">
    <span class="text-xs text-center text-[#3A3A3A] dark:text-[#CCCCCC]">
      Stackblitz<br>boilerplates
    </span>
      <ButtonLink link="https://stackblitz.com/edit/stackblitz-starters-hvpo2cd4?file=index.html" ref="js">
        <BrandJavascriptIcon class="text-[#F0DB4F]"/>
      </ButtonLink>
        <ButtonLink link="https://stackblitz.com/edit/vitejs-vite-fkayxq4y?file=src%2FApp.jsx">
          <BrandReactIcon class="text-[#61DAFB]"/>
        </ButtonLink>
        <ButtonLink link="https://stackblitz.com/edit/vitejs-vite-lblowhxz?file=src%2FApp.vue">
          <BrandVueIcon class="text-[#41B883]"/>
        </ButtonLink>
        <ButtonLink link="https://stackblitz.com/edit/vitejs-vite-4ezmsecw?file=src%2FApp.svelte">
          <BrandSvelteIcon class="text-[#FF3E00]"/>
        </ButtonLink>  
  </div>

  <footer class="flex flex-col justify-between place-items-center pb-12">
    <div class="flex flex-row place-items-center gap-2 text-2xl dark:text-teal-300 mb-2">
        <TinySparkLogo :size="29"/>
          tiny-spark
      </div>
      <div class="flex flex-row gap-2 place-items-center">
        <span class="text-sm dark:text-gray-600">
          MIT license - {{ new Date().getFullYear() }}
      </span>
        <a class="relative p-1 bg-teal-100 rounded-full hover:shadow-md transition-all" href="https://github.com/graphieros/tiny-spark" target="_blank">
          <BrandGithubFilledIcon/>
          <div class="absolute top-0 pl-1 left-[100%] text-xs flex flex-row place-items-center gap-0.5">
            <StarFilledIcon :size="16" class="text-teal-100"/> <span v-if="stars" class="dark:text-teal-300">{{ stars }}</span>
          </div>
        </a> 
      </div>
  </footer>
</template>

<style>
.tiny-spark-tooltip {
  border-radius: 2px;
  box-shadow: 0 6px 3px -3px rgba(0,0,0,0.2);
  padding: 0 8px;
  transform: translateY(-12px);
  backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

html.light .tiny-spark-tooltip {
  background: radial-gradient(at top left, rgba(255,255,255, 0.4), transparent);
}

html.dark .tiny-spark-tooltip {
  background: radial-gradient(at top left, rgba(255,255,255, 0.2), rgba(255,255,255, 0.1));
  color: #ccfbf1;
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

html.light .tiny-spark-tooltip::after {
  border-top-color: rgba(255,255,255, 0.5);
}

html.dark .tiny-spark-tooltip::after {
  border-top-color: #14b8a6;
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
  background: #FFFFFF;
  border: 1px solid #99f6e4;
  color: #1A1A1A;
}

html.light input{
  background: #FFFFFF;
  border: 1px solid #99f6e4;
  color: #1A1A1A;
}

html.dark select{
  background: #1A1A1A;
  border: 1px solid #99f6e450;
  color: #99f6e4;
}
html.dark input{
  background: #1A1A1A;
  border: 1px solid #99f6e450;
  color: #99f6e4;
}

.copy-enter-active {
  transition: all 0.3s ease-out;
}

.copy-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.copy-enter-from,
.copy-leave-to {
  transform: translate(-50%, -50%) scale(2,2) !important;
  opacity: 0;
}

.glassed {
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.target-highlight-tooltip {
  background: radial-gradient(at top left, #99f6e4, #14b8a6);
  padding: 6px;
  color: #1F1F1F;
  transform: translateY(-4px);
  border-radius: 3px;
  max-width: 300px;
}

.target-highlight-tooltip::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

:root {
  --tooltip-arrow-size: 6px;
  --tooltip-bg: #14b8a6;
}

/* ─── TOP placement ───
   Tooltip sits above the element,
   arrow on the bottom edge pointing DOWN toward the element */
.target-highlight-tooltip[data-placement="top"]::after {
  bottom: calc(-1 * var(--tooltip-arrow-size));
  left: 50%;
  transform: translateX(-50%);
  border-width: var(--tooltip-arrow-size) var(--tooltip-arrow-size) 0 var(--tooltip-arrow-size);
  border-color: var(--tooltip-bg) transparent transparent transparent;
}

/* ─── BOTTOM placement ───
   Tooltip sits below the element,
   arrow on the top edge pointing UP toward the element */
.target-highlight-tooltip[data-placement="bottom"]::after {
  top: calc(-1 * var(--tooltip-arrow-size));
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 var(--tooltip-arrow-size) var(--tooltip-arrow-size) var(--tooltip-arrow-size);
  border-color: transparent transparent var(--tooltip-bg) transparent;
}

/* ─── LEFT placement ───
   Tooltip sits to the left of the element,
   arrow on the right edge pointing RIGHT toward the element */
.target-highlight-tooltip[data-placement="left"]::after {
  right: calc(-1 * var(--tooltip-arrow-size));
  top: 50%;
  transform: translateY(-50%);
  border-width: var(--tooltip-arrow-size) 0 var(--tooltip-arrow-size) var(--tooltip-arrow-size);
  border-color: transparent transparent transparent var(--tooltip-bg);
}

/* ─── RIGHT placement ───
   Tooltip sits to the right of the element,
   arrow on the left edge pointing LEFT toward the element */
.target-highlight-tooltip[data-placement="right"]::after {
  left: calc(-1 * var(--tooltip-arrow-size));
  top: 50%;
  transform: translateY(-50%);
  border-width: var(--tooltip-arrow-size) var(--tooltip-arrow-size) var(--tooltip-arrow-size) 0;
  border-color: transparent var(--tooltip-bg) transparent transparent;
}

#target-highlight-button-previous,
#target-highlight-button-next,
#target-highlight-button-stop {
  background-color: transparent;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border-radius: 50%;
}

#target-highlight-button-previous svg path,
#target-highlight-button-next svg path {
  transition: fill 0.2s ease, transform 0.2s ease;
  fill: #0f766e;
}

#target-highlight-button-stop svg path {
  transition: stroke 0.2s ease, transform 0.2s ease;
  stroke: #0f766e;
}

#target-highlight-button-previous:hover,
#target-highlight-button-next:hover,
#target-highlight-button-stop:hover {
  background-color: #FFFFFF50;
  box-shadow: 0 3px 6px -3px rgba(0,0,0,0.3);
}

#target-highlight-button-previous:hover svg path,
#target-highlight-button-next:hover svg path {
  fill: #1A1A1A;
}

#target-highlight-button-stop:hover svg path {
  stroke: #1A1A1A;
}

#target-highlight-button-stop:hover {
  transform: scale(1.2,1.2) translate(-40%, -35%) !important;
}

#target-highlight-button-previous:not([disabled]):hover,
#target-highlight-button-next:hover {
  transform: scale(1.2,1.2) translateY(-35%) !important;
}

.stepper {
  color: #0f766e;
  font-size: 1.5rem;
  font-weight: bold;
}

.tiny-spark-datapoint-bar {
  stroke: rgb(210,210,210);
}

.target-highlight-tooltip {
  opacity: 1;
  transform: scale(1, 1);
  transition: opacity 0.3s transform 0.3s;
  will-change: opacity transform;
}

.target-highlight-tooltip.fade-in {
  opacity: 0;
  transform: scale(0.8,0.8);
  animation: fadeIn 0.3s forwards;
}

.target-highlight-tooltip.fade-out {
  opacity: 1;
  transform: scale(1, 1);
  animation: fadeOut 0.3s forwards;
  pointer-events: none;
}

@keyframes fadeIn {
  to { opacity: 1; transform: scale(1, 1); }
}

@keyframes fadeOut {
  to { opacity: 0; transform: scale(0, 0); }
}

.underlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(at top left, #14b8a610, transparent, transparent);
}
</style>
