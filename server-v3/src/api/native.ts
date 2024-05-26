//@ts-nocheck

import {v4 as uuid_v4} from 'uuid'
import type {IBrowserConfig, IGroupRecord} from '@/Interface'

window.cr = {}
cr.__callbacks = {}
cr.webUIResponse = function (cb, status, data) {
    const callbackFn = cr.__callbacks[cb]
    callbackFn && callbackFn(data)
}
window.updateLaunchState = function () {
    console.log(updateLaunchState)
    updateRuningState()
}

export async function chromeSend(name, ...params) {
    return chromeSendTimeout(name, 2000, ...params)
}

export async function getGlobalData() {
    let GlobalData
    try {
        GlobalData = JSON.parse(localStorage.getItem('GlobalData'))
        if (Object.prototype.toString.call(GlobalData) === '[object Array]') {
            GlobalData = {}
        }
        GlobalData = await chromeSend('getGlobalData')
        GlobalData = JSON.parse(GlobalData.data)
        if (Object.prototype.toString.call(GlobalData) === '[object Array]') {
            GlobalData = {}
        }
    } catch {
        //
    }

    return GlobalData || {}
}

export async function setGlobalData(key, value) {
    const GlobalData = await getGlobalData()
    GlobalData[key] = value

    localStorage.setItem('GlobalData', JSON.stringify(GlobalData))
    await chromeSend('setGlobalData', JSON.stringify(GlobalData)).catch(console.warn)
}

export async function chromeSendTimeout(name: string, timeout = 2000, ...params: any[]) {
    const pTimeOut = (timeout: number) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('timeout')
            }, timeout)
        })
    }
    const pCall = new Promise((resolve) => {
        const callbackName = 'callback_' + uuid_v4()
        cr.__callbacks[callbackName] = (data) => {
            resolve(data)
        }
        const args = [callbackName].concat(params)
        console.log(`chrome.send("${name}", `, args, `)`)
        chrome.send(name, args)
    })

    return Promise.race([pCall, pTimeOut(timeout)])
}

export async function getGroupList() {
    let list
    try {
        list = JSON.parse(localStorage.getItem('group') || '[]') as IGroupRecord[]
    } catch {
        //
    }

    return list || []
}

export async function addGroup(item: Omit<IGroupRecord, 'id'>, defaultName?: string) {
    const list = await getGroupList()
    const maxId = Math.max(0, Math.max(...list.map((item) => item.id)))
    list.push({
        ...item,
        id: maxId + 1,
        name: item.name,
        timestamp: new Date().getTime() + ''
    })
    localStorage.setItem('group', JSON.stringify(list))
}

export async function updateGroup(item: IGroupRecord) {
    const list = await getGroupList()
    const idx = list.findIndex((it) => it.id === item.id)
    list[idx] = item
    localStorage.setItem('group', JSON.stringify(list))
}

export async function deleteGroup(id: number) {
    const list = await getGroupList()
    const idx = list.findIndex((it) => it.id === id)

    list.splice(idx, 1)

    localStorage.setItem('group', JSON.stringify(list))
}

export async function getBrowserList(): Promise<IBrowserConfig[]> {
    let list
    try {
        list = JSON.parse(localStorage.getItem('list'))
        list = await chromeSend('getBrowserList')
        list = list.data
    } catch {
        //
    }
    return (list && list.users) || []
}

export async function addBrowser(item, defaultName) {
    const prefix = defaultName ? defaultName + ' ' : ''
    const list = await getBrowserList()
    const maxId = Math.max(0, Math.max(...list.map((item) => item.id)))
    item.id = maxId + 1
    item.name = item.name || prefix + item.id
    list.push(item)

    const data = {users: list}
    localStorage.setItem('list', JSON.stringify(data))
    await chromeSend('setBrowserList', data).catch((err) => {
        console.warn(err)
    })
}

export async function deleteBrowser(id) {
    await chromeSend('deleteBrowser', id).catch(() => {
    })

    const list = await getBrowserList()
    const idx = list.findIndex((it) => it.id === id)

    list.splice(idx, 1)

    const data = {users: list}
    localStorage.setItem('list', JSON.stringify(data))
    await chromeSend('setBrowserList', data).catch((err) => {
        console.warn(err)
    })
}

export async function updateBrowser(item) {
    const list = await getBrowserList()
    const idx = list.findIndex((it) => it.id === item.id)
    list[idx] = item

    const data = {users: list}
    localStorage.setItem('list', JSON.stringify(data))
    await chromeSend('setBrowserList', data).catch((err) => {
        console.warn(err)
    })
}

export const getBrowser = async function (id?: number | string) {
    const list = await getBrowserList()
    const config = list.find((it) => it.id == id)
    return config || undefined
}

export async function updateRuningState() {
    const runingIds = await chromeSend('getRuningBrowser').catch(() => {
    })
    window._updateState && window._updateState(runingIds || [])
}
