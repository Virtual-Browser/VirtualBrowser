import voices from '@/utils/speech-voices.json'
import random from 'random'
import {v4 as uuid_v4} from 'uuid'

export function genUserAgent(osVer: string, chromeVer: string) {
    const arch = Math.random() < 0.5 ? 'WOW64' : 'Win64; x64'
    return `Mozilla/5.0 (Windows NT ${osVer}; ${arch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer} Safari/537.36`
}

export function getUaFullVersion(uaFullVersions: string[], chromeVer: string) {
    const val = Number(chromeVer.split('.')[0])

    const matchingFullVersions = uaFullVersions.filter((item) => Number(item.split('.')[0]) === val)

    let uaFullVersion
    if (matchingFullVersions.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingFullVersions.length)
        uaFullVersion = matchingFullVersions[randomIndex]
    } else {
        uaFullVersion = chromeVer
    }

    return uaFullVersion
}

export function getRandomCpuCore() {
    const cpuOptions = [2, 4, 6, 8, 12]
    return cpuOptions[Math.floor(Math.random() * cpuOptions.length)]
}

export function getRandomMemorySize(minCpuCore: number) {
    const memoryOptions = [2, 4, 8, 16, 32, 64]
    let startIndex = memoryOptions.findIndex((size) => size >= minCpuCore)
    if (startIndex === -1) {
        startIndex = memoryOptions.length - 1
    }
    return memoryOptions[startIndex + Math.floor(Math.random() * (memoryOptions.length - startIndex))]
}

export function genRandomSpeechVoices() {
    voices.sort(() => Math.random() - 0.5)
    const ret = voices.slice(0, random.int(3, 5))
    return ret.map((item) => {
        return {
            default: item.default,
            lang: item.lang,
            localService: item.localService,
            name: item.name,
            voiceURI: item.voiceURI
        }
    })
}

export function genRandomComputerName() {
    const e = uuid_v4().split('-')
    return 'DESKTOP-' + e.shift()!.toUpperCase()
}

export function genRandomMacAddr() {
    for (var e = [], t = 0; t < 6; t++) e[t] = Math.floor(256 * Math.random())

    function o(e: number) {
        return e < 16 ? '0' + e.toString(16) : e.toString(16)
    }

    e[0] = (252 & e[0]) | 2

    return e.map(o).join('-').toUpperCase()
}


export function loadScript(src: string) {
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)
}
