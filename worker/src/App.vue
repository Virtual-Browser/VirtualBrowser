<template>
  <section class="container">
    <header>
      <img src="./assets/96.png" />
      <h1>Virtual Browser</h1>
    </header>
    <main>
      <div class="geo" v-show="geo.ip">
        <h3>{{ geo.ip }}</h3>
        <p>
          <span class="item country">
            <span>(For reference only)</span>
            <span>
              <img :src="geo.country_flag" />
              {{ geo.country_name }}({{ geo.country_code2 }})
            </span>
            {{ geo.city ? '/' : '' }}
            <span>{{ geo.city }}</span>
          </span>
        </p>
        <p>
          <span class="item">
            <span>
              <b>Time Zone:</b>
              {{ geo.time_zone.name }}
            </span>
            <span>
              <b>Coordinates:</b>
              {{ geo.longitude }}/{{ geo.latitude }}
            </span>
          </span>
        </p>
        <p>
          <span class="item">
            <span>
              <b>Fingerprint Hash:</b>
              {{ visitorId }}
            </span>
          </span>
        </p>
        <p>
          <img src="./assets/VirtualBrowser-qq-group.png" />
          <br />
          QQ Group:
          <code>564142956</code>
        </p>
      </div>
      <div v-if="!apiLinkIsValid" class="api-link-warning">
        <h2>API链接未设置</h2>
        <p>请在设置中配置API链接。</p>
      </div>
      <div class="network-error" v-if="networkErr">
        <h1>未连接到互联网</h1>
        <p>请检查您的网络或代理设置</p>
      </div>
      <el-timeline v-if="false" class="timeline">
        <el-timeline-item
          v-for="(value, key, index) in fingerprint"
          :key="index"
          :timestamp="key"
          placement="top"
        >
          <el-card class="card">
            <pre v-html="formatResult(value.value)"></pre>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </main>
  </section>
</template>

<script lang="ts" setup>
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { onMounted, ref, computed } from 'vue'
import formatHighlight from 'json-format-highlight'
import { chromeSend, getGlobalData } from '@/utils/native.js'
import { loadScript } from '@/utils/index.js'
import random from 'random'

const geo = ref({
  ip: '',
  country_flag: '',
  country_name: '',
  country_code2: '',
  city: '',
  time_zone: { name: '' },
  longitude: '',
  latitude: ''
})
const fingerprint = ref()
const visitorId = ref('')
const networkErr = ref(false)
let apiLink = ref('')

const apiLinkIsValid = computed(() => apiLink.value !== '')

onMounted(async () => {
  const store = await getGlobalData()
  const storedApiLink = store.apiLink
  if (storedApiLink) {
    apiLink.value = storedApiLink
  }
  if (!apiLink.value) {
    return
  }
  let req = await fetch(apiLink.value).catch(err => {
    console.log(err)
    networkErr.value = true
  })
  if (!req) {
    return
  }

  const res = await req.json()
  geo.value = res

  const ipGeo = {
    'time-zone': {
      zone: getZone(res.time_zone.offset_with_dst || 0),
      locale: res.languages?.split(',')[0] || ''
      // name: res.time_zone.name,
      // value: res.time_zone.offset,
    },
    location: {
      longitude: parseFloat(res.longitude),
      latitude: parseFloat(res.latitude),
      precision: random.int(10, 5000)
    },
    'ua-language': {
      // language: res.languages?.split(',')[0],
      value: res.languages?.split(',')[0] || ''
    }
  }

  await chromeSend('setIpGeo', ipGeo).catch((err: Error) => {
    console.warn(err)
  })

  const fp = await FingerprintJS.load()
  const result = await fp.get()
  visitorId.value = result.visitorId
  fingerprint.value = result.components
})

const getZone = (offset: number) => {
  const plus = offset < 0 ? '+' : ''
  return 'Etc/GMT' + plus + -offset
}

const formatResult = (json: JSON) => {
  let colorJson = formatHighlight(json)
  colorJson = colorJson.replace(/"data:image\/.+?"/g, ($0: string) => {
    return `<img src=${$0} style="vertical-align: text-top;" />`
  })

  return colorJson
}
</script>

<style lang="scss">
.container {
  width: 1000px;
  margin: auto;

  header {
    display: flex;
    align-items: center;
    justify-content: center;

    & > * {
      margin: 10px 10px 15px;
    }
  }

  main {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 15px 30px 20px;

    .geo {
      text-align: center;

      h3 {
        font-size: 36px;
        margin: 5px;
      }
      code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono,
          monospace;
        font-size: 120%;
        white-space: break-spaces;
        background-color: rgba(175, 184, 193, 0.2);
        border-radius: 6px;
      }
      .item {
        border: 1px dashed rgba(128, 128, 128, 0.4);
        border-radius: 6px;
        line-height: 30px;
        padding: 5px 10px;

        span {
          margin: 0 5px;
        }

        &.country {
          color: #2c9100;
          font-weight: bold;

          img {
            height: 31px;
            vertical-align: top;
          }
        }
      }
    }

    .card {
      --el-card-padding: 10px;
      pre {
        margin: 0;
      }
    }

    .network-error {
      max-width: 200px;
      margin: auto;

      h1 {
        color: rgb(32, 33, 36);
        font-weight: 500;
      }
      p {
        color: rgb(95, 99, 104);
      }
    }
  }

  .timeline {
    padding: 0;
  }
}
</style>
