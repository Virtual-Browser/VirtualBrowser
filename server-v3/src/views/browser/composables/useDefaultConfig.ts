import {reactive, ref, watch} from 'vue'
import TimeZones from '@/utils/timezones.json'
import {
    genRandomComputerName,
    genRandomMacAddr,
    genRandomSpeechVoices,
    genUserAgent,
    getRandomCpuCore,
    getRandomMemorySize,
    getUaFullVersion
} from '@/utils'
import {Versions, chromiumCoreVer} from '@/utils/versions'
import uaFullVersions from '@/utils/ua-full-versions.json'
import random from 'random'
import {getFontList} from '@/utils/fonts'
import WebGLRenders from '@/utils/webgl.json'
import SSL from '@/utils/ssl.json'
import type {IBrowserConfig} from '@/Interface'
import {useRoute} from 'vue-router'
import {getBrowser} from '@/api/native'

export const getZone = function (offset: number) {
    const sign = offset > 0 ? '+' : '-'
    const hours = Math.floor(Math.abs(offset))
    const decimal = Math.abs(offset) - hours
    const minutes = Math.round(decimal * 60)
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes.toString()
    return `UTC${sign}${hours}:${paddedMinutes}`
}

export const createCachedTimeZone = function () {
    const timezoneOffset = new Date().getTimezoneOffset() / -60
    return TimeZones.find((item) => item.offset === timezoneOffset)
}

export const createWebGLVendors = function () {
    return Array.from(
        new Set(
            WebGLRenders.map((item) => {
                const match = item.match(/\((.+?),/)
                if (match && match[1]) {
                    return `Google Inc. (${match[1]})`
                }
            })
        )
    )
}

const createSSLList = function (): { label: string; value: string }[] {
    const list = []
    for (const key in SSL) {
        list.push({
            label: key,
            value: SSL[key as keyof typeof SSL]
        })
    }
    return list
}

export const changeDevicename = function (form: IBrowserConfig) {
    form['device-name'].value = genRandomComputerName()
}

export const changeMac = function (form: IBrowserConfig) {
    form['mac'].value = genRandomMacAddr()
}

export const changeUA = function (form: IBrowserConfig, osVer: string, chromeVer: string) {
    form['ua'].value = genUserAgent(osVer, chromeVer)
}
export const useDefaultConfig = async function () {
    const route = useRoute()
    const {id} = route.params as { id?: string }
    const osVer = ref('10.0')
    const chromeVer = ref('')
    const currentZone = ref(createCachedTimeZone())
    const fontList = ref(getFontList())
    const webGLVendors = ref(createWebGLVendors())
    const webGLRenders = ref(WebGLRenders)
    const versions = ref(Versions)
    const cpuCore = ref(getRandomCpuCore())
    const memorySize = ref(getRandomMemorySize(cpuCore.value))
    const sslList = ref(createSSLList())

    const IPGeo = ref({
        languages: '',
        longitude: '',
        latitude: ''
    })

    const formState = reactive<IBrowserConfig>(
        (await getBrowser(id)) ?? {
            id: undefined,
            name: '',
            group: '默认分组',
            os: 'Win 11',
            chrome_version: '默认',
            proxy: {
                mode: 0,
                value: '',
                protocol: 'HTTP',
                host: '',
                port: '',
                user: '',
                pass: '',
                API: '',
                url: ''
            },
            cookie: {
                mode: 0,
                value: '',
                jsonStr: ''
            },
            homepage: {
                mode: 0,
                value: ''
            },
            ua: {
                mode: 1,
                value: genUserAgent(osVer.value, chromeVer.value)
            },
            'ua-full-version': {
                mode: 1,
                value: getUaFullVersion(uaFullVersions, chromeVer.value)
            },
            'sec-ch-ua': {
                mode: 0,
                value: [
                    {brand: 'Chromium', version: chromiumCoreVer},
                    {brand: 'Not=A?Brand', version: '99'}
                ]
            },
            'ua-language': {
                mode: 2,
                language: IPGeo.value.languages?.split(',')[0] || '',
                value: IPGeo.value.languages
            },
            'time-zone': {
                mode: 2,
                zone: getZone(currentZone.value?.offset || 0),
                utc: currentZone.value?.utc[0] || '',
                locale: IPGeo.value.languages?.split(',')[0] || '',
                name: currentZone.value?.text || '',
                value: currentZone.value?.offset || 0
            },
            webrtc: {
                mode: 0
            },
            location: {
                mode: 2,
                enable: 1,
                longitude: IPGeo.value.longitude,
                latitude: IPGeo.value.latitude,
                precision: random.int(10, 5000)
            },
            screen: {
                mode: 0,
                width: screen.width,
                height: screen.height,
                _value: `${screen.width} x ${screen.height}`
            },
            fonts: {
                mode: 1,
                value: fontList.value.sort(() => Math.random() - 0.5).slice(0, random.int(1, 10))
            },
            canvas: {
                mode: 1,
                r: random.int(-10, 10),
                g: random.int(-10, 10),
                b: random.int(-10, 10),
                a: random.int(-10, 10)
            },
            'webgl-img': {
                mode: 1,
                r: random.int(-10, 10),
                g: random.int(-10, 10),
                b: random.int(-10, 10),
                a: random.int(-10, 10)
            },
            webgl: {
                mode: 1,
                vendor: webGLVendors.value[random.int(0, webGLVendors.value.length - 1)],
                render: ''
            },
            'audio-context': {
                mode: 1,
                channel: random.float(0, 0.0000001),
                analyer: random.float(0, 0.1)
            },
            media: {mode: 1},
            'client-rects': {
                mode: 1,
                width: random.float(-1, 1),
                height: random.float(-1, 1)
            },
            speech_voices: {
                mode: 1,
                value: genRandomSpeechVoices()
            },
            ssl: {
                mode: 0,
                value: []
            },
            cpu: {mode: 1, value: cpuCore.value},
            memory: {mode: 1, value: memorySize.value},
            'device-name': {mode: 1, value: genRandomComputerName()},
            mac: {mode: 1, value: genRandomMacAddr()},
            dnt: {mode: 1, value: 0},
            'port-scan': {mode: 1, value: []},
            gpu: {mode: 1, value: 1},
            start: {value: ''}
        }
    )

    console.log(formState)

    watch(
        () => formState.ua.mode,
        () => {
            console.log(formState.ua.mode)
        }
    )

    return {
        formState,
        chromeVer,
        cpuCore,
        IPGeo,
        memorySize,
        webGLVendors,
        fontList,
        currentZone,
        osVer,
        versions,
        webGLRenders,
        sslList
    }
}
