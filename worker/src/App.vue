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
      </div>
      <el-timeline v-if="false" class="timeline">
        <el-timeline-item
          v-for="(value, key, index) in fingerprint"
          :key="index"
          :timestamp="key"
          placement="top"
        >
          <el-card class="card"><pre v-html="formatResult(value.value)"></pre></el-card>
        </el-timeline-item>
      </el-timeline>
    </main>
  </section>
</template>

<script lang="ts" setup>
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { onMounted, ref } from 'vue'
import formatHighlight from 'json-format-highlight'
import { chromeSend } from './utils/native.js'
import random from 'random'

const geo = ref({
  time_zone: {},
})
const fingerprint = ref()
const visitorId = ref('')

onMounted(async () => {
  const req = await fetch(
    'https://api.ipgeolocation.io/ipgeo?apiKey=36d02a0030f940e6a4922d553f2e3f00'
  )
  const res = await req.json()
  geo.value = res

  const ipGeo = {
    'time-zone': {
      zone: getZone(res.time_zone.offset || 0),
      locale: res.languages?.split(',')[0] || '',
      // name: res.time_zone.name,
      // value: res.time_zone.offset,
    },
    location: {
      longitude: parseFloat(res.longitude),
      latitude: parseFloat(res.latitude),
      precision: random.int(10, 5000),
    },
    'ua-language': {
      // language: res.languages?.split(',')[0],
      value: res.languages,
    },
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
  }

  .timeline {
    padding: 0;
  }
}
</style>
