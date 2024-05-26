import { defineStore } from 'pinia'

export const useBrowserStore = defineStore('gobal_store', {
  state() {
    return {
      isChrome: window.chrome.send,
      isElectron: window.electron
    }
  },
  getters: {},
  actions: {}
})
