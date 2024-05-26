import {unref, watch, type Ref} from 'vue'
import random from 'random'
import uaFullVersions from '@/utils/ua-full-versions.json'
import {genUserAgent, getUaFullVersion} from '@/utils'
import WebGLRenders from '@/utils/webgl.json'
import type {IBrowserConfig} from '@/Interface'
import {Versions, chromiumCoreVer} from '@/utils/versions'

export const useWatch = function (
    form: IBrowserConfig,
    chromeVer: Ref<string>,
    osVer: Ref<string>,
    version: Ref<string[]>,
    webGLVendors: Ref<(string | undefined)[]>,
    webGLRenders: Ref<string[]>
) {
    //监听代理
    watch(
        () => form.proxy.host,
        (newVal) => {
            const parts = newVal.split(':')
            if (parts.length === 4) {
                form.proxy.host = parts[0]
                form.proxy.port = parts[1]
                form.proxy.user = parts[2]
                form.proxy.pass = parts[3]
            } else if (parts.length === 2) {
                form.proxy.host = parts[0]
                form.proxy.port = parts[1]
                form.proxy.user = ''
                form.proxy.pass = ''
            }
        }
    )

    watch(
        () => form.screen._value,
        (val) => {
            const wh = val.split('x')
            form.screen.width = parseInt(wh[0])
            form.screen.height = parseInt(wh[1])
        }
    )

    watch(
        () => form.chrome_version,
        (val) => {
            if (val === '默认') {
                val = unref(chromiumCoreVer)
                form.ua.mode = 0
            } else {
                form.ua.mode = 1
            }
            form['sec-ch-ua'].value.forEach((item) => {
                if (item.brand === 'Chromium') {
                    item.version = val
                }
            })
            const curVers = Versions.filter((item) => Number(item.split('.')[0]) === val)
            chromeVer.value = curVers[random.int(0, curVers.length - 1)]
            form.ua.value = genUserAgent(osVer.value, chromeVer.value)
            form['ua-full-version'].value = getUaFullVersion(uaFullVersions, chromeVer.value)
        }, {
            immediate: true
        }
    )

    watch(
        () => form.os,
        (val) => {
            switch (val) {
                case 'Win 7':
                    osVer.value = '6.1'
                    break
                case 'Win 8':
                    osVer.value = '6.2'
                    break
                case 'Win 10':
                case 'Win 11':
                    osVer.value = '10.0'
                    break
            }

            form.ua.value = genUserAgent(osVer.value, chromeVer.value)
            let vers = Array.from(new Set(Versions.map((item) => Number(item.split('.')[0]))))
            if (val === 'Win 7' || val === 'Win 8') {
                vers = vers.filter((item) => item <= 109)
            }
            //@ts-ignore
            vers.unshift('默认')
            version.value = vers
            if (!vers.includes(form.chrome_version)) {
                form.chrome_version = vers[0]
            }
        },
        {
            immediate: true
        }
    )

    watch(
        () => form.webgl.vendor,
        (val) => {
            if (!val) return
            const vendor = val.match(/\((.+?)\)/)[1]
            webGLRenders.value = WebGLRenders.filter((item) => item.match(/\((.+?),/)![1] === vendor)
            if (!webGLRenders.value.includes(form.webgl.render)) {
                form.webgl.render =
                    webGLRenders.value.length > 0
                        ? webGLRenders.value[random.int(0, webGLRenders.value.length - 1)]
                        : ''
            }
        },
        {
            deep: true,
            immediate: true
        }
    )
    watch(() => form['ua-language'].language, (val) => {
        form['ua-language'].value = [val, val.split('-')[0]].join(',')
        form['time-zone'].locale = val
    }, {
        immediate: true
    })
}
