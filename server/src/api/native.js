import { v4 as uuid_v4 } from 'uuid'

/* eslint-disable */
window.cr = {}
cr.__callbacks = {}
cr.webUIResponse = function (cb, status, data) {
  const callbackFn = cr.__callbacks[cb]
  callbackFn && callbackFn(data)
}

window.updateLaunchState = function () {
  updateRuningState()
}

export async function chromeSendTimeout(name, timeout = 2000, ...params) {
  const pTimeOut = timeout => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('timeout')
      }, timeout)
    })
  }
  const pCall = new Promise(resolve => {
    const callbackName = 'callback_' + uuid_v4()
    cr.__callbacks[callbackName] = data => {
      resolve(data)
    }

    const args = [callbackName].concat(params)
    console.log(`chrome.send("${name}", `, args, `)`)
    chrome.send(name, args)
  })

  return Promise.race([pCall, pTimeOut(timeout)])
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

export async function getBrowserList() {
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
  const maxId = Math.max(0, Math.max(...list.map(item => item.id)))
  item.id = maxId + 1
  item.name = item.name || prefix + item.id

  list.push(item)

  const data = { users: list }
  localStorage.setItem('list', JSON.stringify(data))
  await chromeSend('setBrowserList', data).catch(err => {
    console.warn(err)
  })
}
export async function updateBrowser(item) {
  const list = await getBrowserList()
  const idx = list.findIndex(it => it.id === item.id)
  list[idx] = item

  const data = { users: list }
  localStorage.setItem('list', JSON.stringify(data))
  await chromeSend('setBrowserList', data).catch(err => {
    console.warn(err)
  })
}
export async function deleteBrowser(id) {
  await chromeSend('deleteBrowser', id).catch(() => {})

  const list = await getBrowserList()
  const idx = list.findIndex(it => it.id === id)

  list.splice(idx, 1)

  const data = { users: list }
  localStorage.setItem('list', JSON.stringify(data))
  await chromeSend('setBrowserList', data).catch(err => {
    console.warn(err)
  })
}

export async function updateRuningState() {
  const runingIds = await chromeSend('getRuningBrowser').catch(() => {})
  window._updateState && window._updateState(runingIds || [])
}

export async function getBrowserVersion() {
  const ret = await chromeSend('getBrowserVersion')

  return ret
}

export async function getGroupList() {
  let list
  try {
    list = JSON.parse(localStorage.getItem('group'))
  } catch {
    //
  }

  return list || []
}
export async function addGroup(item, defaultName) {
  const list = await getGroupList()
  const maxId = Math.max(0, Math.max(...list.map(item => item.id)))
  item.id = maxId + 1
  item.name = item.name || defaultName + ' ' + item.id

  list.push(item)

  localStorage.setItem('group', JSON.stringify(list))
}
export async function updateGroup(item) {
  const list = await getGroupList()
  const idx = list.findIndex(it => it.id === item.id)
  list[idx] = item

  localStorage.setItem('group', JSON.stringify(list))
}
export async function deleteGroup(id) {
  const list = await getGroupList()
  const idx = list.findIndex(it => it.id === id)

  list.splice(idx, 1)

  localStorage.setItem('group', JSON.stringify(list))
}
