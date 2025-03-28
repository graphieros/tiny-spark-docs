<script setup>
import { ref, computed, onMounted } from "vue";
import { BrandGithubFilledIcon, TimelineIcon, RefreshIcon } from "vue-tabler-icons";
import { VueHiCode } from "vue-hi-code";
import { render } from "tiny-spark";
import "vue-hi-code/style.css"
import pack from "../package.json";

const version = computed(() => `v${pack.dependencies['tiny-spark'].replace('^', '')}`);

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
const setupContent = ref(`
import { render } from "tiny-spark";

// Call it immediately if your dataset is hardcoded, or call it after a fetch.
render();
`);
const codeContent = ref(`
<div class="p-6 bg-app-bg-grey w-full max-w-[600px] min-w-[100px] min-h-[100px] mx-auto resize overflow-auto">
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
  transform: translateY(-12px);
}

/* You can add an arrow on the bottom of the tooltip */
.tiny-spark-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 10px solid transparent;
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

const start = ref("2025-03-26");
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

const history = computed(() => {
  return {
    dataset: `[${data.value.map(d => d.value).toString()}]`,
    dates: `${data.value.map(d => `"${d.period}"`).toString()}`
  }
})

</script>

<template>
  <div class="bg-layer"/>
  <main class="w-full mx-auto max-w-[1200px] px-6">
    <header class="flex flex-row justify-between place-items-center pt-12 pb-2">
      <div class="text-4xl flex flex-row gap-2 place-items-end">
        <div class="flex flex-row place-items-center gap-2">
            <TimelineIcon class="text-red-100"/>
            tiny-spark 
        </div>
        <small class="text-sm text-gray-700">{{ version }}</small>
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

    <div class="p-6 bg-app-bg-grey w-full max-w-[600px] mb-24 mx-auto">
      <div>
        NPM downloads: 
        {{ start }} to {{ end }}
      </div>
      <div class="p-6 bg-app-bg-grey w-full max-w-[600px] mx-auto">
          <div class="mx-auto">
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
              data-number-rounding="0"
              data-indicator-color="#8A8A8A"
              data-indicator-width="1"
              :data-set="history.dataset"
              :data-dates="`[${history.dates}]`"
            />
          </div>
        </div>
    </div>

  </main>
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
  border: 10px solid transparent;
  border-top-color: rgba(240,240,240, 0.9);
}

.tiny-spark-datapoint-circle {
  stroke: rgb(210,210,210);
}
</style>
